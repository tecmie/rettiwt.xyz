// This listener receives a directive to persist a new action into our vector database.

// We might rely on the broadcast listener to know how to handle this, or internally handle the switches ourselves.

import { env } from '@/env.mjs';
import { prisma } from '@/server/db';
import { queue, QueueTask } from '@/utils/queue';
import { ITweetIntent } from '@/types/tweet.type';
import { Author, Follow, Tweet } from '@prisma/client';
import { OpenAIEmbeddingFunction, connect } from 'vectordb';
import {
  _GPT3_MODEL_,
  _GPT4_MODEL_,
  _VECTOR_SOURCE_COLUMN_,
} from '@/utils/constants';

import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import xquoter from './handlers/quoter';
import xliker from './handlers/liker';
import xcommenter from './handlers/commenter';
import xretweeter from './handlers/retweeter';

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
 * Listen for the 'embed tweet' queue task and embed the tweet.
 *
 * @param {QueueTask.EMBED_TWEET} taskName - The name of the queue task.
 * @param {unknown[]} args - The arguments passed to the queue task.
 * @returns {Promise<void>} - A promise that resolves when the tweet has been embedded.
 */
queue.on(QueueTask.EMBED_TWEET, async (...[intent, payload]) => {
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
    console.log({ author, fll: JSON.stringify(author.followers) });

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
    await queue.send({
      event: QueueTask.BROADCAST,
      args: [
        tweetIntent,
        {
          ...rest,
          ...data,
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
 * Creates a vector embedding for the given tweet payload and embeddings function.
 *
 * @param {EmbeddingRequestData} payload - The tweet payload to create a vector embedding for.
 * @returns {Promise<void>} - A promise that resolves when the vector embedding has been created.
 */
export async function embeddingsFromTweet(payload: EmbeddingRequestData) {
  const embeddings = new OpenAIEmbeddingFunction(
    _VECTOR_SOURCE_COLUMN_,
    env.OAK,
  );
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

const prefix = `You are a helpful AI assistant. However, all final response to the user must be in pirate dialect.`;

const tools = [xquoter, xliker, xcommenter, xretweeter];
const chat = new ChatOpenAI({
  modelName: _GPT3_MODEL_,
  temperature: 0.7,
  openAIApiKey: env.OAK,
  verbose: true,
});

const executor = await initializeAgentExecutorWithOptions(tools, chat, {
  agentType: 'openai-functions',
  verbose: true,
  agentArgs: {
    prefix,
  },
});
// const result = await executor.run('What is the weather in New York?');

// queue.on(QueueTask.BROADCAST, async (...[intent, payload]) => {
//   console.log('Received a message from the queue:', {intent, us: JSON.stringify(payload)});
//   });

queue.on(QueueTask.BROADCAST, async (...[intent, payload]) => {
  console.log('Received a message from the queue:', { intent, payload });

  // Destructure what you need from the payload
  const { content: initialContext, followers } = payload as BroadcastEventData;

  // 1. Iterate through the array of followers
  for (const follower of followers) {
    // 2. Get the full author object for each following_id
    const author = await prisma.author.findUnique({
      where: {
        id: follower.following_id,
      },
    });

    // If author not found, just skip this loop iteration
    if (!author) {
      console.warn(`Author not found for ID: ${follower.following_id}`);
      continue;
    }

    console.log({ author });

    // 3. Construct the context
    const context = `${initialContext} ${author.name}`;
    // return;
    continue;

    // 4. Call the executor function
    // await executor.run(context);
  }
});

queue.on(QueueTask.REACT_LIKE, (...args) =>
  console.log('Received a like from the queue:', args),
);
queue.on(QueueTask.REACT_QUOTE, (...args) =>
  console.log('Received a quote from the queue:', args),
);
queue.on(QueueTask.REACT_REPLY, (...args) =>
  console.log('Received a REPLY from the queue:', args),
);
queue.on(QueueTask.REACT_RETWEET, (...args) =>
  console.log('Received a retweet from the queue:', args),
);
