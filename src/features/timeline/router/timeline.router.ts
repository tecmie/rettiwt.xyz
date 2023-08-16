import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { ITimelineTweet } from '@/types/timeline.type';
import { timelineTweets } from './data';

const queryTimelineSchema = z.object({
  id: z.string(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export const timelineRouter = createTRPCRouter({
  list: publicProcedure.input(queryTimelineSchema).query(({ input }) => {
    const { id } = input;
    // replace with actual implementation to fetch tweets from database
    const tweets: ITimelineTweet[] = timelineTweets;

    //   This is for pagination, but we are not using it
    const { cursor } = input;
    const limit = input.limit ?? 50;
    const startIndex = cursor
      ? tweets.findIndex((tweet) => tweet.id === cursor) + 1
      : 0;

    // const items = await ctx.prisma.tweets.findMany({
    //   take: limit + 1, // get an extra item at the end which we'll use as next cursor
    //   where: {
    //     title: {
    //       contains: 'Prisma' /* Optional filter */,
    //     },
    //   },
    //   cursor: cursor ? { myCursor: cursor } : undefined,
    //   orderBy: {
    //     myCursor: 'asc',
    //   },
    // });
    // let nextCursor: typeof cursor | undefined = undefined;
    // if (items.length > limit) {
    //   const nextItem = items.pop();
    //   nextCursor = nextItem!.myCursor;
    // }
    // return {
    //   items,
    //   nextCursor,
    // };

    /* we need to implement this */
    const nextCursor = null;
    return {
      id,
      tweets: tweets,
      nextCursor,
    };
  }),
});
