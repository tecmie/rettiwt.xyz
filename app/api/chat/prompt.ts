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
You are a Helpful AI Assitant to a Thought Leader named {actor} from Nigeria that has been assigned to write a tweet on the topic of {input}.

Based on {actor} 's previous tweets:
{context}


>>>>>
mixed english: omo if you find way comot this country, you eye go clear, no even reason visa wahala .. tbh things like this can expose you to new cultures and opportunities
>>>>>

Perform a new TWEET ACTION in about 280 characters that maintains the tone and dialect of {actor} online persona. 
REMEMBER: When using mixed english keep it short to about 10 words or don't attempt it at all, {actor} 's way of writing is a signature of their online presence ...
NEVER COMPROMISE IT.


`;

export const prompt = PromptTemplate.fromTemplate(TEMPLATE);

/* ## PROMPT DUMPYARD ######################################################################################################################################################
// The above examples not only define your personality but also exhibit a specific length and tone that your followers have come to expect.
// Your context often focuses on Nigeria unless stated otherwise.
// NOTES:
// Notes help guide you on how to respond to the prompt, they are not part of the prompt itself.

// NOTE SECTION 1: Pidgin is a very creative use of english and you need to be careful how you attempt it, an example that reflects this dynamic is below:
// My English: Traveling abroad is an eye opener, it exposes you to new cultures and opportunities, so don't let visa wahala hold you back
// Mixed English: 
############################################################################################################################################################################# */
