import { z } from 'zod';
import { DynamicStructuredTool } from 'langchain/tools';
import { prisma } from '@/server/db';
import { embeddingsFromInteraction } from '../default';
import { ITweetIntent } from '@/types/tweet.type';

const executorSchema = z.object({
  delay: z
    .number()
    .max(10000)
    .default(100)
    .describe('How soon should we broadcast this intent.'),
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

function handlerDescription(): string {
  return 'Use this to trigger a Do not Disturb mode for a specific tweet.';
}

async function handlerFunction(
  input: z.infer<typeof executorSchema>,
): Promise<string> {
  try {
    const tweet = await prisma.tweet.findUniqueOrThrow({
      where: {
        id: input.tweetId,
      },
      include: {
        replies: {
          select: {
            id: true,
            intent: true,
            content: true,
            author_id: true,
            timestamp: true,
          },
        },
        quote_parent: {
          select: {
            id: true,
            intent: true,
            content: true,
            author_id: true,
            timestamp: true,
          },
        },
        reply_parent: {
          select: {
            id: true,
            intent: true,
            content: true,
            author_id: true,
            timestamp: true,
          },
        },
      },
    });

    const actor = await prisma.author.findFirstOrThrow({
      where: {
        id: input.authorId,
        handle: input.authorUsername,
      },
    });

    const payload = {
      actor,
      id: tweet.id,
      intent: ITweetIntent.DND,
      context: `As ${actor?.name} "@${actor?.handle}" 
    I no longer want to be disturbed by this tweet, thread-tweet, like or retweet

    ${JSON.stringify(tweet, null, 2)}
    
    AND any of it's related events and interactions in the future.`,
      timestamp: tweet.timestamp,
    };

    await embeddingsFromInteraction(payload);

    return Promise.resolve(
      `I have updated my Do not Disturb preference for this interaction. You can proceed to the next task.`,
    );
  } catch (error) {
    console.error(error);
    return 'An unexpected error occurred while triggering a Do not Disturb.';
  }
}

export const xdnd = new DynamicStructuredTool({
  name: 'DoNotDisturb',
  description: handlerDescription(),
  schema: executorSchema,
  func: handlerFunction,
});

export default xdnd;
