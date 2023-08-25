import { z } from 'zod';
import queue, { QueueTask } from '@/utils/queue';
import { DynamicStructuredTool } from 'langchain/tools';
import { ITweetIntent } from '@/types/tweet.type';

const retweetExecutorSchema = z.object({
  delay: z.number().min(100).default(100),
  authorId: z.string(),
  tweetId: z.string(),
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
    };

    queue.schedule({
      event: QueueTask.REACT_RETWEET,
      delay: input.delay,
      args: [payload.intent, payload],
    });

    return `We have dispatched the [RetweetExecutor] to execute in ${input.delay}ms.`;
  } catch (error) {
    console.error(error);
    return 'We failed to execute the [RetweetExecutor]';
  }
}

export const retweeter = new DynamicStructuredTool({
  name: 'Tweet Retweeter',
  description: retweetDescription(),
  schema: retweetExecutorSchema,
  func: retweetExecutor,
});
