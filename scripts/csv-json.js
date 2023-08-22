const fs = require('fs');
const csvParser = require('csv-parser');
/**
 * Converts a CSV file to a JSON file using a simple parser.
 *
 * @param {string} csvFilePath - The path to the CSV file to be converted.
 * @param {string} jsonFilePath - The path to the JSON file to be created.
 * @returns {void}
 */
const convertCsvToJson = (csvFilePath, jsonFilePath) => {
  // Creating an empty array to store the results
  const results = [];

  // Creating a read stream for the CSV file and piping it to the CSV parser
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data)) // Pushing each row of data to the results array
    .on('end', () => {
      // Writing the JSON object to a file
      fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2));
      console.log(
        `CSV has been converted to JSON and saved to ${jsonFilePath}`,
      );
    });
};

// Example usage:
const csvFilePath = 'data/likes/scrape_likes_full.csv';
const jsonFilePath = 'data/likes/scrape_likes_full.json';
convertCsvToJson(csvFilePath, jsonFilePath);
