import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
  itemCreate: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        imageURL: z.string(),
        rarity: z.enum(["COMMON", "UNCOMMON", "RARE", "MYTHICAL", "LEGENDARY"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const isAdminRes = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          isAdmin: true,
        },
      });

      if (!isAdminRes || !isAdminRes.isAdmin) {
        new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admin can do this operation!",
        });
      }

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
  caseCreate: protectedProcedure
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
      const isAdminRes = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          isAdmin: true,
        },
      });

      if (!isAdminRes || !isAdminRes.isAdmin) {
        new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admin can do this operation!",
        });
      }

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
  findItems: protectedProcedure
    .input(z.object({
      name: z.string().min(3)
    }))
    .query(async ({ input, ctx }) => {
      const isAdminRes = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          isAdmin: true,
        },
      });

      if (!isAdminRes || !isAdminRes.isAdmin) {
        new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admin can do this operation!",
        });
      }

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
        }
      })

      return { items };
    })
});
