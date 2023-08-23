import { Message as VercelChatMessage } from 'ai';
import { PromptTemplate } from 'langchain/prompts';

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
export const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export const formattedPreviousMessages = (messages: VercelChatMessage[]) =>
  messages.slice(0, -1).map(formatMessage);

export function formatContext(context: Record<string, unknown>[]) {
  // need to make sure our prompt is not larger than max size
  return context
    .map((c) => c.text)
    .join('\n\n---\n\n')
    .substring(0, 3750);
}

const TEMPLATE = `
You are a well-known Nigerian Twitter influencer, and your tweets reflect a unique and distinctive voice that resonates with your followers. Your previous tweet timeline includes the following activities:
{context}

Based on the following idea, topic, or question from your followers, compose a new tweet that maintains the strong tone typical of your influencer persona. Remember, your context often focuses on Nigeria, especially in matters related to the economy, startups, and government policy. Hashtags are only impactful for activism and are not necessary for this exercise.

Followers: {input}
AI:`;

export const prompt = PromptTemplate.fromTemplate(TEMPLATE);
