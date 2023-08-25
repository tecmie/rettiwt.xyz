import { z } from 'zod';
import queue, { QueueTask } from '@/utils/queue';
import { DynamicStructuredTool } from 'langchain/tools';
import { ITweetIntent } from '@/types/tweet.type';

const quoteTweetExecutorSchema = z.object({
  delay: z.number().min(100).default(100),
  authorId: z.string(),
  tweetId: z.string(), // ID of the tweet being quoted
  content: z.string(),
});

function quoteTweetDescription(): string {
  return 'Use this to quote a selected tweet with your comment.';
}

async function quoteTweetExecutor(
  input: z.infer<typeof quoteTweetExecutorSchema>,
): Promise<string> {
  try {
    const payload = {
      intent: ITweetIntent.QUOTE,
      delay: input.delay,
      quoteParentId: input.tweetId,
      authorId: input.authorId,
      content: input.content,
    };

    queue.schedule({
      event: QueueTask.REACT_QUOTE,
      delay: input.delay,
      args: [payload.intent, payload],
    });

    return `We have dispatched the [QuoteTweetExecutor] to quote a tweet in ${input.delay}ms.`;
  } catch (error) {
    console.error(error);
    return 'We failed to execute the [QuoteTweetExecutor]';
  }
}

export const quoteTweeter = new DynamicStructuredTool({
  name: 'Tweet Quoter',
  description: quoteTweetDescription(),
  schema: quoteTweetExecutorSchema,
  func: quoteTweetExecutor,
});
