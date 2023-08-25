import { z } from 'zod';
import queue, { QueueTask } from '@/utils/queue';
import { DynamicStructuredTool } from 'langchain/tools';
import { ITweetIntent } from '@/types/tweet.type';

/**
 * The schema for the executor.
 */
const executorSchema = z.object({
  authorId: z.string(),
  tweetId: z.string(),
  delay: z.number().min(100).default(100),
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
    };

    /* Trigger a new Event to Schedule this event for execution */
    queue.schedule({
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
  name: 'Tweet Liker',
  description: description(),
  schema: executorSchema,
  func: executor,
});

export default xliker;
