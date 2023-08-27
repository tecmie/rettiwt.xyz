/**
 * Format a number to a whole number with comma separators.
 *
 * @param {number} number - The number to be formatted.
 * @returns {string} - The formatted number as a string with no decimals.
 *
 * @example
 * const decimalNumber = 2450000.5678;
 * const wholeNumber = formatWholeNumber(decimalNumber);  // Outputs "2,450,000"
 */
export const formatWholeNumber = (number: number): string => {
  return number.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
};

/**
 * Format a number to a decimal number with comma separators and a maximum of 2 decimal places.
 *
 * @param {number} number - The number to be formatted.
 * @returns {string} - The formatted number as a string with 2 decimal places.
 *
 * @example
 * const decimalNumber = 2450000.5678;
 * const formattedDecimalNumber = formatDecimalNumbers(decimalNumber);  // Outputs "2,450,000.57"
 */
export const formatDecimalNumbers = (number: number): string => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Generate a random integer between min and max, inclusive.
 *
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} - A random integer between min and max, inclusive.
 *
 * @example
 * const randomNum = randomInt(1, 10);  // Generates a random integer between 1 and 10
 */
export function randomInt(min: number, max: number): number {
  const xmin = Math.ceil(min);
  const xmax = Math.floor(max);
  return Math.floor(Math.random() * (xmax - xmin + 1)) + min;
}

/**
 * Generate a random whole number between min and max, format it with comma separators, and return it as a string.
 *
 * @returns {string} - The formatted random whole number as a string.
 *
 * @example
 * const formattedRandomWholeNumber = randomWholeInt(1, 10);  // random whole number between 1 and 10 and formats it with comma separators
 */
export function randomWholeInt(min: number, max: number): string {
  return formatWholeNumber(randomInt(min, max));
}

/**
 * Sanitizes a string by removing any characters that are not letters,
 * numbers, spaces, periods, commas, underscores, hashtags, ampersands, equal signs, or hyphens.
 *
 * @param {string} [str=""] - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
export function sanitizeText(str: string = '') {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_#&=?-]/gim, '');
  return str.trim();
}
