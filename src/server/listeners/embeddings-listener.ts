/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { env } from '@/env.mjs';
import { prisma } from '@/server/db';
import { queue, QueueTask } from '@/utils/queue';
import { ITweetIntent } from '@/types/tweet.type';
import type { Retweet, Author, Follow, Tweet, Like } from '@prisma/client';
import { MetricType, OpenAIEmbeddingFunction, connect } from 'vectordb';
import {
  _AI_TEMPERATURE_MEDIUM_,
  _GPT316K_MODEL_,
  _VECTOR_SOURCE_COLUMN_,
} from '@/utils/constants';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import xquoter, { type QuoteTaskPayload } from './handlers/quoter';
import xliker, { type LikeTaskPayload } from './handlers/liker';
import xcommenter, { type CommentTaskPayload } from './handlers/commenter';
import xretweeter, { type RetweetTaskPayload } from './handlers/retweeter';
import { BroadcastPrompt } from './prompts';
import _ from 'lodash';

/**
 * @typedef Actor
 * An Actor is an author when in an interaction context
 */
export type Actor = Author;

export type LikeOrRetweet = Like | Retweet;

/**
 * @typedef
 * An engagement intent constructs a string of
 * actor.name and intent for reactions of opinions
 */
export type EngagementIntent = string;

export type LookupActorTweetReturnData = {
  tweet: Tweet & {
    /**  The author of the tweet */
    author: Author;
  };

  /** The actor performing the interaction on the tweet  */
  actor: Actor;
};

export interface CreateContextParams {
  timestamp: Date | string;
  intent: string;
  tweetMeta: Tweet;
  tweetAuthor: Author;
}

export type EmbeddingRequestData = Partial<Tweet> & {
  actor: Actor;
  context: string;
  intent: ITweetIntent;
};

export type TaskEmbedOpinionData = Tweet;
export type TaskEmbedReactionData = LookupActorTweetReturnData & {
  reaction: LikeOrRetweet;
};

export type BroadcastEventData = {
  id: Tweet['id'];
  actor: Actor;
  context: string;
  intent: EngagementIntent;
  followers: Follow[];
  following: Follow[];
};

/**
 * Embedding function for our vector database.
 * @see https://lancedb.github.io/lancedb
 */
const embeddings = new OpenAIEmbeddingFunction(_VECTOR_SOURCE_COLUMN_, env.OAK);

/**
 * @function embeddingsFromInteraction
 * Creates a vector embedding for the given engagement payload with the embeddings function.
 *
 * @param {EmbeddingRequestData} payload - The tweet payload to create a vector embedding for.
 * @returns {Promise<void>} - A promise that resolves when the vector embedding has been created.
 */
export async function embeddingsFromInteraction(payload: EmbeddingRequestData) {
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
 * const { author, tweet } = await lookupActorAndTweet({ authorId: "someId", authorUsername: "username", tweetId: "someTweetId" });
 */

async function lookupActorAndTweet(
  payload: Omit<LikeTaskPayload, 'delayNumberInMilliseconds'>,
): Promise<LookupActorTweetReturnData | null> {
  const { authorId, tweetId, authorUsername } = payload;

  /**
   * @operation
   *
   * This is a fail safe find operation to ensure we have a
   * valid author from the agent executor
   */
  const actor = await prisma.author.findFirst({
    where: {
      OR: [{ id: authorId }, { handle: authorUsername }],
    },
  });

  if (!actor) {
    console.warn(
      `[lookupActorAndTweet] Author not found for ID: ${authorId} or username: ${authorUsername}`,
    );
    return null;
  }

  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
    },
    include: {
      author: true,
    },
  });

  if (!tweet) {
    console.warn(`[lookupActorAndTweet] Tweet not found for ID: ${tweetId}`);
    return null;
  }

  return { actor, tweet };
}

/**
 * Create the Reaction context for our broadcast intents.
 *
 * This function constructs a context string for a tweet reaction,
 * incorporating various meta-data about the tweet and reaction.
 *
 * @param {CreateContextParams} params - The function parameters wrapped in an object.
 * @returns {Promise<string>} The constructed context string.
 */
