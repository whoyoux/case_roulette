import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getBalance: protectedProcedure.query(async ({ input, ctx }) => {
    const balance = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        balance: true,
      },
    });

    return balance;
  }),
});
