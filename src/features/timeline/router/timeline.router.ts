import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { type ITimelineTweet } from '@/types/timeline.type';

const queryTimelineSchema = z.object({
  id: z.string(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export const timelineRouter = createTRPCRouter({
  list: publicProcedure
    .input(queryTimelineSchema)
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const limit = input.limit ?? 25;

      const posts: ITimelineTweet[] = await ctx.prisma.tweet.findMany({
        take: limit,
        orderBy: {
          timestamp: 'desc',
        },
        include: {
          author: true,
          quote_parent: true,
          reply_parent: true,
        },
      });

      /* we need to implement this */
      const nextCursor = null;
      return {
        id,
        tweets: posts,
        nextCursor,
      };
    }),
});
