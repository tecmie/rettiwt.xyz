import { z } from 'zod';
import queue, { QueueTask } from '@/utils/queue';
import { DynamicStructuredTool } from 'langchain/tools';
import { ITweetIntent } from '@/types/tweet.type';

const commentExecutorSchema = z.object({
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
      'Your thoughts in 280 characters or less, share your opinion or perspective and do not be scared of raising issues that could cause conflict esp if you have strong opinions about this topic.',
    ),
});

export type CommentTaskPayload = z.infer<typeof commentExecutorSchema>;

function tweetDescription(): string {
  return 'Use this to create a new thread-tweet that is a response or comment to a previous tweet.';
}

async function commentExecutor(
  input: z.infer<typeof commentExecutorSchema>,
): Promise<string> {
  try {
    const payload = {
      delay: input.delay,
      content: input.content,
      tweetId: input.tweetId,
      authorId: input.authorId,
      intent: ITweetIntent.REPLY,
      authorUsername: input.authorUsername,
    };

    queue.schedule({
      event: QueueTask.ExecuteComment,
      delay: input.delay,
      args: [payload.intent, payload],
    });

    return Promise.resolve(
      `We have dispatched the [CommentExecutor] to create a new tweet in ${input.delay}ms.`,
    );
  } catch (error) {
    console.error(error);
    return 'We failed to execute the [CommentExecutor]';
  }
}

export const xcommenter = new DynamicStructuredTool({
  name: 'TweetCommenter',
  description: tweetDescription(),
  schema: commentExecutorSchema as any,
  func: commentExecutor,
});

export default xcommenter;
