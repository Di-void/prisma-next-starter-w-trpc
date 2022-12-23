import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  createPost: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string().optional(),
        authorEmail: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { title, content, authorEmail } = input;
      // create new post
      try {
        const newPost = await ctx.prisma.post.create({
          data: {
            title,
            content,
            author: { connect: { email: authorEmail } },
          },
        });

        return newPost;
      } catch (error) {
        console.error(error);
      }
    }),
  getPosts: publicProcedure.query(async ({ ctx }) => {
    const feed = await ctx.prisma.post.findMany({
      where: { published: true },
      include: { author: true },
    });

    return feed;
  }),
  getDrafts: publicProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.prisma.post.findMany({
      where: { published: false },
      include: { author: true },
    });

    return drafts;
  }),
  getSinglePost: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const singlePost = await ctx.prisma.post.findUnique({
        where: { id: Number(input.id) },
        include: { author: true },
      });

      return singlePost;
    }),
  deletePost: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.delete({
          where: {
            id: Number(input.id),
          },
        });

        return post;
      } catch (error) {
        console.error(error);
      }
    }),
  publishPost: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.update({
        where: { id: input.id },
        data: { published: true },
      });

      return post;
    }),
});
