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

const queryTweetReplies = z.object({
  limit: z.number().min(1).max(50).nullish(),
  tweetId: z.string(),
  cursor: z.string().nullish(),
});

/**
 * This is the router for tweets.
 *
 * It contains all the routes for tweets.
 */
export const tweetRouter = createTRPCRouter({
  list_with_replies: publicProcedure
    .input(queryTweetReplies)
    .query(async ({ input, ctx }) => {
      const cursor = input.cursor ? { id: input.cursor } : undefined;
      const limit = input.limit ?? 10;

      const result = await ctx.prisma.tweet.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor,
        where: {
          reply_parent_id: input.tweetId,
        },
        orderBy: {
          reply_parent_id: 'desc',
        },
        cursor: cursor,
        include: {
          author: {
            select: {
              id: true,
              avatar: true,
              name: true,
              handle: true,
            },
          },
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

      let nextCursor: typeof input.cursor | undefined = undefined;

      /**
       * We do this to skip the Item with took in our Take 1
       * @see LINE 20
       */
      if (result.length > limit) {
        const nextItem = result.pop();

        /* Assign the ID from this take to our cursor */
        nextCursor = nextItem?.id;
      }
      return {
        tweets: result,
        nextCursor,
      };
    }),
  // Get one tweet by ID
  list_with_join: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const tweet = await ctx.prisma.tweet.findMany({
        where: {
          id: input.id,
        },
        include: {
          replies: {
            include: {
              author: true,
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

      let nextCursor;

      return {
        tweets: tweet,
        nextCursor,
      };
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.tweet.findUnique({
        where: {
          id: input.id,
        },
        include: {
          liked_by: {
            select: {
              author_id: true,
            },
          },
          replies: true,
          retweeted_by: {
            select: {
              author_id: true,
            },
          },
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
