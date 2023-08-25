// import {prisma} from '@/server/db';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const profiles = require('./authors');
const shuffle = require('lodash/shuffle');

/**
 * Creates authors in the database based on the provided profiles.
 * @returns {Promise<string[]>} - A promise that resolves to an array of author IDs.
 */
async function createAuthors() {
  const authorIds = [];

  for (const handle in profiles) {
    const user = profiles[handle as '0x'];
    try {
      const createdAuthor = await prisma.author.create({
        data: {
          id: String(user.id_str),
          handle: handle,
          name: user.name,
          bio: user.description,
          avatar: user.profile_image_url_https,
          has_custom_timelines: user.has_custom_timelines,
          url: user.profile_banner_url,
          verified: user.verified,
        },
      });
      authorIds.push(createdAuthor.id); // Push the ID into the array
      console.log(`Author ${handle} created successfully! 🎉`);
    } catch (error) {
      console.error(`Failed to create author ${handle}:`, error);
    }
  }

  console.log('All author IDs:', authorIds);
  return authorIds;
}

/**
 * Generates a unique ID based on the given seed value.
 *
 * @param {string} seed - The seed value to generate the ID from.
 * @returns {number} - A unique ID.
 */
function generateId(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const charCode = seed.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0; // Convert to a 32-bit integer
  }
  return Math.abs(Math.floor(hash + randomInt(100, 10000)));
}

/**
 * Generates a random integer between the specified minimum and maximum values.
 *
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - A random integer between the specified minimum and maximum values.
 */
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Executes the batch followers process for the specified author IDs.
 *
 * @param {string[]} authorIds - The author IDs to execute the batch followers process for.
 * @returns {Promise<void>} - A promise that resolves when the batch followers process is complete.
 */
async function executeBatchFollowers(authorIds: string[]) {
  for (const authorId of authorIds) {
    // Shuffle the array and exclude the current author ID
    const shuffledIds = shuffle(authorIds.filter((id) => id !== authorId));

    // Cross over permutation, so each author has at least 3 possible mutual relationships
    const followingIds = shuffledIds.slice(0, 13);

    // Construct the values for the INSERT INTO statement
    const values = followingIds
      .map(
        (id: string) =>
          `('${generateId(authorId + id)}', '${authorId}', '${id}')`,
      ) // Generating IDs using seed value
      .join(', ');

    // Execute the raw SQL query, including the 'id' field in the column list
    //   await prisma.$executeRaw`INSERT INTO "Follow" ("id", "followerId", "followingId") VALUES ${values}`;
    // }

    for (const followingId of followingIds) {
      // Execute the raw SQL query for each followingId
      const followId = generateId(authorId + followingId); // Generating ID using seed value

      console.log({ followId, authorId, followingId });

      // Execute the raw SQL query, including the 'id' field in the column list
      await prisma.$executeRaw`INSERT INTO "Follow" ("id", "follower_id", "following_id") VALUES (${followId}, ${authorId}, ${followingId})`;
    }
  }
}

async function seedTweets() {
  const tweets: any[] = require('./xims.sqlite_tweet_seed.json');

  try {
    return await prisma.tweet.createMany({
      data: tweets,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error(`Failed to create tweet {tweet}:`, error);
  }
}

async function main() {
  const authors: string[] = await createAuthors();
  // const authors = Object.keys(profiles)
  // const aIds = authors.map(value => profiles[value].id_str)

  /* Use authors to create a batch follow operation */
  await executeBatchFollowers(authors);

  /* ------ seed the db with tweets ------ */
  await seedTweets();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
