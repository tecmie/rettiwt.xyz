const fs = require('fs');
const _ = require('lodash');

const { connect, WriteMode, OpenAIEmbeddingFunction } = require('vectordb');

const embedFunction = new OpenAIEmbeddingFunction(
  'context',
  process.env.OPENAI_API_KEY,
);

const processTweets = async (jsonFilePath) => {
  const tweets = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  const db = await connect('vectors');

  // Group the tweets by username
  const groupedTweets = _.groupBy(tweets, 'username');

  console.log({ groupedTweets });

  for (const [username, userTweets] of Object.entries(groupedTweets)) {
    const data = userTweets
      .filter(
        (tweet) => tweet.full_tweet && Object.keys(tweet.full_tweet).length > 0,
      )
      .map((tweet) => {
        const {
          username,
          type,
          url,
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

        let mediaType = '';
        if (media && media.length > 0) {
          mediaType = media[0].type || 'written text';
        }

        const text = `
        At ${timestamp}, ${username} performed a ${type} ACTION on a tweet from ${authorUsername} that says "${full_text}". 
        This tweet has a ${mediaType} with a reply count of ${reply_count} and has been favorited for ${favorite_count} time.
        We checked if ${authorUsername} used a hashtag and found ${hashtags.join(
          ', ',
        )}.
        We also checked if ${authorUsername} mentioned other authors and found ${user_mentions.join(
          ', ',
        )}. 
        The tweet was created at ${created_at}, has been viewed a total of ${view_count}, retweeted ${retweet_count} and has been quoted ${quote_count} times since after ${username} performed a ${type} ACTION on the tweet`;

        return {
          context: text,
          url,
          type,
          username,
          timestamp,
        };
      });

    if (data.length === 0) {
      continue;
    }

    // console.log( data[0] )

    try {
      // Attempt to open the table. If it exists, we'll add the data to it.
      const table = await db.openTable(username);
      await table.add(data);
    } catch (catchErr) {
      // If an error occurs, it's likely because the table doesn't exist. Let's create it!
      // await db.createTable(username, data, WriteMode.Overwrite, embedFunction);

      try {
        console.error({ embedFunction }, catchErr);
        await db.createTable(username, data, embedFunction, {
          writeMode: WriteMode.Overwrite,
        });
      } catch (error) {
        console.error({ error, catchErr });
        throw new Error(error);
      }
    }
  }

  console.log(
    'Tweets processed successfully! The Twitter-sphere is now a more organized place!',
  );
};

const jsonFilePath =
  'data/parsed/dataset_twitter_scrape_likes_full_parsed.json';
processTweets(jsonFilePath).catch((err) =>
  console.error('Gremlins, please leave our code alone!', err),
);
