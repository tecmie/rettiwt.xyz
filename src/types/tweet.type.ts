export interface ITweetAuthor {
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
  avatar: string;
  /**
   * @memberof ITweetAuthor
   * @description The bio of the author.
   */
  bio?: string;
  /**
   * @memberof ITweetAuthor
   * @description Whether the author has custom timelines.
   */
  has_custom_timelines: boolean;
  /**
   * @memberof ITweetAuthor
   * @description The URL of the author's profile.
   */
  url: string;
  /**
   * @memberof ITweetAuthor
   * @description Whether the author is verified.
   */
  verified: boolean;
}

export interface ITweet {
  /**
   * @memberof ITweet
   * @description The unique identifier of the tweet.
   */
  id: string | number;
  
    /**
   * @optional
   * @memberof ITweetAuthor
   * @description The id of tweet the user is replying to
   */
    parent_id?: string;

  /**
   * @memberof ITweet
   * @description The string content of the tweet.
   */
  content: string;

  /**
   * @memberof ITweet
   * @description The timestamp of the tweet.
   */
  timestamp: Date | string;

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

export enum ITweetInteraction {
  /**
   * @memberof ITweetInteraction
   * @description A direct tweet.
   */
  TWEET = "tweet",
  /**
   * @memberof ITweetInteraction
   * @description A quote of another tweet.
   */
  QUOTE_TWEET = "quote-tweet",
  /**
   * @memberof ITweetInteraction
   * @description A retweet of another tweet.
   */
  RETWEET = "retweet",
  /**
   * @memberof ITweetInteraction
   * @description A favorite action on a tweet.
   */
  LIKE = "like",

  /**
   * @memberof ITweetInteraction
   * @description A bookmark action on a tweet.
   * @since 1.1.0
   */
  BOOKMARK = "bookmark",

  /**
   * @memberof ITweetInteraction
   * @description A reply to a tweet.
   * @since 1.1.0
   */
  REPLY = "tweet-reply",
}
