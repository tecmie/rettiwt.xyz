const fs = require('fs');
const path = require('path');

function extractTweetLinks(filePath) {
  // Read the JSON file
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonArray = JSON.parse(fileContent);

  // Extract the tweetLink values
  const tweetLinks = jsonArray.map((item) => item.tweetLink);

  // Define the output file path
  const outputFilePath = path.join(path.dirname(filePath), 'scrape_likes_19_8_23_links.txt');

  // Write the tweetLinks to the new text file
  fs.writeFileSync(outputFilePath, tweetLinks.join('\n'));

  console.log(`Tweet links written to ${outputFilePath}`);
}

// Example usage
const filePath = 'data/likes/scrape_likes_19_8_23.json';
extractTweetLinks(filePath);
