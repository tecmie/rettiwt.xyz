import { type Author, type Tweet } from '@prisma/client';
import { type ITweet } from './tweet.type';

export interface ITimelineTweet extends Tweet {
  /**
   * @memberof ITimelineTweet
   * @description Whether the tweet is a retweet.
   */
  author: Author;

  /**
   * @optional
   * @memberof ITimelineTweet
   * @description The tweet that is quoted. `quote_parent`
   * @see {@link ITweet}
   */
  quote_parent?: ITweet | null;

  /**
   * @optional
   * @memberof ITimelineTweet
   * @description The tweet that is replied to `parent_tweet`
   * @see {@link ITweet}
   */
  reply_parent?: ITweet | null;
}
