import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const createSeed = (length: number) => {
  const availableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += availableChars[Math.floor(Math.random() * availableChars.length)];
  }
  return randomString;
}


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
      orderBy: {
        createdAt: 'desc'
      }
    });


    return inv;
  }),
  getSeed: protectedProcedure.query(async ({ ctx }) => {
    const seed = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      },
      select: {
        seeds: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })

    if (!seed || seed?.seeds.length === 0) {
      const newSeedObject = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id
        },
        data: {
          seeds: {
            create: {
              seed: createSeed(30)
            }
          }
        },
        select: {
          seeds: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        }
      })

      return newSeedObject.seeds[0]?.seed;
    }

    return seed.seeds[0]?.seed;
  }),
  regenerateSeed: protectedProcedure
    .mutation(async ({ ctx }) => {
      const newSeed = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id
        },
        data: {
          seeds: {
            create: {
              seed: createSeed(30)
            }
          }
        },
        select: {
          seeds: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        }
      })

      return newSeed.seeds[0]?.seed
    })
});
