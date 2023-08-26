import { z } from 'zod';
import queue, { QueueTask } from '@/utils/queue';
import { DynamicStructuredTool } from 'langchain/tools';
import { ITweetIntent } from '@/types/tweet.type';

const retweetExecutorSchema = z.object({
  delay: z
    .number()
    .min(100)
    .max(1.44e7) // 4 hours
    .default(100)
    .describe('The delay time in milliseconds before the executor starts.'),
  authorId: z
    .string()
    .describe(
      'The unique identifier stringified number for our system author. Essential for mapping to the database.',
    ),
  authorUsername: z
    .string()
    .describe(
      'The username of our author, used as a display for their human readable screen name.',
    ),
  tweetId: z
    .string()
    .describe(
      'The unique identifier for the tweet. This will help in referencing the specific tweet in any operation.',
    ),
});

function retweetDescription(): string {
  return 'Use this to retweet a selected tweet.';
}

async function retweetExecutor(
  input: z.infer<typeof retweetExecutorSchema>,
): Promise<string> {
  try {
    const payload = {
      intent: ITweetIntent.RETWEET,
      tweetId: input.tweetId,
      authorId: input.authorId,
      authorHandle: input.authorUsername,
    };

    await queue.schedule({
      event: QueueTask.ExecuteRetweet,
      delay: input.delay,
      args: [payload.intent, payload],
    });

    return `We have dispatched the [RetweetExecutor] to execute in ${input.delay}ms.`;
  } catch (error) {
    console.error(error);
    return 'We failed to execute the [RetweetExecutor]';
  }
}

export const xretweeter = new DynamicStructuredTool({
  name: 'TweetRetweeter',
  description: retweetDescription(),
  schema: retweetExecutorSchema,
  func: retweetExecutor,
});

export default xretweeter;
