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
    const inv = await ctx.prisma.openedCase.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        wonItem: {
          select: {
            name: true,
            imageURL: true,
            rarity: true,
          },
        },
        createdAt: true,
      },
    });

    inv.sort(
      (firstItem, secondItem) =>
        new Date(secondItem.createdAt).valueOf() -
        new Date(firstItem.createdAt).valueOf()
    );

    return inv;
  }),
});
