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
        context = 
        `Quote tweet from @${username} (User ID: ${user_id}) with ${reply_count} replies, ${retweet_count} retweets, and ${favorite_count} favorites.
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
  
  const jsonFilePath = 'data/parsed/dataset_twitter_scraper_with_replies_parsed.json';
  
  vectorizeTweets(jsonFilePath).catch((err) =>
    console.error('The digital gnomes are at it again! 🧙‍♂️', err),
  );
  