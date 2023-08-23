import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const authorRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input, ctx }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.author.findMany();
  }),

  /* Use this form form radios and checkboxes */
  list_form: publicProcedure.query(async ({ ctx }) => {
    const authors = await ctx.prisma.author.findMany({ take: 20 });

    // return a map of author id, author name, author handle as value and the rest as metadata
    return authors.map(({ name, handle, ...rest }) => {
      return {
        name: name,
        value: handle,
        metadata: rest,
      };
    });
  }),
});
