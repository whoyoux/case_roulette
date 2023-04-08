import { ItemRarity } from "@/constants";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useState } from "react";
import toast from "react-hot-toast";

type ItemType = {
  id: string;
  percents: number;
};

const CreateCase: NextPage = () => {
  const [itemName, setItemName] = useState<string>("");
  const [itemRarity, setItemRarity] = useState<ItemRarity>("COMMON");
  const [itemImageURL, setItemImageURL] = useState<string>("");

  const [newItemID, setNewItemID] = useState<string>("");

  const [caseName, setCaseName] = useState<string>("");
  const [casePrice, setCasePrice] = useState<string>("");
  const [caseImageURL, setCaseImageURL] = useState<string>("");

  const [tempItemId, setTempItemId] = useState<string>("");
  const [tempItemPercents, setTempItemPercents] = useState<string>("");

  const [tempItems, setTempItems] = useState<ItemType[]>([]);

  const createItemMutation = api.admin.itemCreate.useMutation();
  const createCaseMutation = api.admin.caseCreate.useMutation();

  const addItemToTempList = () => {
    try {
      if (tempItems.find((item) => item.id === tempItemId)) {
        throw new Error("You cannot add multiple time same item!");
      }

      if (tempItemPercents.length === 0 || tempItemId.length === 0) {
        throw new Error("Item fields cannot be empty!");
      }
      const tempPercents: number = Number.parseInt(tempItemPercents);

      if (!tempPercents) {
        throw new Error("Item percents must be a number!");
      }

      if (tempPercents <= 0) {
        throw new Error("Item percents cannot be a negative number or 0!");
      }

      setTempItems([...tempItems, { id: tempItemId, percents: tempPercents }]);

      setTempItemId("");
      setTempItemPercents("");
    } catch (err) {
      alert(err);
    }
  };

  const removeItemFromList = (name: string) => {
    setTempItems([...tempItems.filter((item) => item.id !== name)]);
  };

  const createCase = async (e: React.FormEvent) => {
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

      // CREATE CASE

      const newCase = await createCaseMutation.mutateAsync({
        name: caseName,
        imageURL: caseImageURL,
        price: tempPrice,
        items: {
          create: tempItems.map((tempItem) => {
            return {
              dropRate: tempItem.percents,
              item: {
                connect: {
                  id: tempItem.id,
                },
              },
            };
          }),
        },
      });

      console.log(newCase);

      toast.success("Created a case!");
    } catch (err) {
      alert(err);
    }
  };

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setNewItemID("");

      if (itemName.length === 0 || itemImageURL.length === 0) {
        throw new Error("Item fields cannot be empty!");
      }

      const newItem = await createItemMutation.mutateAsync({
        name: itemName,
        imageURL: itemImageURL,
        rarity: itemRarity,
      });

      setNewItemID(newItem.id);

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
            onClick={(e) => createItem(e)}
          >
            Create item
          </button>
          {newItemID && <h2>New Item ID: {newItemID}</h2>}
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
              placeholder="Item ID"
              className="form-input"
              value={tempItemId}
              onChange={(e) => setTempItemId(e.target.value)}
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
                    <div key={item.id}>
                      <div>ID: {item.id}</div>
                      <div>Percents: {item.percents}</div>
                      <button
                        onClick={() => removeItemFromList(item.id)}
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
            onClick={(e) => createCase(e)}
          >
            Create case
          </button>
        </form>
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

export default CreateCase;
