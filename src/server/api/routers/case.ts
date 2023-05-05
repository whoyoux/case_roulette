import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getSHA256 } from "@/utils/random";

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
  getFeaturedCases: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.case.findMany({
      where: {
        isAvailable: true,
        isFeatured: true
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
    .query(async ({ ctx, input }) => {
      const caseObj = await ctx.prisma.case.findUnique({
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
                  rarity: true,
                  price: true
                },
              },
            },
          },
          price: true,
        },
      });

      caseObj?.items.sort(
        (firstItem, secondItem) => firstItem.dropRate - secondItem.dropRate
      );

      return caseObj;
    }),
  openCase: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
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
                    rarity: true,
                    price: true
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

        const hash = getSHA256();
        console.log(hash);

        const randomInt = Math.floor(Math.random() * 100) + 1;

        let tempRandomed = randomInt;

        const wonItem = caseObj.items.find((item) => {
          tempRandomed -= item.dropRate;
          return tempRandomed <= 0;
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
            randomedNumber: randomInt
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
