import { timelineRouter } from '@/features/timeline/router';
import { exampleRouter } from '@/server/api/routers/example';
import { authorRouter } from '@/server/api/routers/author';
import { createTRPCRouter } from '@/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  author: authorRouter,
  timeline: timelineRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
