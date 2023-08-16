import { ITimelineTweet } from "@/types/timeline.type";
import { ITweetAuthor, ITweetInteraction } from "@/types/tweet.type";

const tweetAuthor: ITweetAuthor = {
  id: "1",
  handle: "0xalzzy",
  name: "Miracle",
  avatar:
    "https://pbs.twimg.com/profile_images/1624061840660520960/R2DzPe0c_normal.jpg",
  has_custom_timelines: false,
  url: "https://twitter.com/0xalzzy",
  verified: true,
};

export const timelineTweets: ITimelineTweet[] = [
  {
    id: "1",
    content: "This is the first tweet",
    quote_count: 0,
    reply_count: 0,
    timestamp: "2021-07-20T15:00:00.000Z",
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
  {
    id: "2",
    content: "This is the second tweet",
    quote_count: 0,
    reply_count: 0,
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    timestamp: "2021-07-20T15:00:00.000Z",
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
  {
    id: "3",
    content: "This is the third tweet",
    quote_count: 0,
    reply_count: 0,
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    timestamp: "2021-07-20T15:00:00.000Z",
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
  {
    id: "4",
    content: "This is the fourth tweet",
    quote_count: 0,
    reply_count: 0,
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    timestamp: "2021-07-20T15:00:00.000Z",
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
  {
    id: "5",
    content: "This is the fifth tweet",
    quote_count: 0,
    reply_count: 0,
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    timestamp: "2021-07-20T15:00:00.000Z",
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
  {
    id: "6",
    content: "This is the sixth tweet",
    quote_count: 0,
    reply_count: 0,
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    timestamp: "2021-07-20T15:00:00.000Z",
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
  {
    id: "7",
    content: "This is the seventh tweet",
    quote_count: 0,
    reply_count: 0,
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    timestamp: "2021-07-20T15:00:00.000Z",
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
  {
    id: "8",
    content: "This is the eighth tweet",
    quote_count: 0,
    reply_count: 0,
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    timestamp: "2021-07-20T15:00:00.000Z",
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
  {
    id: "9",
    content: "This is the ninth tweet",
    quote_count: 0,
    reply_count: 0,
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    timestamp: "2021-07-20T15:00:00.000Z",
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
  {
    id: "10",
    content: "This is the tenth tweet",
    quote_count: 0,
    reply_count: 0,
    repost_count: 0,
    favorite_count: 0,
    bookmark_count: 0,
    author: tweetAuthor,
    timestamp: "2021-07-20T15:00:00.000Z",
    type: ITweetInteraction.TWEET,
    is_pinned: false,
    is_quote_tweet: false,
    is_retweet: false,
  },
];