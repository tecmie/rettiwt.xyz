import type { NextApiRequest, NextApiResponse } from 'next';

interface UserMention {
  id_str: string;
  name: string;
  screen_name: string;
  profile: string;
}

interface Media {
  media_url: string;
  type: string;
}

interface Tweet {
  type: 'quote-tweet' | 'thread-tweet' | 'tweet';
  username: string;
  user_id: string;
  id: string;
  conversation_id: string;
  full_text: string;
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
  hashtags: string[];
  symbols: string[];
  user_mentions: UserMention[];
  media: Media[];
  urls: string[];
  url: string;
  view_count: number;
  created_at: string;
  quote_count: number;
  is_quote_tweet: boolean;
  is_retweet: boolean;
  is_pinned: boolean;
  is_truncated: boolean;
  quoted_tweet?: Tweet;
  startUrl?: string;
  sort_index?: string; // Note: You might want to provide a more descriptive name for this property
}

interface LikedTweet {
  username: string;
  type: string;
  url: string;
  timestamp: string;
  full_tweet: Tweet;
}

interface VectorPayload {
  text: string;
  url: string;
  type: string;
  username: string;
  timestamp: string;
}

const vectorizeLikes = (likes: LikedTweet[]): VectorPayload[] => {
  return likes.map((like) => {
    const {
      username,
      type,
      url,
      timestamp,
      full_tweet: {
        username: tweetUsername,
        full_text,
        media,
        reply_count,
        user_mentions,
        view_count,
        quote_count,
      },
    } = like;

    let mediaType = '';
    if (media && media.length > 0) {
      mediaType = media[0]?.type || 'written text';
    }

    const text = `${username} just liked a tweet from ${tweetUsername} that says "${full_text}" at ${timestamp}. This tweet has a ${mediaType} and has a reply count of ${reply_count} and has been favorited by ${
      like.full_tweet.favorite_count
    } users with hashtags like ${like.full_tweet.hashtags.join(
      ', ',
    )} and user mentions of ${user_mentions.join(
      ', ',
    )}. The tweet has been viewed a total of ${view_count} and has been quoted ${quote_count} times.`;

    return {
      text,
      url,
      type,
      username,
      timestamp,
    };
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  const data = await vectorizeLikes(req.body as LikedTweet[]);

  res.json(data);
};
