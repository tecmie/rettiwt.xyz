const fs = require('fs');
const path = require('path');

function transformTweets(filePath) {
  // Read the JSON file
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonArray = JSON.parse(fileContent);

  // Transform the array based on the criteria
  const transformedArray = jsonArray.map((item) => {
    if (item.is_retweet) {
      return {
        type: 'retweet',
        ...item,
      };
    } else if (item.is_quote_tweet) {
      return {
        type: 'quote-tweet',
        ...item,
      };
    } else if (
      item.replying_to_tweet &&
      item.replying_to_tweet.startsWith('https://twitter.com/')
    ) {
      return {
        type: 'thread-tweet',
        ...item,
      };
    } else {
      return {
        type: 'tweet',
        ...item,
      };
    }
  });

  // Define the output file path
  const outputFilePath = path.join(
    path.dirname(filePath),
    'latest_diversity.json',
  );

  // Write the transformed data to the new file
  fs.writeFileSync(outputFilePath, JSON.stringify(transformedArray, null, 2));

  console.log(`Transformed data written to ${outputFilePath}`);
}

// Example usage
const filePath = 'raw/dataset_twitter-scraper_latest_diversity-08-25_12-10-58-532.json';
transformTweets(filePath);
