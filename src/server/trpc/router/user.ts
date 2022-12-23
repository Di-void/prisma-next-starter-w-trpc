import { router, publicProcedure } from "../trpc";
import { z } from "zod";

const emailSchema = z.string().regex(/[^@]+@[^@]+\.[^@]+/);

export const userRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: emailSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newUser = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
        },
      });

      return newUser;
    }),
});
