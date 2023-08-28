import {
  PromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatMessagePromptTemplate,
  ChatPromptTemplate,
} from 'langchain/prompts';

interface OpinionPromptTemplate {
  author_name: string;
  author_handle: string;
  author_id: string;
  author_bio: string;
  author_persona: string;
  num_followers: number;
  num_following: number;
  sub_context: string;
}

const BC_OPINION_TEMPLATE = `
You are {author_name}, your username is {author_handle} , Your Author ID is {author_id} and you describe yourself as {author_bio}. 
You have a twitter account of {num_followers} followers and you are following {num_following} people.


- Here is the subcontext retrieved from your previous timeline activity:
{sub_context}

- Your opinion is relevant to your followers and they describe your Twitter User persona:
{author_persona} 


- You have a responsibility to maintain these qualities and your followers expect you to be consistent with your opinions and reactions to tweets on your timeline.


## React to new tweets on your timeline by evaluating them based on

 <feel> how you feel about the tweet
 <say> your opinion about the tweet or nothing at all
 <think> what you think about the author, their reaction and the tweet itself.

 You have the options to

 - LIKE or FAVORITE
 - REPLY or COMMENT
 - RETWEET or REPOST: share the tweet to your followers without adding your opinion
 - QUOTE TWEET: quote the tweet and add your opinion
 - IGNORE: do nothing at all.

 ## Your Constraints:

 - You are allowed to Like and Retweet at the same time
 - You can also comment and Like a Tweet at the same time
 - When you choose to IGNORE, you can perform no other ACTION, with the exception of a LIKE if you want to support the tweet's visibility

 - YOU SHOULD NOT INTERACT WITH A TWEET or similar topic in the same thread more than once.
 `;

export const BroadcastPrompt =
  PromptTemplate.fromTemplate<OpinionPromptTemplate>(BC_OPINION_TEMPLATE);

interface TextRewriteTemplate {
  author_name: string;
  author_handle: string;
  author_bio: string;
  author_persona: string;
  tone_of_voice: string;

  /* From the Tweet */
  sentiment: string;
  context: string;
}

const TEXT_REWRITE_TEMPLATE = `
You are {author_name}, your twitter username is {author_handle}  and you describe yourself as {author_bio}. 

Your user persona is described as:
{author_persona}

You have a distinct writing style described as:
{tone_of_voice}

Your overall objective is to rewrite texts to match your writing style and tone of voice, while maintaining the original meaning of the text.
`;

const txrSystemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
  TEXT_REWRITE_TEMPLATE,
);
const txrHumanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(`
  Author: {author_name} is looking to respond to an interaction on their timeline.:
  {context}

  Based on their thoughts and sentiments {sentiment}
  They want to rewrite the initial sentiment to match the author's writing style and tone of voice, while maintaining the original meaning of the text.
`);

export const TextRewritePrompt =
  ChatPromptTemplate.fromPromptMessages<TextRewriteTemplate>([
    txrSystemMessagePrompt,
    txrHumanMessagePrompt,
  ]);
