import { router } from "../trpc";
import { postRouter } from "./post";
import { userRouter } from "./user";

export const appRouter = router({
  post: postRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
