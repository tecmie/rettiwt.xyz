import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const queryTimelineSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  actorHandle: z.string(),
  // <-- "cursor" needs to exist, but can be any type
  cursor: z.string().nullish().describe('our timestamp is our cursor'),
});

export const timelineRouter = createTRPCRouter({
  list: publicProcedure
    .input(queryTimelineSchema)
    .query(async ({ input, ctx }) => {
      const cursor = input.cursor ? { id: input.cursor } : undefined;
      const limit = input.limit ?? 25;

      const actor = await ctx.prisma.author.findUnique({
        where: {
          handle: input.actorHandle,
        },
        include: {
          following: {
            select: {
              /* ID of people our persona follows */
              follower_id: true,
            },
          },
        },
      });

      console.log();

      const influencers = actor?.following.map((val) => val.follower_id);

      const posts = await ctx.prisma.tweet.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor,
        where: {
          author_id: {
            in: influencers,
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        cursor: cursor,
        include: {
          author: true,
          quote_parent: {
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
          },
          reply_parent: {
            // select: {
            //   id: true,
            //   content: true,
            //   timestamp: true,
            // },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                  handle: true,
                  bio: true,
                },
              },
            },
          },
        },
      });

      /* we need to implement this */

      let nextCursor: typeof input.cursor | undefined = undefined;

      /**
       * We do this to skip the Item with took in our Take 1
       * @see LINE 20
       */
      if (posts.length > limit) {
        const nextItem = posts.pop();

        /* Assign the ID from this take to our cursor */
        nextCursor = nextItem?.id;
      }
      return {
        tweets: posts,
        nextCursor,
      };
    }),
});
