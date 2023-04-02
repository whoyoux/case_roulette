import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const caseRouter = createTRPCRouter({
  getAvailableCasesName: publicProcedure.query(({ ctx }) => {
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
  getAvailableCaseWithItems: publicProcedure.query(({ ctx }) => {
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
            dropRate: true,
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
              dropRate: true,
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

      const { roll, wonItem } = await ctx.prisma.$transaction(async (tx) => {
        const caseObj = await tx.case.findFirst({
          where: {
            isAvailable: true,
            id: input.id,
          },
          select: {
            id: true,
            price: true,
            items: {
              select: {
                id: true,
                dropRate: true,
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
          (acc, item) => acc + item.dropRate,
          0
        );

        if (totalChance > 100) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Drop rates included items in this case are more than 100!",
          });
        }

        const opener = await tx.user.update({
          data: {
            balance: {
              decrement: caseObj.price,
            },
          },
          where: {
            id: ctx.session?.user.id,
          },
        });

        if (opener.balance < 0) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You don't have enough money to open this case!",
          });
        }

        const roll = [];
        let randomInt = Math.random() * 100;
        //TODO: Add to DB random int

        const wonItem = caseObj.items.find((item) => {
          randomInt -= item.dropRate;
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

        await ctx.prisma.openedCase.create({
          data: {
            user: {
              connect: {
                id: ctx.session?.user.id,
              },
            },
            wonItem: {
              connect: {
                id: wonItem!.item.id,
              },
            },
          },
        });

        return {
          roll,
          wonItem,
        };
      });
      return {
        roll,
        wonItem,
      };
    }),
});
