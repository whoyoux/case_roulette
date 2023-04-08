import { ItemRarity } from "@/constants";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import React, { FormEvent, useState } from "react";

type ItemType = {
  name: string;
  percents: number;
};

const CaseCreate: NextPage = () => {
  const [seed, setSeed] = useState<string>("");

  const [itemLabel, setItemLabel] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [itemRarity, setItemRarity] = useState<ItemRarity>("COMMON");
  const [itemImageURL, setItemImageURL] = useState<string>("");

  const [caseName, setCaseName] = useState<string>("");
  const [casePrice, setCasePrice] = useState<string>("");
  const [caseImageURL, setCaseImageURL] = useState<string>("");

  const [tempItemName, setTempItemName] = useState<string>("");
  const [tempItemPercents, setTempItemPercents] = useState<string>("");

  const [tempItems, setTempItems] = useState<ItemType[]>([]);

  const addItemToTempList = () => {
    try {
      if (tempItems.find((item) => item.name === tempItemName)) {
        throw new Error("You cannot add multiple time same item!");
      }

      if (tempItemPercents.length === 0 || tempItemName.length === 0) {
        throw new Error("Item fields cannot be empty!");
      }
      const tempPercents: number = Number.parseInt(tempItemPercents);

      if (!tempPercents) {
        throw new Error("Item percents must be a number!");
      }

      if (tempPercents <= 0) {
        throw new Error("Item percents cannot be a negative number or 0!");
      }

      setTempItems([
        ...tempItems,
        { name: tempItemName, percents: tempPercents },
      ]);

      setTempItemName("");
      setTempItemPercents("");
    } catch (err) {
      alert(err);
    }
  };

  const removeItemFromList = (name: string) => {
    setTempItems([...tempItems.filter((item) => item.name !== name)]);
  };

  const addCaseToSeed = (e: FormEvent) => {
    e.preventDefault();
    try {
      if (
        caseName.length === 0 ||
        caseImageURL.length === 0 ||
        casePrice.length === 0
      ) {
        throw new Error("Case fields cannot be empty!");
      }

      const tempPrice: number = Number.parseInt(casePrice);

      if (!tempPrice) {
        throw new Error("Case price must be a number!");
      }

      const totalPercents = tempItems.reduce((acc, curr) => {
        return acc + curr.percents;
      }, 0);

      if (totalPercents !== 100) {
        const difference = Math.abs(100 - totalPercents);
        throw new Error(
          `Combined percents must be equal to 100! Difference: ${difference}`
        );
      }

      const tempText = `
      await prisma.case.create({
        data: {
          name: "${caseName}",
          price: ${tempPrice},
          imageURL:
            "${caseImageURL}",
          items: {
            create: [
              ${tempItems.map((item) => {
                return `{
                  dropRate: ${item.percents},
                  item: {
                    connect: {
                      id: ${item.name}.id,
                    },
                  },
                },`;
              })}
            ],
          },
        },
      });`;

      setSeed(seed + tempText);

      alert("Create case!");
    } catch (err) {
      alert(err);
    }
  };

  const addItemToSeed = (e: FormEvent) => {
    e.preventDefault();

    try {
      if (
        itemLabel.length === 0 ||
        itemName.length === 0 ||
        itemImageURL.length === 0
      ) {
        throw new Error("Item fields cannot be empty!");
      }

      const tempText = `
      const ${itemName} = await prisma.item.create({
        data: {
          name: "${itemLabel}",
          imageURL: "${itemImageURL}",
          rarity: "${itemRarity}",
        },
      });`;
      setSeed(seed + tempText);

      setItemLabel("");
      setItemName("");
      setItemImageURL("");
    } catch (err) {
      alert(err);
    }
  };

  const onChangeRarity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemRarity(e.target.value as ItemRarity);
  };

  return (
    <main className="flex w-full flex-col items-center justify-center gap-10 pt-24">
      <h1 className="text-4xl">Create seed to DB</h1>
      <div className="flex w-full flex-row justify-center gap-10">
        <form className=" flex max-w-md flex-col gap-3 text-center">
          <h1 className="text-2xl">Item Create</h1>
          <input
            type="text"
            placeholder="Name"
            className="form-input"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Label"
            className="form-input"
            value={itemLabel}
            onChange={(e) => setItemLabel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="form-input"
            value={itemImageURL}
            onChange={(e) => setItemImageURL(e.target.value)}
          />
          <select onChange={(e) => onChangeRarity(e)} className="form-input ">
            <option>COMMON</option>
            <option>UNCOMMON</option>
            <option>RARE</option>
            <option>MYTHICAL</option>
            <option>LEGENDARY</option>
          </select>
          <button
            type="submit"
            className="form-btn"
            onClick={(e) => addItemToSeed(e)}
          >
            Create item
          </button>
        </form>

        <form className="flex max-w-md flex-col gap-3  text-center">
          <h1 className="text-2xl">Case Create</h1>
          <input
            type="text"
            placeholder="Name"
            className="form-input"
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price"
            className="form-input"
            value={casePrice}
            onChange={(e) => setCasePrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="form-input"
            value={caseImageURL}
            onChange={(e) => setCaseImageURL(e.target.value)}
          />

          <div className="my-5 flex flex-col gap-3">
            <input
              type="text"
              placeholder="Item Name"
              className="form-input"
              value={tempItemName}
              onChange={(e) => setTempItemName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Item win %"
              className="form-input"
              value={tempItemPercents}
              onChange={(e) => setTempItemPercents(e.target.value)}
            />
            <button
              className="form-btn"
              type="button"
              onClick={addItemToTempList}
            >
              Add item
            </button>

            {tempItems.length > 0 && (
              <div>
                <h4>Current items:</h4>
                <div className="flex flex-col">
                  {tempItems.map((item) => (
                    <div key={item.name}>
                      <div>ID: {item.name}</div>
                      <div>Percents: {item.percents}</div>
                      <button
                        onClick={() => removeItemFromList(item.name)}
                        className="w-full rounded-md bg-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="form-btn"
            onClick={(e) => addCaseToSeed(e)}
          >
            Create case
          </button>
        </form>
      </div>
      <div className="w-full max-w-2xl text-center">
        <h2 className="py-2 text-2xl">Your seed:</h2>
        <textarea
          rows={100}
          className="w-full bg-zinc-800 outline-none"
          readOnly
          value={seed}
        />
      </div>
    </main>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  console.log("Checking if user is an admin.");

  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  console.log(session);

  if (!session) {
    return {
      notFound: true,
    };
  }

  const isAdminRes = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      isAdmin: true,
    },
  });

  if (!isAdminRes || !isAdminRes.isAdmin) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};

export default CaseCreate;
