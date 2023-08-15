import { ITweet, ITweetInteraction } from "./tweet.type";



export interface ITimelineTweet extends ITweet {
    /** 
     * @memberof ITimelineTweet
     * @description The type of interaction with the tweet.
     */
    type: ITweetInteraction;
    /** 
     * @memberof ITimelineTweet
     * @description Whether the tweet is pinned.
     */
    is_pinned: boolean;
    /** 
     * @memberof ITimelineTweet
     * @description Whether the tweet is a quote tweet.
     */
    is_quote_tweet: boolean;
    /** 
     * @memberof ITimelineTweet
     * @description Whether the tweet is a retweet.
     */
    is_retweet: boolean;

    /**
     * @optional
     * @memberof ITimelineTweet
     * @description The tweet that is quoted.
     * @see {@link ITweet}
     */
    quoted_tweet?: ITweet;
  }
  
