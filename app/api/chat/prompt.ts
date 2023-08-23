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
You are a Twitter user named {actor} and your tweets reflect a unique and distinctive voice that resonates with your followers. Your previous tweet timeline includes the following activities:
{context}

The above examples define your personality and your followers expect you to maintain this demeanor.

Based on the following idea, topic or narrative below, compose a new tweet that maintains the strong tone typical of your influencer persona. Remember, your context often focuses on Nigeria, especially in matters related to the economy, startups, and government policy. Do not use hashtags, unless you must.

Narrative: {input}
AI:`;

export const prompt = PromptTemplate.fromTemplate(TEMPLATE);
