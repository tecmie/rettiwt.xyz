import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const querySentiments = z.object({
  limit: z.number().min(1).max(50).nullish(),
  tweetId: z.string(),
  // <-- "cursor" needs to exist, but can be any type
  cursor: z.number().nullish().describe('our timestamp is our cursor'),
});

export const sentimentRouter = createTRPCRouter({
  list_by: publicProcedure
    .input(querySentiments)
    .query(async ({ input, ctx }) => {
      const cursor = input.cursor ? { id: input.cursor } : undefined;
      const limit = input.limit ?? 10;

      const sentiments = await ctx.prisma.sentiment.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor,
        where: {
          tweet_id: input.tweetId,
        },
        orderBy: {
          tweet_id: 'desc',
        },
        cursor: cursor,
        include: {
          author: {
            select: {
              id: true,
              avatar: true,
              name: true,
              handle: true,
              bio: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      /**
       * We do this to skip the Item with took in our Take 1
       * @see LINE 20
       */
      if (sentiments.length > limit) {
        const nextItem = sentiments.pop();

        /* Assign the ID from this take to our cursor */
        nextCursor = nextItem?.id;
      }
      return {
        sentiments: sentiments,
        nextCursor,
      };
    }),
  list_all: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const cursor = input.cursor ? { id: input.cursor } : undefined;
      const limit = input.limit ?? 20;

      const sentiments = await ctx.prisma.sentiment.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor,
        orderBy: {
          tweet_id: 'desc',
        },
        cursor: cursor,
        include: {
          tweet: {
            select: {
              id: true,
              content: true,
              intent: true,
              author: true,
            },
          },

          author: {
            select: {
              id: true,
              avatar: true,
              name: true,
              handle: true,
              bio: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      /**
       * We do this to skip the Item with took in our Take 1
       * @see LINE 20
       */
      if (sentiments.length > limit) {
        const nextItem = sentiments.pop();

        /* Assign the ID from this take to our cursor */
        nextCursor = nextItem?.id;
      }
      return {
        sentiments: sentiments,
        nextCursor,
      };
    }),
});
