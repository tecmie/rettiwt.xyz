import { z } from 'zod';
import { shuffle } from 'lodash';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const authorRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ handle: z.string() }))
    .query(async ({ input, ctx }) => {
      const singleAuthor = await ctx.prisma.author.findUnique({
        where: {
          handle: input.handle,
        },
      });
      return {
        ...singleAuthor,
        id: String(singleAuthor?.id),
      };
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.author.findMany();
  }),

  /* Use this form form radios and checkboxes */
  list_form: publicProcedure.query(async ({ ctx }) => {
    const authors = await ctx.prisma.author.findMany({ take: 40 });

    // return a map of author id, author name, author handle as value and the rest as metadata
    return authors.map(({ handle, id, ...rest }) => {
      return {
        id: String(id),
        handle: handle,
        /* value is the only duplicate */
        value: handle,
        ...rest,
      };
    });
  }),
  list_form_modal: publicProcedure.query(async ({ ctx }) => {
    const authors = await ctx.prisma.author.findMany({ take: 20 });

    // return a random list of authors every time
    return shuffle(authors)
      .slice(0, 9)
      .map(({ handle, id, ...rest }) => {
        return {
          id: String(id),
          handle: handle,
          /* value is the only duplicate */
          value: handle,
          ...rest,
        };
      });
  }),
});