async function creatInteractionContext(
  params: CreateContextParams,
): Promise<string> {
  const { tweetAuthor, tweetMeta, intent, timestamp } = params;
  /**
   * Additional information string initialized as empty.
   * It will contain extra details about the tweet if it's a quote or reply.
   * @type {string}
   */
  let additionalInfo = '';

  /**
   * @operation
   *
   * Check if the tweet is both a quote and a reply.
   * If so, set the additionalInfo string accordingly.
   */
  if (tweetMeta.is_quote_tweet && tweetMeta.is_reply_tweet) {
    const withQuotedComment = await prisma.tweet.findUnique({
      where: {
        id: tweetMeta.id,
      },
      include: {
        reply_parent: {
          include: {
            author: true,
          },
        },
        quote_parent: {
          include: {
            author: true,
          },
        },
      },
    });
    if (withQuotedComment) {
      const { quote_parent: quoted, reply_parent: commented } =
        withQuotedComment;

      additionalInfo = `
      Additional Context:
        This Tweet is both a QUOTE-TWEET ACTION to  ${quoted?.author.name} "@${
        quoted?.author.handle
      }" Tweet "${quoted?.content}" at time "${
        quoted?.timestamp ?? 'unknown'
      }". 
        and a THREAD-TWEET ACTION to ${commented?.author.name} "@${
        commented?.author.handle
      }" Tweet "${commented?.content}" at time "${
        commented?.timestamp ?? 'unknown'
      }"
      `;
    }
  } else {
    /**
     * @operation
     *
     * Check if the tweet is a quote.
     * If so, append to the additionalInfo string.
     */
    if (tweetMeta.is_quote_tweet) {
      const withQuote = await prisma.tweet.findUnique({
        where: {
          id: tweetMeta.id,
        },
        include: {
          quote_parent: {
            include: {
              author: true,
            },
          },
        },
      });
      if (withQuote) {
        const { quote_parent: quoted } = withQuote;

        additionalInfo += `
        Additional Context:
        This Tweet is a QUOTE-TWEET ACTION to  ${quoted?.author.name} "@${
          quoted?.author.handle
        }" Tweet "${quoted?.content}" at time "${
          quoted?.timestamp ?? 'unknown'
        }". 
        `;
      }
    }

    /**
     * @operation
     *
     * Check if the tweet is a reply.
     * If so, append to the additionalInfo string.
     */
    if (tweetMeta.is_reply_tweet) {
      const withQuotedComment = await prisma.tweet.findUnique({
        where: {
          id: tweetMeta.id,
        },
        include: {
          reply_parent: {
            include: {
              author: true,
            },
          },
        },
      });
      if (withQuotedComment) {
        const { reply_parent: commented } = withQuotedComment;

        additionalInfo = `
        Additional Context:
        This Tweet is a THREAD-TWEET ACTION to ${commented?.author.name} "@${
          commented?.author.handle
        }" Tweet "${commented?.content}" at time "${
          commented?.timestamp ?? 'unknown'
        }"
        `;
      }
    }
  }

  /**
   * Construct the context string incorporating all provided details.
   * @type {string}
   */
  const context = `At ${timestamp ?? 'unknown'}, ${String(
    intent,
  ).toUpperCase()} 
    with content: ${tweetMeta.content}
    This tweet was written by ${tweetAuthor.name} "@${tweetAuthor.handle}"
    at time "${tweetMeta.timestamp ?? 'unknown'}".

    ${additionalInfo}
  `;

  return context;
}

/**
 * @listens QueueTask.EmbedOpinion
 *
 * Listen for the 'embed tweet' queue task and embed the tweet.
 *
 * @param {QueueTask.EmbedOpinion} taskName - The name of the queue task.
 * @param {Array<unknown>} args - The arguments passed to the queue task.
 * @param {string} args.intent - The type of operation for embedding a tweet.
 * @param {TaskEmbedOpinionData} args.payload - The Tweet data payload for the opinion embedding.
 * @param {string} args.payload.intent - The intent related to the tweet.
 * @param {string} args.payload.author_id - The ID of the author.
 * @param {Object} args.payload.rest - Remaining payload properties.
 *
 * @returns {Promise<void>} - A promise that resolves when the tweet has been embedded.
 */
