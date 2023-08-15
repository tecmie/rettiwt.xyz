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
    avatar: boolean;
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
     * @memberof ITweet
     * @description The string content of the tweet.
     */
    content: string;
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
    LIKE = "like"
  }