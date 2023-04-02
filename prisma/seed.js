const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const classic = await prisma.item.create({
    data: {
      name: "Glock-18 Fade",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_glock_aa_fade_light_large.61edcc69ff252d537a4dd14b016cbe826c26ae5b.png",
    },
  });

  const vandal = await prisma.item.create({
    data: {
      name: "AK-47 Fire Serpent",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_fireserpent_ak47_bravo_light_large.9390e7fd091ea8a0434fd2143e0acf0d5d1bbc97.png",
    },
  });

  const karambit = await prisma.item.create({
    data: {
      name: "Karambit Gamma Doppler",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_karambit_am_gamma_doppler_phase1_light_large.769cf2ab676ea2a7d7322c258f57bac8dca00336.png",
    },
  });

  await prisma.case.create({
    data: {
      name: "Bravo Case",
      price: 10,
      imageURL:
        "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsXE1xNwVDv7WrFA5pnabNJGwSuN3gxtnawKOlMO6HzzhQucAm0uvFo4n2iw3h_UM-ZmilJNeLMlhpjfjxEoE/256fx256f",
      items: {
        create: [
          {
            dropRate: 70,
            item: {
              connect: {
                id: classic.id,
              },
            },
          },
          {
            dropRate: 29,
            item: {
              connect: {
                id: vandal.id,
              },
            },
          },
          {
            dropRate: 1,
            item: {
              connect: {
                id: karambit.id,
              },
            },
          },
        ],
      },
    },
  });

  await prisma.case.create({
    data: {
      name: "Knife or shit",
      price: 10,
      imageURL:
        "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsRVx4MwFo5_T3eAQ3i6DMIW0X7ojiwoHax6egMOKGxj4G68Nz3-jCp4itjFWx-ktqfSmtcwqVx6sT/256fx256f",
      items: {
        create: [
          {
            dropRate: 95,
            item: {
              connect: {
                id: classic.id,
              },
            },
          },
          {
            dropRate: 5,
            item: {
              connect: {
                id: karambit.id,
              },
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
