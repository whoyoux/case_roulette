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
  const { data: seed, refetch } = api.user.getSeed.useQuery();

  const { mutateAsync: regenerateSeed, isLoading } = api.user.regenerateSeed.useMutation();

  const getNewSeed = async () => {
    await regenerateSeed();
    await refetch();
  }

  return (
    <>
      <Head>
        <title>My profile - Case Roulette</title>
      </Head>
      <div className="px-0 md:px-20">

        <div className="w-full flex flex-col md:flex-row items-center pt-10 gap-5 ">
          <div className="flex flex-col items-center">
            <Image
              src={session?.user.image || ''}
              alt="user profile"

              width={200}
              height={200}

              className="rounded-full w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"
            />
            <h2 className="hidden md:block text-3xl font-medium">{session?.user.name}</h2>
          </div>
          <h2 className="text-3xl font-medium md:hidden">{session?.user.name}</h2>
          <button className="btn btn-sm sm:btn">Deposit</button>

        </div>

        <div className="flex flex-col p-5 gap-4 max-w-lg mx-auto md:mt-10 md:mx-0">
          <div className="flex flex-col md:flex-row md:justify-between md:text-xl gap-2">
            <h3>My seed:</h3>
            <b>{seed ? seed.toString() : 'Not found'}</b>
          </div>
          <button className="btn btn-sm" onClick={getNewSeed} disabled={isLoading}>Create new seed</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {/* <div className="flex flex-row flex-wrap gap-3 justify-center"> */}
          {items &&
            items.length > 0 &&
            items.map((item) => (
              <div
                className={`flex py-10 px-5 flex-col items-center justify-center ${colorsToItemRarity[item.wonItem.rarity]
                  } bg-opacity-75`}
              >
                <Image
                  src={item.wonItem.imageURL}
                  alt="item image"
                  width={200}
                  height={200}
                  placeholder="blur"
                  blurDataURL={item.wonItem.imageURL}
                />
                <p className="truncate font-medium text-xs">{item.wonItem.name}</p>
                <button className="btn btn-xs w-full mt-5">SELL</button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default UserPage;
