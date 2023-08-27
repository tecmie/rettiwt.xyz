/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { env } from '@/env.mjs';
import { prisma } from '@/server/db';
import { queue, QueueTask } from '@/utils/queue';
import { ITweetIntent } from '@/types/tweet.type';
import { type Author, type Follow, type Tweet } from '@prisma/client';
import { MetricType, OpenAIEmbeddingFunction, connect } from 'vectordb';
import {
  _AI_TEMPERATURE_MEDIUM_,
  _GPT316K_MODEL_,
  _VECTOR_SOURCE_COLUMN_,
} from '@/utils/constants';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import xquoter, { QuoteTaskPayload } from './handlers/quoter';
import xliker, { LikeTaskPayload } from './handlers/liker';
import xcommenter, { CommentTaskPayload } from './handlers/commenter';
import xretweeter, { RetweetTaskPayload } from './handlers/retweeter';
import { BroadcastOpinionPrompt } from './prompts';
import _ from 'lodash';

export type EmbeddingRequestData = Partial<Tweet> & {
  actor: Author;
  context: string;
  intent: ITweetIntent;
};

export type BroadcastOpinionData = Tweet & {
  actor: Author;
  context: string;
  followers: Follow[];
  following: Follow[];
};

/**
 * Embedding function for our vector database.
 * @see https://lancedb.github.io/lancedb
 */
const embeddings = new OpenAIEmbeddingFunction(_VECTOR_SOURCE_COLUMN_, env.OAK);

/**
 * @function embeddingsFromTweet
 * Creates a vector embedding for the given tweet payload and embeddings function.
 *
 * @param {EmbeddingRequestData} payload - The tweet payload to create a vector embedding for.
 * @returns {Promise<void>} - A promise that resolves when the vector embedding has been created.
 */
export async function embeddingsFromTweet(payload: EmbeddingRequestData) {
  const db = await connect('vectors');

  const { id, intent, context, timestamp, actor } = payload;

  /**
   * @note
   * Something to note when working with LanceDB is that the order
   * of your data payload matters, and should remain constant with how it was
   * when you created the vector table. It should never changes
   *
   * @see /scripts/vectorize-tweets.js
   */
  const data = {
    url: `https://rettiwt.xyz/status/${id}`,
    type: String(intent),
    text: context,
    username: actor.handle,
    timestamp,
  };

  try {
    /* You must open the table with the embedding function */
    const table = await db.openTable(payload.actor.handle, embeddings);
    await table.add([data]);
    console.log({
      table,
      owner: payload.actor.handle,
      message: `A valid table has been found 🎉 for ${intent} ${id}`,
    });
  } catch (error: any) {
    console.error({ owner: data.username, error });
    throw new Error(JSON.stringify({ error, data }));
  }
}

/**
 * Finds an author and a tweet using their respective IDs or handles from the database.
 *
 * @param {Object} payload - An object containing identifiers for the author and tweet.
 * @param {string} payload.authorId - The ID of the author to find.
 * @param {string} payload.tweetId - The ID of the tweet to find.
 * @param {string} payload.authorUsername - The username of the author to find.
 *
 * @returns {Promise<{author: Author; tweet: Tweet} | null>} - A Promise that resolves with the Author and Tweet entities or `null` if not found.
 *
 * @example
 * const { author, tweet } = await lookupAuthorAndTweet({ authorId: "someId", authorUsername: "username", tweetId: "someTweetId" });
 */

async function lookupAuthorAndTweet(
  payload: Omit<LikeTaskPayload, 'delayNumberInMilliseconds'>,
): Promise<{ author: Author; tweet: Tweet } | null> {
  const { authorId, tweetId, authorUsername } = payload;

  /**
   * @operation
   *
   * This is a fail safe find operation to ensure we have a
   * valid author from the agent executor
   */
  const author = await prisma.author.findFirst({
    where: {
      OR: [{ id: authorId }, { handle: authorUsername }],
    },
  });

  if (!author) {
    console.warn(
      `[lookupAuthorAndTweet] Author not found for ID: ${authorId} or username: ${authorUsername}`,
    );
    return null;
  }

  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
    },
  });

  if (!tweet) {
    console.warn(`[lookupAuthorAndTweet] Tweet not found for ID: ${tweetId}`);
    return null;
  }

  return { author, tweet };
}

