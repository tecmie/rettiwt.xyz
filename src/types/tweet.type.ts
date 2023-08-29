import { type Author, type Tweet } from '@prisma/client';

export interface ITweetAuthor extends Author {
  /**
   * @memberof ITweetAuthor
   * @description The unique identifier of the author.
   */
  id: string;
  /**
   * @memberof ITweetAuthor
   * @description The Twitter handle of the author.
   */
  handle: string;
  /**
   * @memberof ITweetAuthor
   * @description The screen name of the author.
   */
  name: string;
  /**
   * @memberof ITweetAuthor
   * @description The profile picture URL of the author.
   */
  avatar: string | null;
  /**
   * @memberof ITweetAuthor
   * @description The bio of the author.
   */
  bio: string | null;
  /**
   * @memberof ITweetAuthor
   * @description Whether the author has custom timelines.
   */
  has_custom_timelines: boolean;
  /**
   * @memberof ITweetAuthor
   * @description The URL of the author's profile.
   */
  url: string | null;
  /**
   * @memberof ITweetAuthor
   * @description Whether the author is verified.
   */
  verified: boolean;
}

export interface ITweet extends Tweet {
  /**
   * @memberof ITweet
   * @description The unique identifier of the tweet.
   */
  id: string;

  /**
   * @memberof ITweet
   * @description The string content of the tweet.
   */
  content: string;

  /**
   * @memberof ITweet
   * @description The timestamp of the tweet.
   */
  timestamp: Date;

  /**
   * @memberof ITweet
   * @description The number of times the tweet has been quoted.
   */
  quote_count: number;
  /**
   * @memberof ITweet
   * @description The number of times the tweet has been replied to.
   */
  reply_count: number;
  /**
   * @memberof ITweet
   * @description The number of times the tweet has been reposted.
   */
  repost_count: number;
  /**
   * @memberof ITweet
   * @description The number of times the tweet has been liked.
   */
  favorite_count: number;
  /**
   * @memberof ITweet
   * @description The number of times the tweet has been bookmarked.
   */
  bookmark_count: number;
  /**
   * @memberof ITweet
   * @description The author of the tweet.
   */
  author: ITweetAuthor;
}

export enum ITweetIntent {
  /**
   * @memberof ITweetIntent
   * @description A DND action on a tweet.
   */
  DND = 'do-not-disturb',
  /**
   * @memberof ITweetIntent
   * @description A direct tweet.
   */
  TWEET = 'tweet',
  /**
   * @memberof ITweetIntent
   * @description A quote of another tweet.
   */
  QUOTE = 'quote-tweet',
  /**
   * @memberof ITweetIntent
   * @description A retweet of another tweet.
   */
  RETWEET = 'retweet',
  /**
   * @memberof ITweetIntent
   * @description A favorite action on a tweet.
   */
  LIKE = 'like',

  /**
   * @memberof ITweetIntent
   * @description A bookmark action on a tweet.
   * @since 1.1.0
   */
  BOOKMARK = 'bookmark',

  /**
   * @memberof ITweetIntent
   * @description A reply to a tweet.
   * @since 1.1.0
   */
  REPLY = 'thread-tweet',
}
