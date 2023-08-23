import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { ITweetIntent } from '@/types/tweet.type';


export const tweetRouter = createTRPCRouter({
    // Get one tweet by ID
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input, ctx }) => {
        return ctx.prisma.tweet.findUnique({
          where: {
            id: input.id,
          },
        });
      }),
  
    // List all tweets
    list: publicProcedure.query(({ ctx }) => {
      return ctx.prisma.tweet.findMany();
    }),
  
    create: publicProcedure
    .input(z.object({
      content: z.string(),
      authorId: z.number(),
      intent: z.enum([
        ITweetIntent.TWEET, 
        ITweetIntent.BOOKMARK, 
        ITweetIntent.LIKE, 
        ITweetIntent.RETWEET, 
        ITweetIntent.REPLY,
        ITweetIntent.QUOTE
    ]).optional().default(ITweetIntent.TWEET),
      isPinned: z.boolean().optional().default(false),
      isQuoteTweet: z.boolean().optional().default(false),
      isReplyTweet: z.boolean().optional().default(false),
      replyParentId: z.string().optional(),
      quoteParentId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
 

      return await ctx.prisma.tweet.create({
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
    }),
  
  });
  