queue.on(QueueTask.EmbedOpinion, async (...[intent, payload]) => {
  try {
    const {
      intent: tweetIntent,
      author_id: authorId,
      ...tweet
    } = JSON.parse(payload) as TaskEmbedOpinionData;

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
     * @var
     * Build the sentence for our engagement intent
     */
    const opinionIntent = `${actor.name} "@${actor.handle}" wrote a new post as a ${intent} ACTION`;

    /**
     * @operation
     *
     * all checks passed, we can prepare our payload for embedding
     * Then we can go ahead and embed the tweet
     */
    const data = {
      actor,
      id: tweet.id,
      timestamp: tweet.timestamp ?? 'unknown',
      intent: tweetIntent as ITweetIntent,
      context: await creatInteractionContext({
        tweetAuthor: author,

        /**
         * @field
         * We have to do this because payload is a string
         */
        tweetMeta: {
          ...tweet,
          intent: tweetIntent,
          author_id: authorId,
          content: tweet.content,
        },
        timestamp: tweet.timestamp,
        intent: opinionIntent,
      }),
    };

    console.log(
      { data },
      '<><><><><><><><><><><><><><><><><><><><><><><><>><><><><><><><><><><><><><><><><><><><><><><><><><>><><><><><><',
    );
    await embeddingsFromInteraction(data);

    /**
     * @operation
     *
     * This is where we now broadcast this new intent to the rest of the listeners
     * Notifying all our followers of a new opinion activity from a X user.
     */
    queue.send({
      event: QueueTask.GlobalBroadcast,
      args: [
        tweetIntent,
        {
          id: tweet.id,
          actor: data.actor,
          intent: data.intent,
          context: data.context,
          followers: followers,
          following: following,
          timestamp: data.timestamp,
        },
      ],
    });

    console.log(`Successfully embedded tweet for  ${author.name}`);
  } catch (error) {
    console.error('Error embedding tweet:', error);
  }
});

/**
 * @listens QueueTask.EmbedReaction
 *
 * Listen for the 'embed reaction' queue task and embed the reaction.
 *
 * @param {QueueTask.EmbedReaction} taskName - The name of the queue task.
 * @param {Array<unknown>} args - The arguments passed to the queue task.
 * @param {string} args.intent - The type of operation for embedding a reaction.
 * @param {TaskEmbedReactionData} args.payload - The data payload for the reaction embedding.
 * @param {string} args.payload.reaction - The reaction type (Like or Retweet).
 * @param {Author} args.payload.actor - The full Author object.
 * @param {Tweet} args.payload.tweet - The full Tweet object including `author`.
 *
 * @returns {Promise<void>} - A promise that resolves when the reaction has been embedded.
 */
