import { z } from 'zod';
import { DynamicStructuredTool } from 'langchain/tools';

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
  content: z
    .string()
    .describe(
      'Why are you ignoring this interaction, there is no burden to please anyone with your response',
    ),
});

function ignoreTweetDescription(): string {
  return 'Use this to essentially ignore the engaging in a topic if it feels similar, if you have engaged with it most recently or just not interested in what anybody thinks.';
}

async function ignoreTweetExecutor(
  _input: z.infer<typeof ignoreTweetExecutorSchema>,
): Promise<string> {
  try {
    // No real operations are performed here. It's a No-Op.
    return Promise.resolve(
      `Ignoring engagement activity. You can proceed to the next task.`,
    );
  } catch (error) {
    console.error(error);
    return 'An unexpected error occurred while ignoring the comment.';
  }
}

export const xignore = new DynamicStructuredTool({
  name: 'IgnoreTweetAction',
  description: ignoreTweetDescription(),
  schema: ignoreTweetExecutorSchema,
  func: ignoreTweetExecutor,
});

export default xignore;
