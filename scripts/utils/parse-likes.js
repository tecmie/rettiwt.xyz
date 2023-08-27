const fs = require('fs');
const path = require('path');

function transformJsonLikes(filePath, tweetDetailsFilePath) {
  // Read the JSON file with tweet details
  const tweetDetailsFileContent = fs.readFileSync(tweetDetailsFilePath, 'utf8');
  const tweetDetailsArray = JSON.parse(tweetDetailsFileContent);

  // Read the JSON file to transform
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonArray = JSON.parse(fileContent);

  // Transform the array based on the requirements
  const transformedArray = jsonArray.map((item) => {
    // Extract the username from the query URL
    const handle = item.query.split('/').pop();

    // Search for the tweet link in the tweet details array
    const matchingTweet = tweetDetailsArray.find(
      (tweet) => tweet.startUrl === item.tweetLink,
    );

    const { user, ...restTweet } = matchingTweet || {};

    // Return a new object with the required transformations and the matched tweet object
    return {
      username: handle,
      type: item.type,
      //   name: item.name,
      url: item.tweetLink,
      timestamp: item.timestamp,
      //   created_at: item.timestamp,
      full_tweet: matchingTweet, // Add the matched tweet object
    };
  });

  // Define the output file path
  const outputFilePath = path.join(
    path.dirname(filePath),
    'scrape_likes_19_8_23_parsed.json',
  );

  // Write the transformed data to the new file
  fs.writeFileSync(outputFilePath, JSON.stringify(transformedArray, null, 2));

  console.log(
    `Transformed data with tweetObjects written to ${outputFilePath}`,
  );
}

// Example usage
const filePath = 'data/likes/scrape_likes_19_8_23.json';
const tweetDetailsFilePath =
  'data/likes/dataset_twitter-scraper_2023-08-21_10-30-42-604.json';
transformJsonLikes(filePath, tweetDetailsFilePath);
