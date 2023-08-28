import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { ITweetIntent } from '@/types/tweet.type';
import queue, { QueueTask } from '@/utils/queue';

/**
 * Export listeners
 *
 * We try to keep the listeners as close as possible to the location
 * of the event that they are listening to.
 *
 * @example
 * export * as eml from '@/server/listeners/tweet-listener';
 * import '@/server/listeners/tweet-listener';
 */
export * as ximl from '@/server/listeners/default';

/**
 * This is the router for tweets.
 *
 * It contains all the routes for tweets.
 */
export const tweetRouter = createTRPCRouter({
  // Get one tweet by ID
  get_with_paginated_joins: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.tweet.findUnique({
        where: {
          id: input.id,
        },
        include: {
          replies: {
            include: {
              author: true,
              replies: {
                /* This is as deep as we can go */
                include: {
                  author: true,
                },
              },
            },
          },
          liked_by: {
            include: {
              author: true,
            },
          },
          retweeted_by: {
            include: {
              author: true,
            },
          },
        },
      });
    }),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.tweet.findUnique({
        where: {
          id: input.id,
        },
        include: {
          replies: true,
          liked_by: true,
          retweeted_by: true,
        },
      });
    }),

  // List all tweets
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        content: z.string(),
        authorId: z.string(),
        intent: z
          .enum([ITweetIntent.TWEET, ITweetIntent.REPLY, ITweetIntent.QUOTE])
          .optional()
          .default(ITweetIntent.TWEET),
        isPinned: z.boolean().optional().default(false),
        isQuoteTweet: z.boolean().optional().default(false),
        isReplyTweet: z.boolean().optional().default(false),
        replyParentId: z.string().optional(),
        quoteParentId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.tweet.create({
        data: {
          content: input.content,
          author_id: input.authorId,
          intent: input.intent,
          is_pinned: input.isPinned,

          /* Graph of Tweets values */
          is_reply_tweet: input.isReplyTweet,
          is_quote_tweet: input.isQuoteTweet,
          reply_parent_id: input.replyParentId,
          quote_parent_id: input.quoteParentId,

          /**
           * Count values
           * Our schema also defaults to zero for these
           */
          quote_count: 0,
          reply_count: 0,
          repost_count: 0,
          favorite_count: 0,
          bookmark_count: 0,
        },
      });

      queue.send({
        event: QueueTask.EmbedOpinion,
        args: [ITweetIntent.TWEET, JSON.stringify(post)],
      });

      return post;
    }),
});
