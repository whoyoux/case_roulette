import { bgGradient } from "@/constants";
import { api } from "@/utils/api";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { formatter } from "@/utils/balanceFormatter";
import { Listbox, Transition } from '@headlessui/react'
import { ArrowUpDown, Check } from "lucide-react";

type SortingMethodType = {
  id: string
  value: string
}

const sortingMethods: SortingMethodType[] = [
  { id: 'sort-by-newest', value: 'newest' },
  { id: 'sort-by-oldest', value: 'oldest' },
  { id: 'sort-by-most-pricey', value: 'most pricey' },
  { id: 'sort-by-less-pricey', value: 'less pricey' },
]

const UserPage: NextPage = () => {
  const { data: session } = useSession();
  const [selectedSortingMethod, setSelectedSortingMethod] = useState<SortingMethodType>(sortingMethods[0] as SortingMethodType);

  if (!session) {
    <h1>You have to sign in to see this page!</h1>;
  }

  const { data: items } = api.user.getInventory.useQuery({} as any, { refetchOnWindowFocus: false });
  const { data: seed, refetch } = api.user.getSeed.useQuery({} as any, { refetchOnWindowFocus: false });

  const { mutateAsync: regenerateSeed, isLoading } = api.user.regenerateSeed.useMutation();

  const getNewSeed = async () => {
    await regenerateSeed();
    await refetch();
  }

  const [totalValue, setTotalValue] = useState<number>();

  useEffect(() => {
    setTotalValue(items?.reduce((acc, item) => acc + item.wonItem.price, 0))
  }, [items])

  useEffect(() => {
    switch (selectedSortingMethod.id) {
      case 'sort-by-newest':
        console.log('SORTING BY NEWEST')
        items?.sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf())
        break;
      case 'sort-by-oldest':
        console.log('SORTING BY OLDEST')
        items?.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
        break;
      case 'sort-by-most-pricey':
        console.log('SORTING BY MOST PRICEY')
        items?.sort((a, b) => a.wonItem.price - b.wonItem.price)
        break;
      case 'sort-by-less-pricey':
        console.log('SORTING BY LESS PRICEY')
        items?.sort((a, b) => b.wonItem.price - a.wonItem.price)
        break;
      default:
        console.log('Whot');
        break;
    }
  }, [selectedSortingMethod])

  return (
    <>
      <Head>
        <title>My profile - Case Roulette</title>
      </Head>
      <div>

        <div className="w-full flex flex-col items-center pt-10 gap-5 ">
          <div className="flex flex-col items-center">
            <Image
              src={session?.user.image ?? "https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg"}
              alt="user profile"

              width={200}
              height={200}

              className="rounded-full w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"
            />
          </div>
          <h2 className="text-3xl font-medium">{session?.user.name}</h2>
        </div>

        <div className="flex flex-col py-5 gap-4 max-w-lg mx-auto md:mt-10">
          <div className="flex flex-col md:text-xl gap-2">
            <h3>My seed:</h3>
            <b>{seed ? seed.toString() : 'Not found'}</b>
          </div>
          <button className="btn btn-sm" onClick={getNewSeed} disabled={isLoading}>Create new seed</button>
        </div>

        <div className="text-2xl py-5">
          Total inv value: <b>{formatter.format(totalValue ? totalValue : 0)}</b>
        </div>


        <div className="w-full pb-5 pt-2 flex items-center text-xl justify-between">
          <span>Sort by</span>
          <div className="relative">
            <Listbox value={selectedSortingMethod} onChange={setSelectedSortingMethod}>
              <Listbox.Button className="flex items-center gap-3">{selectedSortingMethod.value} <ArrowUpDown /></Listbox.Button>
              <Transition
                as={React.Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Listbox.Options className="absolute mt-1 w-48 right-0 origin-top-right overflow-auto rounded-md bg-zinc-800 py-1 text-base">
                  {sortingMethods.map(sortingMethod => (
                    <Listbox.Option
                      key={sortingMethod.id}
                      value={sortingMethod}
                      as={React.Fragment}
                    >
                      <li className="ui-active:bg-red-500 text-white flex justify-center items-center gap-2 cursor-pointer w-full text-md py-1">
                        <Check className="hidden ui-selected:block" size={18} />
                        {sortingMethod.value}
                      </li>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">

          {items &&
            items.length > 0 &&
            items
              .map((item) => (
                <div
                  className={`flex py-10 px-5 flex-col items-center justify-center ${bgGradient[item.wonItem.rarity]
                    } rounded`}
                  key={item.id}
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
                  <button className="btn btn-xs w-full mt-5">SELL FOR {formatter.format(item.wonItem.price)}</button>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default UserPage;
