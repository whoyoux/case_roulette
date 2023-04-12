import { z } from "zod";

import { createTRPCRouter, protectedProcedure, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { MINIMUM_CHARACTERS_TO_SEARCH } from "@/constants";

export const adminRouter = createTRPCRouter({
  itemCreate: adminProcedure
    .input(
      z.object({
        name: z.string(),
        imageURL: z.string(),
        rarity: z.enum(["COMMON", "UNCOMMON", "RARE", "MYTHICAL", "LEGENDARY"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.item.create({
        data: {
          name: input.name,
          imageURL: input.imageURL,
          rarity: input.rarity,
        },
        select: {
          id: true,
        },
      });
    }),
  caseCreate: adminProcedure
    .input(
      z.object({
        name: z.string(),
        imageURL: z.string(),
        price: z.number(),
        items: z.object({
          create: z.array(
            z.object({
              dropRate: z.number(),
              item: z.object({
                connect: z.object({
                  id: z.string(),
                }),
              }),
            })
          ),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const checkIfAllDropRatesItemsIsValid =
        input.items.create.reduce((acc, item) => acc + item.dropRate, 0) ===
        100;

      if (!checkIfAllDropRatesItemsIsValid) {
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Sums of drop rates items must equals 100!",
        });
      }

      return await ctx.prisma.case.create({
        data: input,
      });
    }),
  findItems: adminProcedure
    .input(z.object({
      name: z.string().min(MINIMUM_CHARACTERS_TO_SEARCH)
    }))
    .query(async ({ input, ctx }) => {
      const items = await ctx.prisma.item.findMany({
        where: {
          name: {
            contains: input.name
          }
        },
        select: {
          id: true,
          imageURL: true,
          name: true,
          price: true
        }
      })

      return { items };
    }),
  getCases: adminProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.case.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          imageURL: true,
          isAvailable: true,
          items: {
            select: {
              id: true,
              dropRate: true,
              item: {
                select: {
                  id: true,
                  name: true,
                  imageURL: true,
                  rarity: true
                }
              }
            }
          }
        }
      })
    })
});
