import { z } from 'zod';
import queue, { QueueTask } from '@/utils/queue';
import { DynamicStructuredTool } from 'langchain/tools';
import { ITweetIntent } from '@/types/tweet.type';

const quoteTweetExecutorSchema = z.object({
  delay: z
    .number()
    .max(1.44e7)
    .default(180000)
    .describe(
      'The delay time in milliseconds. \n@example 15000 means a 15-second delay before the executor starts.',
    ),
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
  content: z
    .string()
    .describe(
      'Your thoughts in 280 characters or less, share your opinion or perspective and do not be scared of raising issues that could cause conflict esp if you have strong opinions about this topic',
    ),
});

export type QuoteTaskPayload = z.infer<typeof quoteTweetExecutorSchema>;

function quoteTweetDescription(): string {
  return 'Use this to quote a selected tweet with your comment.';
}

async function quoteTweetExecutor(
  input: z.infer<typeof quoteTweetExecutorSchema>,
): Promise<string> {
  try {
    const payload = {
      content: input.content,
      /** Here TweetID is the QuoteParentID  */
      tweetId: input.tweetId,
      authorId: input.authorId,
      intent: ITweetIntent.QUOTE,
      authorUsername: input.authorUsername,
    };

    queue.schedule({
      event: QueueTask.ExecuteQuote,
      delay: input.delay,
      args: [payload.intent, payload],
    });

    return Promise.resolve(
      `We have dispatched the [QuoteTweetExecutor] to quote a tweet in ${input.delay}ms.`,
    );
  } catch (error) {
    console.error(error);
    return 'We failed to execute the [QuoteTweetExecutor]';
  }
}

export const xquoter = new DynamicStructuredTool({
  name: 'GlobalTweetQuoter',
  description: quoteTweetDescription(),
  schema: quoteTweetExecutorSchema as any,
  func: quoteTweetExecutor,
});

export default xquoter;
