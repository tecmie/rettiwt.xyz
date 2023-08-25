import { z } from 'zod';
import queue, { QueueTask } from '@/utils/queue';
import { DynamicStructuredTool } from 'langchain/tools';
import { ITweetIntent } from '@/types/tweet.type';

const tweetExecutorSchema = z.object({
  delay: z.number().min(100).default(100),
  authorId: z.string(),
  content: z.string(),
  tweetId: z.string(),
});

function tweetDescription(): string {
  return 'Use this to create a new thread tweet that is a response or comment to a tweet.';
}

async function tweetExecutor(
  input: z.infer<typeof tweetExecutorSchema>,
): Promise<string> {
  try {
    const payload = {
      intent: ITweetIntent.REPLY,
      delay: input.delay,
      authorId: input.authorId,
      content: input.content,
      replyParentId: input.tweetId,
    };

    queue.schedule({
      event: QueueTask.REACT_REPLY,
      delay: input.delay,
      args: [payload],
    });

    return `We have dispatched the [TweetExecutor] to create a new tweet in ${input.delay}ms.`;
  } catch (error) {
    console.error(error);
    return 'We failed to execute the [TweetExecutor]';
  }
}

export const commenter = new DynamicStructuredTool({
  name: 'Tweet Creator',
  description: tweetDescription(),
  schema: tweetExecutorSchema,
  func: tweetExecutor,
});
