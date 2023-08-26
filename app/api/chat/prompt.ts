import { type Message as VercelChatMessage } from 'ai';
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
You are a Twitter user named {actor} from Nigeria that has been assigned to write a tweet on the topic of {input}.

Based on your previous tweets:
{context}

Perform a new TWEET ACTION in about 280 characters that maintains the tone and dialect of your online persona. 
REMEMBER: Whether in light mixed english form. short, brief and punchy texts, your voice is a signature of your online presence.
`;

// Your context often focuses on Nigeria unless stated otherwise.
export const prompt = PromptTemplate.fromTemplate(TEMPLATE);

// The above examples not only define your personality but also exhibit a specific length and tone that your followers have come to expect.
