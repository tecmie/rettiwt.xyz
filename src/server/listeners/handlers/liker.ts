import { z } from 'zod';
import queue, { QueueTask } from '@/utils/queue';
import { DynamicStructuredTool } from 'langchain/tools';
import { ITweetIntent } from '@/types/tweet.type';

/**
 * The schema for the executor.
 */
const executorSchema = z.object({
  delay: z
    .number()
    .min(100)
    .max(12_000_000) // 4 hours
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

/**
 * Returns the default description string.
 * @returns {string} The default description string.
 */
function description(): string {
  return 'Use this to react with a favorite and like to a tweet.';
}

/**
 * @name executor
 * Handles the execution of our DynamicStructuredTool
 */
async function executor(
  input: z.infer<typeof executorSchema>,
): Promise<string> {
  try {
    const payload = {
      intent: ITweetIntent.LIKE,
      tweetId: input.tweetId,
      authorId: input.authorId,
      authorHandle: input.authorUsername,
    };

    /* Trigger a new Event to Schedule this event for execution */
    await queue.schedule({
      event: QueueTask.REACT_LIKE,
      delay: input.delay,
      args: [payload.intent, payload],
    });

    return String(
      `We have dispatched the [LikeExecutor] to execute in ${input.delay}ms.`,
    );
  } catch (error) {
    console.error(error);
    return 'we failed to execute the [LikeExecutor]';
  }
}

export const xliker = new DynamicStructuredTool({
  name: 'TweetLiker',
  description: description(),
  schema: executorSchema,
  func: executor,
});

export default xliker;
