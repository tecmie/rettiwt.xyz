const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

import shuffle from "lodash/shuffle";


async function main() {
  // Create some authors with custom IDs
  const author1 = await prisma.author.create({
    data: {
      id: 'custom-id-1',
      handle: 'author1',
      name: 'Author One',
      avatar: false,
      url: 'https://example.com/author1',
    },
  });

  const author2 = await prisma.author.create({
    data: {
      id: 'custom-id-2',
      handle: 'author2',
      name: 'Author Two',
      avatar: false,
      url: 'https://example.com/author2',
    },
  });

  // Create a following relationship between the authors
  await prisma.follow.create({
    data: {
      followerId: author1.id,
      followingId: author2.id,
    },
  });
}


  async function batchFollowOp(authorIds: string[]) {
    if (authorIds.length !== 10) {
      throw new Error('Expected exactly 10 author IDs');
    }
  
    for (const authorId of authorIds) {
      // Shuffle the array and exclude the current author ID
      const shuffledIds = shuffle(authorIds.filter(id => id !== authorId));
  
      // Pick the first 6 IDs from the shuffled array
      const followingIds = shuffledIds.slice(0, 6);
  
      // Construct the values for the INSERT INTO statement
      const values = followingIds.map(id => `('${authorId}', '${id}')`).join(', ');
  
      // Execute the raw SQL query
      await prisma.$executeRaw`INSERT INTO "Follow" ("followerId", "followingId") VALUES ${values}`;
    }
  }
  
  // Example usage
  const authorIds = [
    'id1', 'id2', 'id3', 'id4', 'id5',
    'id6', 'id7', 'id8', 'id9', 'id10'
  ];


main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
