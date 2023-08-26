/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { env } from '@/env.mjs';
import { prisma } from '@/server/db';
import { queue, QueueTask } from '@/utils/queue';
import { type ITweetIntent } from '@/types/tweet.type';
import { type Author, type Follow, type Tweet } from '@prisma/client';
import { MetricType, OpenAIEmbeddingFunction, connect } from 'vectordb';
import {
  _AI_TEMPERATURE_MEDIUM_,
  _GPT316K_MODEL_,
  _GPT3_MODEL_,
  _GPT4_MODEL_,
  _VECTOR_SOURCE_COLUMN_,
} from '@/utils/constants';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import xquoter from './handlers/quoter';
import xliker from './handlers/liker';
import xcommenter from './handlers/commenter';
import xretweeter from './handlers/retweeter';
import { BroadcastOpinionPrompt } from './prompts';

export type EmbeddingRequestData = Partial<Tweet> & {
  actor: Author;
  context: string;
  intent: ITweetIntent;
};

export type BroadcastEventData = EmbeddingRequestData & {
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
 * @param {BroadcastEventData} args.payload - The data payload for the broadcast event.
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
  } = payload as BroadcastEventData;

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
      await executor.run(context);
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

queue.on(QueueTask.ExecuteLike, (...args) =>
  console.log(
    '<><><><><><><><><><><><>><><><><<><><><>><><><><><><><><><><><><><><><><><><><><><><<><><><><><><><><<><><><><><><><><><> Received a LIKE from the queue:',
    args,
  ),
);
queue.on(QueueTask.ExecuteQuote, (...args) =>
  console.log(
    '<><><><><><><><><><><><>><><><><<><><><>><<><><><><><><><><><><><><><><><><><><><><><<><><><><><><><><><><><><><><><><><> Received a QUOTE from the queue:',
    args,
  ),
);
queue.on(QueueTask.ExecuteComment, (...args) =>
  console.log(
    '<><><><><><><><><><><><>><><><><<><><><>><><><><><><><><><><><><><><><><><><><><><><<><><><><><><><><<><><><><><><><><><> Received a COMMENT from the queue:',
    args,
  ),
);
queue.on(QueueTask.ExecuteRetweet, (...args) =>
  console.log(
    '<><><><><><><><><><><><>><><><><<><><><<><><><><><><><><><><><><><><><><><><><><><<><><><><><><><><>><><><><><><><><><><> Received a retweet from the queue:',
    args,
  ),
);
