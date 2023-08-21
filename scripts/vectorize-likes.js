const fs = require('fs');
const { connect, WriteMode, OpenAIEmbeddingFunction } = require('vectordb');

const embedFunction = new OpenAIEmbeddingFunction('context', process.env.OAK);

const processTweets = async (jsonFilePath) => {
  const tweets = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  const db = await connect('vectors');

  for (const tweet of tweets) {
     // If full_tweet is an empty object, skip to the next iteration
     if (!tweet.full_tweet || Object.keys(tweet.full_tweet).length === 0) {
      continue;
    }


    const {
      username,
      type,
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
        quote_count
      },
      timestamp,
    } = tweet;

    let mediaType = media && media.length > 0 ? media[0].type || 'written text' : 'written text';

    const text = `
    At ${timestamp}, ${username} performed a ${type} ACTION on a tweet from ${authorUsername} that says "${full_text}". 
    This tweet has a ${mediaType} with a reply count of ${reply_count} and has been favorited for ${favorite_count} time.
    We checked if ${authorUsername} used a hashtag and found ${hashtags.join(', ')}.
    We also checked if ${authorUsername} mentioned other authors and found ${user_mentions.join(', ')}. 
    The tweet was created at ${created_at}, has been viewed a total of ${view_count}, retweeted ${retweet_count}, and has been quoted ${quote_count} times since after ${username} performed a ${type} ACTION on the tweet`;

    const data = {
      context: text,
      type,
      username,
      timestamp,
    };

    try {
      const table = await db.openTable(username);
      await table.add([data]);


    } catch (catchErr) {

      try {
        console.error({ data }, catchErr)
        await db.createTable(username, [data], embedFunction, {
          writeMode: WriteMode.Overwrite,
        });
        
      } catch (error) {
        console.error({error, catchErr})
      }

    }
  }

  console.log('Tweets processed successfully! Pass the virtual popcorn');
};

const jsonFilePath = 'data/parsed/dataset_twitter_scrape_likes_full_parsed.json';

processTweets(jsonFilePath).catch(err => console.error('The gremlins are back!', err));
