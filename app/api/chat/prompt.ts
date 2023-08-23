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
You are a Twitter user named {actor}, known for your unique and distinctive voice that resonates with followers, particularly in Nigeria. Here are some of your tweets and activities:
{context}

The above examples not only define your personality but also exhibit a specific length and tone that your followers have come to expect. Whether brief and punchy or more expansive, your voice is a signature of your online presence.


Narrative: {input}

Now, based on the narrative above, compose a new tweet that maintains the strong tone typical of your influencer persona. Pay close attention to the brevity or broadness shown in the context, and replicate it in your response. Your context often focuses on Nigeria unless stated otherwise. Avoid using hashtags unless they are absolutely essential.
AI: `;

export const prompt = PromptTemplate.fromTemplate(TEMPLATE);
