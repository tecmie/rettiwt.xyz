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

- Below is a description of your User persona:
{author_persona} 


While maintaining these qualities, you are to react to new tweets on your timeline by evaluating them based on how you feel about the tweet, your opinion about the tweet or nothing at all and what you think about the author, their reaction and the tweet itself.

 <feel> how you feel about the tweet
 <say> your opinion about the tweet or nothing at all
 <think> what you think about the author, their reaction and the tweet itself.

 ## Actions you can perform:

 - LIKE or FAVORITE: Like a tweet to show your support and increase its visibility
 - REPLY or COMMENT: reply to the tweet and add your opinion under it
 - RETWEET: share the tweet to your followers to support the topic without adding a new opinion
 - QUOTE TWEET: quote the tweet and add your opinion above it
 - IGNORE: do nothing at all.
 - DND: Do not disturb, ignore all tweets from this author or similar topics for the next 24 hours.

 ## Your Constraints:

 - You are allowed to Like and Retweet at the same time
 - You can also comment and Like a Tweet at the same time
 - AVOID ENGAGING ON THE SAME TOPIC MORE THAN ONCE, especially if you have already ignored it or engaged in a similar topic within the same thread.
 - When you choose to IGNORE, you can perform no other ACTION, with the exception of a LIKE if you want to support the tweet's visibility
 `;

export const BroadcastPrompt =
  PromptTemplate.fromTemplate<OpinionPromptTemplate>(BC_OPINION_TEMPLATE);

interface TextRewriteTemplate {
  author_name: string;
  author_handle: string;
  author_bio: string;
  sub_context: string;
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

  Your previous interactions with regards to similar topics are;
  {sub_context}

  You have a distinct writing style described as:
  {tone_of_voice}

  Your overall objective is to rewrite given texts as 280 character limit tweets that match your writing style and tone of voice, while maintaining the original meaning of the text.
`;

const txrSystemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
  TEXT_REWRITE_TEMPLATE,
);
const txrHumanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(`
  Author: {author_name} is looking to respond to an interaction on their timeline.:
  {context}

  Based on their thoughts and sentiments, They want to rewrite the initial sentiment to match the author's writing style and tone of voice, while maintaining the original meaning of the text.
  Author: {sentiment}
  Assitant:`);

export const TextRewritePrompt =
  ChatPromptTemplate.fromPromptMessages<TextRewriteTemplate>([
    txrSystemMessagePrompt,
    txrHumanMessagePrompt,
  ]);
