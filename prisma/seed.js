const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const mp7 = await prisma.item.create({
    data: {
      name: "MP7 | Skulls",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_mp7_hy_skulls_light_large.3e38912bdbea8a2b03b149e619f9f141e54facfd.png",
      rarity: "COMMON",
      price: 1
    },
  });
  const aug = await prisma.item.create({
    data: {
      name: "AUG | Wings",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_aug_hy_feathers_aug_light_large.e1419b52a3ddd4bed5328f438ea5dea07b0ba248.png",
      rarity: "COMMON",
      price: 1
    },
  });
  const m4a1 = await prisma.item.create({
    data: {
      name: "M4A1-S | Dark Water",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_m4a1_silencer_am_zebra_dark_light_large.f484368a478f5e02d1b9d5e2816354fe705503f3.png",
      rarity: "UNCOMMON",
      price: 4
    },
  });
  const usp = await prisma.item.create({
    data: {
      name: "USP-S | Dark Water",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_usp_silencer_am_zebra_dark_light_large.add709b2eb683853f9508ddf9c22503d7efb9925.png",
      rarity: "UNCOMMON",
      price: 4
    },
  });
  const eagle = await prisma.item.create({
    data: {
      name: "Desert Eagle | Hypnotic",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_deagle_aa_vertigo_light_large.85a16e4bfb8b1cc6393ca5d0c6d3a1e6e6023323.png",
      rarity: "RARE",
      price: 12
    },
  });
  const ak47 = await prisma.item.create({
    data: {
      name: "AK-47 | Case Hardened",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_aq_oiled_light_large.92c8d125e4e54758d37e946496030e9a18833b58.png",
      rarity: "RARE",
      price: 20
    },
  });
  const awp = await prisma.item.create({
    data: {
      name: "AWP | Lightning Strike",
      imageURL:
        "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_awp_am_lightning_awp_light_large.3761894103ee0fec90af459928635933ba27e36d.png",
      rarity: "MYTHICAL",
      price: 120
    },
  });
  const knife = await prisma.item.create({
    data: {
      name: "Knife",
      imageURL:
        "https://csgostash.com/img/misc/rare_item.png?id=3a8208a7138f9be71c5cfe2c47b80874",
      rarity: "LEGENDARY",
      price: 500
    },
  });
  await prisma.case.create({
    data: {
      name: "CS:GO Weapon Case",
      price: 15,
      imageURL:
        "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsRVx4MwFo5_T3eAQ3i6DMIW0X7ojiwoHax6egMOKGxj4G68Nz3-jCp4itjFWx-ktqfSmtcwqVx6sT/256fx256f",
      items: {
        create: [
          {
            dropRate: 1,
            item: {
              connect: {
                id: knife.id,
              },
            },
          },
          ,
          {
            dropRate: 6,
            item: {
              connect: {
                id: ak47.id,
              },
            },
          },
          ,
          {
            dropRate: 6,
            item: {
              connect: {
                id: eagle.id,
              },
            },
          },
          ,
          {
            dropRate: 10,
            item: {
              connect: {
                id: usp.id,
              },
            },
          },
          ,
          {
            dropRate: 10,
            item: {
              connect: {
                id: m4a1.id,
              },
            },
          },
          ,
          {
            dropRate: 3,
            item: {
              connect: {
                id: awp.id,
              },
            },
          },
          ,
          {
            dropRate: 32,
            item: {
              connect: {
                id: mp7.id,
              },
            },
          },
          ,
          {
            dropRate: 32,
            item: {
              connect: {
                id: aug.id,
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
