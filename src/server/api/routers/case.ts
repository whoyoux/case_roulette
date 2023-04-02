import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const caseRouter = createTRPCRouter({
  getAvailableCasesNames: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.case.findMany({
      where: {
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        imageURL: true,
        price: true,
      },
    });
  }),
  getAvailableWithItems: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.case.findMany({
      where: {
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        imageURL: true,
        price: true,
        items: {
          select: {
            item: {
              select: {
                id: true,
                name: true,
                imageURL: true,
              },
            },
          },
        },
      },
    });
  }),
  getCaseById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.case.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          imageURL: true,
          items: {
            select: {
              item: {
                select: {
                  id: true,
                  name: true,
                  imageURL: true,
                },
              },
            },
          },
          price: true,
        },
      });
    }),
  openCase: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Wrap this in $transaction
      const caseObj = await ctx.prisma.case.findFirst({
        where: {
          isAvailable: true,
          id: input.id,
        },
        select: {
          id: true,
          items: {
            select: {
              id: true,
              dropChange: true,
              item: {
                select: {
                  id: true,
                  name: true,
                  imageURL: true,
                },
              },
            },
          },
        },
      });

      if (!caseObj) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No such case available with this id.",
        });
      }

      const totalChance = caseObj.items.reduce(
        (acc, item) => acc + item.dropChange,
        0
      );

      if (totalChance > 100) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Drop rates included items in this case are more than 100!",
        });
      }

      const roll = [];
      let randomInt = Math.random() * 100;
      //TODO: Add to DB random int

      const wonItem = caseObj.items.find((item) => {
        randomInt -= item.dropChange;
        return randomInt <= 0;
      });

      const totalLengthOfItems = caseObj.items.length;

      for (let i = 0; i < 50; i++) {
        if (i === 44) {
          roll.push(wonItem);
        } else {
          const random = Math.floor(Math.random() * totalLengthOfItems);
          roll.push(caseObj.items[random]);
        }
      }

      return {
        roll,
        wonItem,
      };
    }),
});
