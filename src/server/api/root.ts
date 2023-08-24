import { timelineRouter } from '@/features/timeline/router';
import { authorRouter } from '@/server/api/routers/author';
import { createTRPCRouter } from '@/server/api/trpc';
import { tweetRouter } from './routers/tweet';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  author: authorRouter,
  tweet: tweetRouter,
  timeline: timelineRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
