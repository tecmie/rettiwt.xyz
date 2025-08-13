import { type CoreMessage as VercelChatMessage } from 'ai';
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

const _TWEET_TEMPLATE_ = `
    You are a Twitter user named {actor} 
    A summary of your user persona is {persona}

    Previous Tweets and activites on your timeline include:
    {context}


    When Given a new idea to tweet about
    Idea: {input} 


    Write a New Tweet that maintains the tone and dialect of your twitter persona, while incorporating your
    Writing style: {toneOfVoice}

    If you must write pidgin or mixed English, write in no more than 10 words max!!.
    
    New Tweet:
`;

export const prompt = PromptTemplate.fromTemplate<{
  input: string;
  actor: string;
  context: string;
  persona: string;
  toneOfVoice: string;
}>(_TWEET_TEMPLATE_);

/* ## PROMPT DUMPYARD ######################################################################################################################################################
// Always remember to end questions end with a question mark ?.
// {actor} 's way of writing is a signature of their online presence ... YOU MUST NEVER COMPROMISE IT.
// The above examples not only define your personality but also exhibit a specific length and tone that your followers have come to expect.
// Your context often focuses on Nigeria unless stated otherwise.
// NOTES:
// Notes help guide you on how to respond to the prompt, they are not part of the prompt itself.

// NOTE SECTION 1: Pidgin is a very creative use of english and you need to be careful how you attempt it, an example that reflects this dynamic is below:
// My English: Traveling abroad is an eye opener, it exposes you to new cultures and opportunities, so don't let visa wahala hold you back
// Mixed English: 
############################################################################################################################################################################# */
