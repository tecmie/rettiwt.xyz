const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const profiles = require('./authors');
const shuffle = require('lodash/shuffle');

const createAuthors = async () => {
  // Declare an array to store the IDs
  const authorIds = [];

  for (const handle in profiles) {
    const user = profiles[handle as '0x'];
    try {
      const createdAuthor = await prisma.author.create({
        data: {
          id: Number(user.id_str),
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
};

function generateId(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const charCode = seed.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0; // Convert to a 32-bit integer
  }
  return Math.abs(Math.floor(hash + Math.random() * 1e9)).toString();
}

async function executeBatchFollowers(authorIds: string[]) {
  for (const authorId of authorIds) {
    // Shuffle the array and exclude the current author ID
    const shuffledIds = shuffle(authorIds.filter((id) => id !== authorId));

    // Cross over permutation, so each author has at least 3 possible mutual relationships
    const followingIds = shuffledIds.slice(0, 13);

    // Construct the values for the INSERT INTO statement
    const values = followingIds
      .map(
        (id: any) => `('${generateId(authorId + id)}', '${authorId}', '${id}')`,
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
      await prisma.$executeRaw`INSERT INTO "Follow" ("id", "follower_id", "following_id") VALUES (${Number(
        followId,
      )}, ${authorId}, ${followingId})`;
    }
  }
}

async function main() {
  const authors: string[] = await createAuthors();
  // const authors = Object.keys(profiles)
  // const aIds = authors.map(value => profiles[value].id_str)

  // console.log(authors)

  /* Use authors to create a batch follow operation */
  await executeBatchFollowers(authors);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
