import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getBalance: protectedProcedure.query(async ({ ctx }) => {
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
  getInventory: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.openedCase.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        wonItem: true,
      },
    });
  }),
});