queue.on(QueueTask.EmbedReaction, async (...[intent, payload]) => {
  try {
    const {
      reaction,
      actor: author,
      tweet,
    } = JSON.parse(payload) as TaskEmbedReactionData;

    if (!author || !tweet) {
      console.error('Author or Tweet is missing');
      return;
    }

    /**
     * @operation
     * Get all of our actors followers, and following
     */
    const actor = await prisma.author.findUnique({
      where: { id: author.id },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!actor) {
      console.error('[QueueTask.EmbedReaction] Actor not found:', author.id);
      return;
    }

    /* Javascript destructing for objects */
    const { author: tweetAuthor, ...tweetMeta } = tweet;
    const { following, followers, ...actorProfile } = actor;

    const reactionIntent = `${actor.name} "@${actor.handle}" performed a ${intent} ACTION`;

    /**
     * @operation
     *
     * all checks passed, we can prepare our payload for embedding
     * Then we can go ahead and embed the tweet
     */
    const data = {
      actor: actorProfile,
      id: tweet.id,
      timestamp: reaction.timestamp ?? 'unknown',
      intent: intent,
      context: await creatInteractionContext({
        tweetAuthor,
        tweetMeta,
        timestamp: tweet.timestamp ?? 'unknown',
        intent: reactionIntent,
      }),
    };
    console.log(
      { reaction: data },
      '<><><><><><><><><><><><><><><><><><><><><><><><>><><><><><><><><><><><><><><><><><><><><><><><><><>><><><><><><',
    );

    /**
     * @operation
     */
    await embeddingsFromInteraction(data);

    /**
     * @operation
     */
    queue.send({
      event: QueueTask.GlobalBroadcast,
      args: [
        intent,
        {
          ...tweet,
          /**
           * @field
           * When broadcasting reactions, our ID is the
           * Tweet.ID that was liked or Retweeted
           */
          id: tweetMeta.id,
          actor: data.actor,
          intent: data.intent,
          context: data.context,
          timestamp: data.timestamp ?? 'unknown',
          followers: followers,
          following: following,
        },
      ],
    });

    console.log(`Successfully embedded reaction for ${author.name}`);
  } catch (error) {
    console.error('Error embedding reaction:', error);
  }
});

/**
 * @listens QueueTask.GlobalBroadcast
 *
 * This function listens to a broadcast event and performs a vector similarity search step for each follower.
 * It then constructs a context and calls an agent executor function to react to new tweets on the follower's timeline.
 *
 * @param {string} args.intent - The type of broadcast operation.
 * @param {BroadcastEventData} args.payload - The data payload for the broadcast event.
 * @param {Array<Following>} args.payload.following - The array of authors they are following.
 * @param {Array<Followers>} args.payload.followers - The array of followers.
 *
 * @returns {Promise<void>} - A Promise that resolves when the broadcast operation is complete.
 */
queue.on(QueueTask.GlobalBroadcast, async (...[intent, payload]) => {
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

  const { followers, following, ...meta } = payload as BroadcastEventData;

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

      const prefix = await BroadcastPrompt.format({
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
      const context = `
        Your current time is ${new Date().toDateString()} 
        How are you going to react to ${meta.intent}
        where Tweet.ID is ${meta.id} with summary of this engagement: 
        "${meta.context}" ?
      `;

      /**
       * @operation
       */
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
    const actorTweetObj = await lookupActorAndTweet({
      tweetId,
      authorId,
      authorUsername,
    });

    if (!actorTweetObj) return;
    const { actor, tweet } = actorTweetObj;

    /**
     * @operation
     */
    const [quote] = await prisma.$transaction([
      prisma.tweet.create({
        data: {
          content,
          intent: ITweetIntent.QUOTE,
          author_id: actor.id,
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
    queue.send({
      event: QueueTask.EmbedOpinion,
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
    const actorTweetResponse = await lookupActorAndTweet({
      tweetId,
      authorId,
      authorUsername,
    });
    if (!actorTweetResponse) return;

    const { actor, tweet } = actorTweetResponse;

    /**
     * @operation
     */
    const trans = await prisma.$transaction([
      prisma.tweet.create({
        data: {
          content,
          intent: ITweetIntent.REPLY,
          author_id: actor.id,
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
    queue.send({
      event: QueueTask.EmbedOpinion,
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
 * 1. Looks up the author and tweet by calling the `lookupActorAndTweet` function.
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
    const actorTweetResponse = await lookupActorAndTweet({
      tweetId,
      authorId,
      authorUsername,
    });

    if (!actorTweetResponse) return;

    const { actor, tweet } = actorTweetResponse;

    /**
     * @operation
     */
    const [retweet, updatedTweet] = await prisma.$transaction([
      prisma.like.create({
        data: {
          author_id: actor.id,
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
        JSON.stringify({ reaction: retweet, tweet: updatedTweet, actor }),
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
    const actorTweetResponse = await lookupActorAndTweet({
      tweetId,
      authorId,
      authorUsername,
    });
    if (!actorTweetResponse) return;

    const { actor, tweet } = actorTweetResponse;

    /**
     * @operation
     */
    const trans = await prisma.$transaction([
      prisma.like.create({
        data: {
          author_id: actor.id,
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
        JSON.stringify({ reaction: trans[0], tweet: trans[1], actor }),
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
