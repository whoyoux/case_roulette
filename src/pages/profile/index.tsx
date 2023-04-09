import { colorsToItemRarity } from "@/constants";
import { api } from "@/utils/api";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";
import Head from "next/head";

const UserPage: NextPage = () => {
  const { data: session } = useSession();

  if (!session) {
    <h1>You have to sign in to see this page!</h1>;
  }

  const { data: items } = api.user.getInventory.useQuery();

  return (
    <>
      <Head>
        <title>My profile - Case Roulette</title>
      </Head>
      <div>
        <div>
          <h3>Your latest drops</h3>
          <div className="flex flex-row flex-wrap gap-3">
            {items &&
              items.length > 0 &&
              items.map((item) => (
                <div
                  className={`flex h-[175px] w-[175px] flex-col items-center justify-center ${colorsToItemRarity[item.wonItem.rarity]
                    } bg-opacity-75`}
                >
                  <Image
                    src={item.wonItem.imageURL}
                    alt="item image"
                    width={150}
                    height={150}
                  />
                  <p className="truncate font-medium">{item.wonItem.name}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
