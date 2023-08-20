const fs = require('fs');
const path = require('path');

function transformJsonFile(filePath) {
  // Read the JSON file
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonArray = JSON.parse(fileContent);

  // Transform the array based on the requirements
  const transformedArray = jsonArray.map((item) => {
    // Extract the username from the query URL
    const handle = item.query.split('/').pop();

    // Return a new object with the required transformations
    return {
      username: handle, // Added username key
      name: item.name,
      url: item.tweetLink, // Renamed from tweetLink
      timestamp: item.timestamp,
      created_at: item.timestamp, // This is a duplicate of timestamp
      type: item.type,
      // Excluded profileUser, tweetDate, text, and profileUrl
    };
  });

  // Define the output file path
  const outputFilePath = path.join(path.dirname(filePath), 'parsed.json');

  // Write the transformed data to the new file
  fs.writeFileSync(outputFilePath, JSON.stringify(transformedArray, null, 2));

  console.log(`Transformed data written to ${outputFilePath}`);
}

// Example usage
const filePath = 'data/likes/scrape_likes_full.json';
transformJsonFile(filePath);
