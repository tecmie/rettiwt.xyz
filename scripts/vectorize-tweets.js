const fs = require('fs');
const EMBEDDING_SOURCE_COLUMN = 'text'


const { connect, WriteMode, OpenAIEmbeddingFunction } = require('vectordb');
const embedFunction = new OpenAIEmbeddingFunction(EMBEDDING_SOURCE_COLUMN, process.env.OAK);


const vectorizeTweets = async (jsonFilePath) => {
    const tweets = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    /* Regex we use to extract tweet author and id from a post url */
    const tweetURLPattern = /https:\/\/twitter.com\/(\w+)\/status\/(\d+)/;
  
    const db = await connect('vectors');
  
    for (const tweet of tweets) {
      if (!tweet || Object.keys(tweet).length === 0) {
        continue;
      }

      const {
        url,
        id,
        type,
        user_id,
        username,
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
        /* exxternal context */
        quoted_tweet,
        replying_to_tweet,
      } = tweet;
  
      let mediaType = media && media.length > 0 ? media[0].type : 'written text';

      let context;
      if (type == 'quote-tweet' && quoted_tweet) {
        context = `Quote tweet from @${username} (User ID: ${user_id}) with ${reply_count} replies, ${retweet_count} retweets, and ${favorite_count} favorites.
        This tweet has a ${mediaType} and our response when we checked for hashtags were: ${hashtags.join(', ',)}.
        We also checked if ${username} mentioned other authors and found ${JSON.stringify(user_mentions.join(', ',))}. 
        Content of our quote: "${full_text}". 
        
        Quoting a tweet from @${quoted_tweet.username} (User ID: ${quoted_tweet.user_id}) with ${quoted_tweet.reply_count} replies, ${quoted_tweet.retweet_count} retweets, and ${quoted_tweet.favorite_count} favorites. 
        Details of the tweet we quoted > Content: "${quoted_tweet.full_text}". Created at: ${quoted_tweet.created_at}. View count: ${quoted_tweet.view_count}. Quote count: ${quoted_tweet.quote_count}.
                
        Final notes, This ${type} post was created at ${created_at}, has been viewed a total of ${view_count}, retweeted ${retweet_count}, and has been quoted ${quote_count} times since after ${username} performed a ${type} ACTION on the tweet`;

      } else if (type == 'thread-tweet' && replying_to_tweet.match(tweetURLPattern)) {
        const [tweetURL, replyToAuthor, statusId] =  replying_to_tweet.match(tweetURLPattern);

        console.log({ tweetURL, statusId, replyToAuthor, username })

        /* Context style for reply tweets */
        context = `At ${created_at}, ${username} performed a ${type} ACTION connected to an earlier tweet from ${replyToAuthor} with "[parent.id]" ${statusId}.
        The content of their post is: "${full_text}". 
        This tweet has a ${mediaType} with a reply count of ${reply_count} and has been favorited for ${favorite_count} time.
        We checked if ${username} used a hashtag and found ${hashtags.join(', ',)}.
        We also checked if ${username} mentioned other authors and found ${JSON.stringify(user_mentions.join(', ',))}. 
        The ${type} post was created at ${created_at}, has been viewed a total of ${view_count}, retweeted ${retweet_count}, and has been quoted ${quote_count} times since after ${username} performed a ${type} ACTION on the tweet`;

      } else {

        context = `At ${created_at}, ${username} performed a ${type} ACTION by writing a brand new post that says "${full_text}". 
        This tweet has a ${mediaType} with a reply count of ${reply_count} and has been favorited for ${favorite_count} time.
        We checked if ${username} used a hashtag and found ${hashtags.join(', ',)}.
        We also checked if ${username} mentioned other authors and found ${JSON.stringify(user_mentions.join(', ',))}. 
        The tweet was created at ${created_at}, has been viewed a total of ${view_count}, retweeted ${retweet_count}, and has been quoted ${quote_count} times since after ${username} performed a ${type} ACTION on the tweet`;
    
      }
    
  
      const data = {
        url,
        type,
        text: context,
        username,
        timestamp: created_at,
      };
  
      try {
        /* You must open the table with the embedding function */
        const table = await db.openTable(username, embedFunction);
        await table.add([data]);
        console.log({ table, owner: username }, `A valid table has been found 🎉 for ${url}`);
      } catch (error) {
        if (error.message.includes('was not found')) {
          await db.createTable(username, [data], embedFunction, {
            writeMode: WriteMode.Append,
          });
          console.log({ error, owner: data.username }, `A new table was born 🐣 <><><><><><><>><><><><<><><><><>>`);
        } else {
          console.error({ owner: data.username , error, embedFunction });
          throw new Error(JSON.stringify({error, data }));
        }
      }
    }
  
    console.log('Tweets processed successfully! Unleash the fireworks! 🎆');
  };
  

  /**
   * @example
   * 
   * 
  [
  {
    "type": "tweet",
    "username": "davido",
    "user_id": "192947735",
    "id": "1604464566632603649",
    "conversation_id": "1604464566632603649",
    "full_text": "ETA 1hr 🇶🇦 #WorldcupQatar2022 https://t.co/4qu7mRSP6q",
    "reply_count": 16796,
    "retweet_count": 46410,
    "favorite_count": 227679,
    "hashtags": ["WorldcupQatar2022"],
    "symbols": [],
    "user_mentions": [],
    "urls": [],
    "media": [
      {
        "media_url": "https://pbs.twimg.com/media/FkQz-8EWYAMeEml.jpg",
        "type": "photo"
      },
      {
        "media_url": "https://pbs.twimg.com/media/FkQz-8EXgAEGGaG.jpg",
        "type": "photo"
      },
      {
        "media_url": "https://pbs.twimg.com/media/FkQz-8BXgAAHRdP.jpg",
        "type": "photo"
      },
      {
        "media_url": "https://pbs.twimg.com/media/FkQz-8CWQAY7VfP.jpg",
        "type": "photo"
      }
    ],
    "url": "https://twitter.com/davido/status/1604464566632603649",
    "created_at": "2022-12-18T13:12:16.000Z",
    "view_count": 12223174,
    "quote_count": 9473,
    "is_quote_tweet": false,
    "is_retweet": false,
    "is_pinned": false,
    "is_truncated": false,
    "startUrl": "https://twitter.com/davido/with_replies"
  },
  {
    "type": "tweet",
    "username": "davido",
    "user_id": "192947735",
    "id": "1638170441536684038",
    "conversation_id": "1638170441536684038",
    "full_text": "There is a time for everything. A time to Grieve and a time to Heal.\nA time to Laugh and a time to Dance. A time to Speak &amp; A time for Silence.\n\nThank you to everyone out there for your love and that has held me down.\n\nMy next album TIMELESS is here, March 31st. Preorder in bio💚 https://t.co/XLXNAJl4XL",
    "reply_count": 21259,
    "retweet_count": 66168,
    "favorite_count": 219972,
    "hashtags": [],
    "symbols": [],
    "user_mentions": [],
    "urls": [],
    "media": [
      {
        "media_url": "https://pbs.twimg.com/ext_tw_video_thumb/1638170303556624384/pu/img/qhAHyZ2ula-hkHvp.jpg",
        "type": "video",
        "video_url": "https://video.twimg.com/ext_tw_video/1638170303556624384/pu/vid/720x1280/mx0KivyxHJF9Y2Jd.mp4?tag=12"
      }
    ],
    "url": "https://twitter.com/davido/status/1638170441536684038",
    "created_at": "2023-03-21T13:27:23.000Z",
    "view_count": 7499599,
    "quote_count": 14487,
    "is_quote_tweet": false,
    "is_retweet": false,
    "is_pinned": false,
    "is_truncated": false,
    "startUrl": "https://twitter.com/davido/with_replies"
  },
  {
    "type": "tweet",
    "username": "davido",
    "user_id": "192947735",
    "id": "1322185050939658241",
    "conversation_id": "1322185050939658241",
    "full_text": "Congrats king ! #MIL 🇳🇬 OUT NOW ! https://t.co/QAMPriVAjy",
    "reply_count": 9107,
    "retweet_count": 35998,
    "favorite_count": 170588,
    "hashtags": ["MIL"],
    "symbols": [],
    "user_mentions": [],
    "urls": [],
    "media": [
      {
        "media_url": "https://pbs.twimg.com/media/EllYSMAXgAI8zKz.jpg",
        "type": "photo"
      }
    ],
    "url": "https://twitter.com/davido/status/1322185050939658241",
    "created_at": "2020-10-30T14:34:15.000Z",
    "quote_count": 5582,
    "is_quote_tweet": false,
    "is_retweet": false,
    "is_pinned": false,
    "is_truncated": false,
    "startUrl": "https://twitter.com/davido/with_replies"
  }
]
   */
  const jsonFilePath = 'raw/data/parsed/dataset_twitter_scraper_with_replies_parsed.json';
  
  vectorizeTweets(jsonFilePath).catch((err) =>
    console.error('The digital gnomes are at it again! 🧙‍♂️', err),
  );
  