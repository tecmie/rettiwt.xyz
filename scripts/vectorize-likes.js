const fs = require('fs');
const EMBEDDING_SOURCE_COLUMN = 'text'

const { connect, WriteMode, OpenAIEmbeddingFunction } = require('vectordb');
const embedFunction = new OpenAIEmbeddingFunction(EMBEDDING_SOURCE_COLUMN, process.env.OAK);




const processTweets = async (jsonFilePath) => {
  const tweets = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

  const db = await connect('vectors');

  for (const tweet of tweets) {
    // If full_tweet is an empty object, skip to the next iteration
    if (!tweet.full_tweet || Object.keys(tweet.full_tweet).length === 0) {
      continue;
    }

    const {
      url,
      type,
      username,
      full_tweet: {
        username: authorUsername,
        full_text,
        media,
        created_at,
        retweet_count,
        favorite_count,
        hashtags,
        reply_count,
        user_mentions,
        view_count,
        quote_count,
      },
      timestamp,
    } = tweet;


    let mediaType = media && media.length > 0 ? media[0].type : 'written text';

    const text = `
    At ${timestamp}, ${username} performed a ${type} ACTION on a tweet from ${authorUsername} that says "${full_text}". 
    This tweet has a ${mediaType} with a reply count of ${reply_count} and has been favorited for ${favorite_count} time.
    We checked if ${authorUsername} used a hashtag and found ${hashtags.join(', ',)}.
    We also checked if ${authorUsername} mentioned other authors and found ${JSON.stringify(user_mentions.join(', ',))}. 
    The tweet was created at ${created_at}, has been viewed a total of ${view_count}, retweeted ${retweet_count}, and has been quoted ${quote_count} times since after ${username} performed a ${type} ACTION on the tweet`;

    const data = {
      url,
      type,
      text,
      username,
      timestamp,
    };

    try {
      /* You must open the table with the embedding function */
      const table = await db.openTable(username, embedFunction);
      await table.add([data]);

      console.log({ table, owner: username }, `we got a valid table for <><><><><><><><><<<<><><>><><<> ${url}`,);

  } catch (error) {
    
    if (error.message.includes('was not found')) {
        await db.createTable(username, [data], embedFunction, {
          writeMode: WriteMode.Overwrite,
        });
        console.log({ error, owner: data.username }, `we created a new table <><><><><><><><><<<<><><>><><<>`,);
      } else {
        console.error({ owner: data.username , error, embedFunction });
        throw new Error(error);
      }

    }
  }

  console.log('Tweets processed successfully! Pass the virtual popcorn');
};

/**
 * @example
 * 
 * 
 * [
  {
    "username": "DanielRegha",
    "type": "likes",
    "url": "https://twitter.com/davido/status/1692864078950117474",
    "timestamp": "2023-08-19T16:21:04.916Z",
    "full_tweet": {
      "id": "1692864078950117474",
      "conversation_id": "1692864078950117474",
      "full_text": "Praying for you my brother @wizkidayo Sadness flies away on the wings of time. ❤️",
      "reply_count": 4665,
      "retweet_count": 18750,
      "favorite_count": 102872,
      "hashtags": [],
      "symbols": [],
      "user_mentions": [
        {
          "id_str": "32660559",
          "name": "Wizkid",
          "screen_name": "wizkidayo",
          "profile": "https://twitter.com/wizkidayo"
        }
      ],
      "urls": [],
      "media": [],
      "url": "https://twitter.com/davido/status/1692864078950117474",
      "created_at": "2023-08-19T11:40:22.000Z",
      "view_count": 2017080,
      "quote_count": 677,
      "is_quote_tweet": false,
      "is_retweet": false,
      "is_pinned": false,
      "is_truncated": false,
      "startUrl": "https://twitter.com/davido/status/1692864078950117474"
    }
  },

  {
    "username": "Emeneks",
    "type": "likes",
    "url": "https://twitter.com/EzeVictr/status/1692929087159796172",
    "timestamp": "2023-08-19T17:12:26.355Z",
    "full_tweet": {
      "username": "EzeVictr",
      "user_id": "1654938641536303107",
      "id": "1692929087159796172",
      "conversation_id": "1692929087159796172",
      "full_text": "My Boss @FS_Yusuf_  followed me!! Add 6 more shoulder pads for me . https://t.co/ybso1mPN89",
      "reply_count": 16,
      "retweet_count": 3,
      "favorite_count": 79,
      "hashtags": [],
      "symbols": [],
      "user_mentions": [
        {
          "id_str": "468685040",
          "name": "FS Yusuf",
          "screen_name": "FS_Yusuf_",
          "profile": "https://twitter.com/FS_Yusuf_"
        }
      ],
      "urls": [],
      "media": [
        {
          "media_url": "https://pbs.twimg.com/media/F35-BuvWkAEsBrB.jpg",
          "type": "photo"
        },
        {
          "media_url": "https://pbs.twimg.com/media/F35-Bu3W4AAJnnf.jpg",
          "type": "photo"
        }
      ],
      "url": "https://twitter.com/EzeVictr/status/1692929087159796172",
      "created_at": "2023-08-19T15:58:42.000Z",
      "view_count": 5541,
      "quote_count": 1,
      "is_quote_tweet": false,
      "is_retweet": false,
      "is_pinned": false,
      "is_truncated": false,
      "startUrl": "https://twitter.com/EzeVictr/status/1692929087159796172"
    }
  },
]
 */

const jsonFilePath = 'raw/data/parsed/dataset_twitter_scrape_likes_full_parsed.json';

processTweets(jsonFilePath).catch((err) =>
  console.error('The gremlins are back!', err),
);