/**
 * @listens QueueTask.EmbedOpinion
 *
 * Listen for the 'embed tweet' queue task and embed the tweet.
 *
 * @param {QueueTask.EmbedOpinion} taskName - The name of the queue task.
 * @param {Array<unknown>} args - The arguments passed to the queue task.
 * @param {string} args.intent - The type of operation for embedding a tweet.
 * @param {Tweet} args.payload - The data payload for the tweet embedding.
 * @param {string} args.payload.intent - The intent related to the tweet.
 * @param {string} args.payload.author_id - The ID of the author.
 * @param {Object} args.payload.rest - Remaining payload properties.
 *
 * @returns {Promise<void>} - A promise that resolves when the tweet has been embedded.
 */
queue.on(QueueTask.EmbedOpinion, async (...[intent, payload]) => {
  try {
    // Parse the payload
    const parsedPayload = JSON.parse(payload);
    const {
      intent: tweetIntent,
      author_id: authorId,
      ...rest
    } = parsedPayload as Tweet;

    // Check if the intent is 'tweet'
    if (tweetIntent !== intent) {
      console.error(
        `Bad intent schema.tweet, ${tweetIntent} listener: ${intent}`,
      );
      return;
    }

    // Find the unique author in the Prisma database
    const author = await prisma.author.findUnique({
      where: { id: authorId },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!author) {
      console.error('Author not found:', authorId);
      return;
    }
    const { following, followers, ...actor } = author;

    /**
     * all checks passed, we can prepare our payload for embedding
     * Then we can go ahead and embed the tweet
     */
    const data = {
      actor,
      id: rest.id,
      timestamp: rest.timestamp,
      intent: tweetIntent as ITweetIntent,
      context: `At ${rest.timestamp}, ${author.handle} performed a ${tweetIntent} ACTION by writing a brand new post that says "${rest.content}"`,
    };
    await embeddingsFromTweet(data);

    /**
     * This is where we now broadcast this new intent to the rest of the listeners
     * Notifying all our followers of a new tweet action from a X user.
     */
    queue.send({
      event: QueueTask.BroadcastOpinion,
      args: [
        tweetIntent,
        {
          ...rest,
          ...data,
          content: rest.content,
          followers: followers,
          following: following,
        },
      ],
    });

    console.log(`Successfully embedded tweet for  ${author.name}`);
  } catch (error) {
    console.error('Error embedding tweet:', error);
  }
});

/**
 * @listens QueueTask.BroadcastOpinion
 *
 * This function listens to a broadcast event and performs a vector similarity search step for each follower.
 * It then constructs a context and calls an agent executor function to react to new tweets on the follower's timeline.
 *
 * @param {string} args.intent - The type of broadcast operation.
 * @param {BroadcastOpinionData} args.payload - The data payload for the broadcast event.
 * @param {Array<Following>} args.payload.following - The array of authors they are following.
 * @param {Array<Followers>} args.payload.followers - The array of followers.
 *
 * @returns {Promise<void>} - A Promise that resolves when the broadcast operation is complete.
 */
queue.on(QueueTask.BroadcastOpinion, async (...[intent, payload]) => {
  /**
   * Agent Executor with Langchain Tools
   * This uses the OpenAI Function Call kwargs available in GPT3.5 and GPT4
   *
   * @see https://js.langchain.com/docs/modules/agents/agent_types/openai_functions_agent
   */
  const tools = [xquoter, xliker, xcommenter, xretweeter];

  const chat = new ChatOpenAI({
    modelName: _GPT316K_MODEL_,
    temperature: _AI_TEMPERATURE_MEDIUM_,
    openAIApiKey: env.OAK,
    verbose: true,
  });

  /**
   * Initialize Vector Retrieval step for our actor
   * We are using LanceDB as our db for vector retrieval
   **/
  const db = await connect('vectors');

  const {
    content: initialContext,
    followers,
    following,
    ...meta
  } = payload as BroadcastOpinionData;

  // 1. Iterate through the array of followers
  for (const follower of followers) {
    try {
      // 2. Get the full author object for each following_id
      const author = await prisma.author.findUnique({
        where: {
          id: follower.following_id,
        },
      });

      if (!author) {
        console.warn(`Author not found for ID: ${follower.following_id}`);
        continue;
      }

      /**
       * @operation
       *
       * We perform the vector similarity search step here. We are using an
       * Euclidean distance to get very similar interactions  although this could limit
       * the number of results we can retrieve due to our very small dataset
       */
      const table = await db.openTable(author.handle, embeddings);
      const results = await table
        .search(meta.context)
        .metricType(MetricType.L2)
        .select(['type', 'text', 'url'])
        .limit(10)
        .execute();

      /**
       * we combine all similarity data from embeddings into a string format
       */
      const subContext = results.map((r) => r.text).join('\n\n---\n\n');

      const prefix = await BroadcastOpinionPrompt.format({
        author_name: author.name,
        author_handle: author.handle,
        author_id: author.id,
        author_bio: author.bio,
        num_followers: followers.length,
        num_following: following.length,
        sub_context: subContext,
      });

      const executor = await initializeAgentExecutorWithOptions(tools, chat, {
        agentType: 'openai-functions',
        verbose: true,
        agentArgs: {
          prefix,
        },
      });

      // 3. Construct the context
      const context = `How are you going to react to 
      ${meta.actor.name}'s ${meta.intent.toUpperCase()} ACTION to Tweet.ID 
      ${meta.id} with summary of this interaction: "${meta.context}"?`;

      // 4. Call the executor function
      const result = await executor.run(context);

      /**
       * @operation
       *
       * we persist the result from our LLM as sentiments
       * We can use mine this information further to derive
       * other intents and analysis
       *
       */
      await prisma.sentiment.create({
        data: {
          author_id: author.id,
          tweet_id: meta.id,
          text: String(result),
        },
      });

      continue;
    } catch (error) {
      console.error(
        `${error} executing ${intent} broadcast operation for: 
         ${JSON.stringify(follower, null, 2)}
        `,
      );
      continue;
    }
  }
  console.log(`Successfully executed broadcast for  ${payload.id}`);
});

/**
 * @listens QueueTask.ExecuteLike
 *
 * This function listens for the `QueueTask.ExecuteLike` event from the queue and executes a "like" operation on a tweet.
 *
 * @param {Object[]} args - An array containing the intent and the payload for the queue task.
 * @param {string} args[0].intent - The operation type (e.g., "LIKE", "RETWEET").
 * @param {LikeTaskPayload} args[0].payload - The data payload containing `tweetId`, `authorId`, `authorUsername`.
 *
 * @returns {Promise<void>} - A Promise that resolves when the like operation is complete.
 *
 */
queue.on(QueueTask.ExecuteLike, async (...[intent, payload]) => {
  console.log(`Received a ${intent} from the queue:`, payload);

  console.log(
    '<><><><><><><><><><><><>><><><><<><><><>><><><><><><><><><><><><><><><><><><><><><><<><><><><><><><><<><><><><><><><><><> Received a LIKE from the queue:',
    payload,
  );

  const { tweetId, authorId, authorUsername } = payload as LikeTaskPayload;

  try {
    const authorTweetObj = await lookupAuthorAndTweet({
      tweetId,
      authorId,
      authorUsername,
    });
    if (!authorTweetObj) return;

    const { author, tweet } = authorTweetObj;

    /**
     * @operation
     */
    const trans = await prisma.$transaction([
      prisma.like.create({
        data: {
          author_id: author.id,
          tweet_id: tweet.id,
          origin_state: JSON.stringify(tweet),
        },
      }),
      prisma.tweet.update({
        where: { id: tweet.id },
        data: {
          favorite_count: {
            increment: 1,
          },
        },
      }),
    ]);

    /**
     * @operation
     *
     * Sends a new event to the queue with the `QueueTask.EmbedReaction` task and the `ITweetIntent.LIKE` intent.
     * The `args` parameter contains a JSON stringified object with the `like`, `tweet`, and `author` objects.
     */
    queue.send({
      event: QueueTask.EmbedReaction,
      args: [
        ITweetIntent.LIKE,
        JSON.stringify({ like: trans[0], tweet: trans[1], author }),
      ],
    });

    /**
     * Log a success message to the console.
     */
    console.log(`[QueueTask.ExecuteLike] successful for ${tweetId}`);
  } catch (error) {
    /**
     * Log an error message to the console if an error occurs.
     */
    console.error(`[QueueTask.ExecuteLike] ${authorUsername} error ${error}`);
  }
});

/**
 * @listens QueueTask.ExecuteQuote
 *
 * This function listens for the `QueueTask.ExecuteQuote` event from the queue and executes a "quote" operation on a tweet.
 *
 * @param {Object[]} args - An array containing the intent and the payload for the queue task.
 * @param {string} args[0].intent - The operation type (e.g., "QUOTE").
 * @param {QuoteTaskPayload} args[0].payload - The data payload containing `tweetId`, `authorId`, `authorUsername`, and `content`.
 *
 * @returns {Promise<void>} - A Promise that resolves when the quote operation is complete.
 *
 */
queue.on(QueueTask.ExecuteQuote, async (...[intent, payload]) => {
  console.log(`Received a ${intent} from the queue:`, payload);

  console.log(
    '<><><><><><><><><><><><>><><><><<><><><>><><><><><><><><><><><><><><><><><><><><><><<><><><><><><><><<><><><><><><><><><> Received a QUOTE from the queue:',
    payload,
  );

  const { tweetId, authorId, authorUsername, content } =
    payload as QuoteTaskPayload;

  try {
    /**
     * @operation
     */
    const authorTweetObj = await lookupAuthorAndTweet({
      tweetId,
      authorId,
      authorUsername,
    });

    if (!authorTweetObj) return;
    const { author, tweet } = authorTweetObj;

    /**
     * @operation
     */
    const [quote] = await prisma.$transaction([
      prisma.tweet.create({
        data: {
          content,
          intent: ITweetIntent.QUOTE,
          author_id: author.id,
          is_reply_tweet: false,
          is_quote_tweet: true,
          quote_parent_id: tweet.id,
        },
      }),

      prisma.tweet.update({
        where: { id: tweet.id },
        data: {
          quote_count: {
            increment: 1,
          },
        },
      }),
    ]);

    /**
     * @operation
     *
     * Schedules a new event to the queue with the `QueueTask.EmbedOpinion` task and the `ITweetIntent.QUOTE` intent.
     * The `args` parameter contains a JSON stringified object with the `quote` object.
     */
    queue.schedule({
      event: QueueTask.EmbedOpinion,
      delay: 5000,
      args: [ITweetIntent.QUOTE, JSON.stringify(quote)],
    });

    /**
     * Log a success message to the console.
     */
    console.log(`[QueueTask.ExecuteQuote] successful for ${tweetId}`);
  } catch (error) {
    /**
     * Log an error message to the console if an error occurs.
     */
    console.error(`[QueueTask.ExecuteQuote] ${authorUsername} error ${error}`);
  }
});

/**
 * @listens QueueTask.ExecuteComment
 *
 * Listens for the `QueueTask.ExecuteComment` event and executes the callback function when triggered.
 * The callback function receives a spread of arguments as `payload`, which is destructured
 * to obtain the `tweetId`, `authorId`, `content`, and `authorUsername` properties.
 *
 * @param {Object[]} args - An array containing the intent and the payload for the queue task.
 * @param {string} args[0].intent - The operation type (e.g., "QUOTE").
 * @param {CommentTaskPayload} args[1] - The data payload for the queue task.
 * @returns {Promise<void>} - A Promise that resolves when the quote operation is complete.
 */
queue.on(QueueTask.ExecuteComment, async (...[intent, payload]) => {
  console.log(`Received a ${intent} from the queue:`, payload);

  console.log(
    '<><><><><><><><><><><><>><><><><<><><><>><><><><><><><><><><><><><><><><><><><><><><<><><><><><><><><<><><><><><><><><><> Received a COMMENT from the queue:',
    payload,
  );

  const { tweetId, authorId, content, authorUsername } =
    payload as CommentTaskPayload;

  try {
    /**
     * @operation
     */
    const authorTweetObj = await lookupAuthorAndTweet({
      tweetId,
      authorId,
      authorUsername,
    });
    if (!authorTweetObj) return;

    const { author, tweet } = authorTweetObj;

    /**
     * @operation
     */
    const trans = await prisma.$transaction([
      prisma.tweet.create({
        data: {
          content,
          intent: ITweetIntent.REPLY,
          author_id: author.id,
          is_reply_tweet: true,
          is_quote_tweet: false,
          reply_parent_id: tweet.id,
        },
      }),

      prisma.tweet.update({
        where: { id: tweet.id },
        data: {
          reply_count: {
            increment: 1,
          },
        },
      }),
    ]);

    /**
     * @operation
     *
     * Schedules a new event to the queue with the `QueueTask.EmbedOpinion` task and the `ITweetIntent.QUOTE` intent.
     * The `args` parameter contains a JSON stringified object with the `comment` object.
     */
    queue.schedule({
      event: QueueTask.EmbedOpinion,
      delay: 5000,
      args: [ITweetIntent.QUOTE, JSON.stringify({ ...trans[0] })],
    });

    /**
     * Log a success message to the console.
     */
    console.log(`[QueueTask.ExecuteComment] successful for ${tweetId}`);
  } catch (error) {
    /**
     * Log an error message to the console if an error occurs.
     */
    console.error(
      `[QueueTask.ExecuteComment] ${authorUsername} error ${error}`,
    );
  }
});

/**
 * @listens QueueTask.ExecuteRetweet
 *
 * Listens for the `QueueTask.ExecuteRetweet` event and executes the callback function when triggered.
 * The callback function receives a spread of arguments as `payload`, which is destructured to obtain
 * the `tweetId`, `authorId`, and `authorUsername` properties.
 *
 * The function performs the following operations:
 * 1. Looks up the author and tweet by calling the `lookupAuthorAndTweet` function.
 * 2. Creates a retweet entry in the database by calling the `prisma.retweet.create` method.
 * 3. Sends a new event to the queue with the `QueueTask.EmbedReaction` task and the `ITweetIntent.RETWEET` intent.
 * 4. Logs a success message or error message to the console.
 *
 * @param {RetweetTaskPayload} payload - The data payload for the queue task.
 * @returns {Promise<void>} - A Promise that resolves when the retweet operation is complete.
 */
queue.on(QueueTask.ExecuteRetweet, async (...[intent, payload]) => {
  console.log(`Received a ${intent} from the queue:`, payload);

  console.log(
    '<><><><><><><><><><><><>><><><><<><><><>><><><><><><><><><><><><><><><><><><><><><><<><><><><><><><><<><><><><><><><><><> Received a RETWEET from the queue:',
    payload,
    intent,
  );

  const { tweetId, authorId, authorUsername } = payload as RetweetTaskPayload;

  try {
    /**
     * @operation
     */
    const authorTweetObj = await lookupAuthorAndTweet({
      tweetId,
      authorId,
      authorUsername,
    });

    if (!authorTweetObj) return;

    const { author, tweet } = authorTweetObj;

    /**
     * @operation
     */
    const [retweet, updatedTweet] = await prisma.$transaction([
      prisma.like.create({
        data: {
          author_id: author.id,
          tweet_id: tweet.id,
          origin_state: JSON.stringify(tweet),
        },
      }),
      prisma.tweet.update({
        where: { id: tweet.id },
        data: {
          repost_count: {
            increment: 1,
          },
        },
      }),
    ]);

    /**
     * @operation
     *
     * Sends a new event to the queue with the `QueueTask.EmbedReaction` task and the `ITweetIntent.RETWEET` intent.
     * The `args` parameter contains a JSON stringified object with the `RETWEET`, `tweet`, and `author` objects.
     */
    queue.send({
      event: QueueTask.EmbedReaction,
      args: [
        ITweetIntent.RETWEET,
        JSON.stringify({ retweet, tweet: updatedTweet, author }),
      ],
    });

    /**
     * Log a success message to the console.
     */

    console.log(`[QueueTask.ExecuteRetweet] successful for ${tweetId}`);
  } catch (error) {
    console.error(
      `[QueueTask.ExecuteRetweet] ${authorUsername} error ${error}`,
    );
  }
});
