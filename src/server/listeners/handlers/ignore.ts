import { z } from 'zod';
import { DynamicStructuredTool } from 'langchain/tools';
import { ITweetIntent } from '@/types/tweet.type';
import { embeddingsFromInteraction } from '../default';

const ignoreTweetExecutorSchema = z.object({
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
  reason: z
    .string()
    .describe(
      'Why are you ignoring this interaction, there is no burden to please anyone with your response',
    ),
});

function ignoreTweetDescription(): string {
  return 'Use this to essentially ignore the engaging in a topic if it feels similar, if you have engaged with it most recently or just not interested in what anybody thinks.';
}

async function ignoreTweetExecutor(
  input: z.infer<typeof ignoreTweetExecutorSchema>,
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
      I have chosen to ignore this tweet, thread-tweet, like or retweet

      ${JSON.stringify(tweet, null, 2)}
      
      AND any of it's related events and interactions for ${input.reason}.`,
      timestamp: tweet.timestamp,
    };

    await embeddingsFromInteraction(payload);

    // No real operations are performed here. It's a No-Op.
    return Promise.resolve(
      `This interaction has been ignored. You can proceed to the next task.`,
    );
  } catch (error) {
    console.error(error);
    return 'An unexpected error occurred while ignoring the comment.';
  }
}

export const xignore = new DynamicStructuredTool({
  name: 'SelectiveIgnorance',
  description: ignoreTweetDescription(),
  schema: ignoreTweetExecutorSchema,
  func: ignoreTweetExecutor,
});

export default xignore;
