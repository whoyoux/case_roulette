import { prisma } from "@/server/db";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next/types";

import superjson from "superjson";
import { appRouter } from "@/server/api/root";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import Head from "next/head";
import { api } from "@/utils/api";
import { useRef, useState } from "react";

import useSound from "use-sound";
import { formatter } from "@/utils/balanceFormatter";
import toast from "react-hot-toast";
import { ItemRarity, colorsToItemRarity } from "@/constants";
import Image from "next/image";

type ItemInRollType =
  | {
      item: {
        id: string;
        name: string;
        imageURL: string;
        rarity: ItemRarity;
      };
      id: string;
      dropRate: number;
    }
  | undefined;

const Case = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [roll, setRoll] = useState<ItemInRollType[]>([]);
  const [anim, setAnim] = useState<Animation | null>(null);
  const [showRoll, setShowRoll] = useState(false);

  const rollRef = useRef<HTMLDivElement | null>(null);

  const [play, { stop }] = useSound("/opening4s.mp3");

  const caseObj = props.caseObj;

  const utils = api.useContext();

  const openCaseMutation = api.case.openCase.useMutation({
    onSuccess() {
      utils.user.getBalance.invalidate();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const openCase = async () => {
    const res = await openCaseMutation.mutateAsync({ id: caseObj.id });
    stop();
    setShowRoll(true);
    setRoll([...res.roll]);
    play();

    console.log(`You won: ${res.wonItem!.item.name}`);

    if (!rollRef) return;

    if (anim) anim.cancel();

    setAnim(
      rollRef.current!.animate(
        [
          {
            transform: `translateX(-${
              0.9 * 200 * 49 - ((window.innerWidth * (11 / 12)) / 2 - 80)
            }px)`,
          },
        ],
        {
          duration: 4000,
          fill: "forwards",
          easing: "cubic-bezier(0,0,0,1)",
        }
      )
    );
  };

  return (
    <>
      <Head>
        <title>{`${caseObj.name} - Case Roulette`}</title>
      </Head>

      <div className="w-screen">
        <div className="flex flex-col items-center">
          <h2 className="mt-20 text-5xl font-bold">{caseObj.name}</h2>

          {/* CASE ITEMS ROLL */}

          <div className="relative mt-10 flex h-64  w-11/12 items-center overflow-hidden bg-zinc-800">
            <div className="before:absolute before:inset-x-0 before:top-0 before:text-center before:text-2xl before:text-red-500 before:content-['▼'] after:absolute after:inset-x-0 after:bottom-0 after:text-center after:text-2xl after:text-red-500 after:content-['▲']"></div>
            <div ref={rollRef} className="flex">
              {showRoll &&
                roll.map((item, index) => (
                  <div
                    key={`${item?.id}__${index}`}
                    className={`flex h-[200px] w-[200px] flex-col items-center justify-center overflow-hidden ${
                      colorsToItemRarity[item!.item.rarity]
                    }`}
                  >
                    <img
                      src={item?.item.imageURL}
                      alt="Weapon logo"
                      width={150}
                    />
                    <p className="truncate">{item?.item.name}</p>
                  </div>
                ))}
            </div>
          </div>

          <button
            className="btn mt-10"
            onClick={openCase}
            disabled={openCaseMutation.isLoading}
          >
            Open case - {formatter.format(caseObj.price)}
          </button>
        </div>

        {/* ITEMS IN CASE  */}

        <div className="w-11/12 px-10">
          <h2 className="mt-10 text-2xl">Items in this case</h2>
          <div className="mt-5 flex flex-col flex-wrap gap-5 md:flex-row">
            {caseObj.items.map(({ item, dropRate }) => (
              <div
                key={item.id}
                className="relative flex flex-col items-center rounded-2xl bg-zinc-800 p-4"
              >
                <div>{dropRate}%</div>
                <Image
                  src={item.imageURL}
                  alt="Case logo"
                  width={150}
                  height={150}
                  className="w-[150px]"
                />
                <h4 className="text-sm">{item.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const cases = await prisma.case.findMany({
    where: {
      isAvailable: true,
    },
    select: {
      id: true,
    },
  });

  return {
    paths: cases.map((caseObj) => ({
      params: {
        id: caseObj.id,
      },
    })),
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma,
    },
    transformer: superjson,
  });

  const id = context.params?.id as string;

  const caseObj = await ssg.case.getCaseById.fetch({ id });

  if (!caseObj) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      caseObj,
    },
    revalidate: 10,
  };
}

export default Case;
