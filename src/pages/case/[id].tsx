import { prisma } from "@/server/db";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next/types";

import { appRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import superjson from "superjson";

import OpenCaseModal from "@/components/Modal/OpenCaseModal";
import customToast from "@/components/Notification";
import { ItemRarity, bgGradient, colorsToItemRarity } from "@/constants";
import { formatter } from "@/utils/balanceFormatter";
import Image from "next/image";
import useSound from "use-sound";

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
  const [latestWonItem, setLatestWonItem] = useState({
    name: "",
    imageURL: "",
  });

  const [isOpenModal, setModal] = useState<boolean>(false);

  const rollRef = useRef<HTMLDivElement | null>(null);
  const rollContainerRef = useRef<HTMLDivElement | null>(null);

  const [play, { stop }] = useSound("/opening4s.mp3");

  const caseObj = props.caseObj;

  const utils = api.useContext();

  const openCaseMutation = api.case.openCase.useMutation({
    onSuccess() {
      utils.user.getBalance.invalidate();
    },
    onError(err) {
      //toast.error(err.message);
      customToast({ message: err.message })
    },
  });

  const openCase = async () => {
    const res = await openCaseMutation.mutateAsync({ id: caseObj.id });
    stop();
    setShowRoll(true);
    setRoll([...res.roll]);
    play();

    console.log(`You won: ${res.wonItem!.item.name}`);

    setLatestWonItem({
      name: res.wonItem!.item.name,
      imageURL: res.wonItem!.item.imageURL,
    });



    if (!rollRef) return;

    if (anim) anim.cancel();

    const newAnim = rollRef.current!.animate(
      [
        {
          transform: `translateX(-${(44 * 208 - (rollContainerRef.current!.offsetWidth / 2)) + 104}px)`
        }
      ],
      {
        duration: 4000,
        fill: "forwards",
        easing: "cubic-bezier(0,0,0,1)",
      }

    )

    setAnim(newAnim);
  };

  useEffect(() => {
    if (anim && latestWonItem)
      anim.onfinish = () => {
        setModal(true);
      }
    return () => {
      if (anim) anim.onfinish = () => { };
    };
  }, [anim]);

  return (
    <>
      <Head>
        <title>{`${caseObj.name} - Case Roulette`}</title>
      </Head>

      <OpenCaseModal itemName={latestWonItem.name} imageURL={latestWonItem.imageURL} isOpen={isOpenModal} closeModal={() => setModal(false)} title="New drop 😯😯😯" />

      <div className="w-full">
        <div className="flex flex-col items-center">
          <h2 className="mt-20 text-5xl font-bold">{caseObj.name}</h2>

          {/* CASE ITEMS ROLL */}
          <div className="relative mt-10 flex h-64 w-full items-center overflow-hidden bg-zinc-800" ref={rollContainerRef}>
            <div className="before:absolute before:inset-x-0 before:top-0 before:text-center before:text-2xl before:text-red-500 before:content-['▼'] after:absolute after:inset-x-0 after:bottom-0 after:text-center after:text-2xl after:text-red-500 after:content-['▲']"></div>
            <div
              ref={rollRef}
              className="flex"
              onTransitionEnd={(e) => console.log(`end!!! ${e.type}`)}
            >
              {showRoll &&
                roll.map((item, index) => (
                  <div
                    key={`${item?.id}__${index}`}
                    className={`mx-[4px] flex h-[200px] w-[200px] flex-col items-center justify-center overflow-hidden ${bgGradient[item!.item.rarity]
                      } rounded`}
                  >
                    <Image
                      src={item?.item.imageURL || ''}
                      alt="Weapon logo"
                      width={150}
                      height={Infinity}
                      placeholder="blur"
                      blurDataURL={item?.item.imageURL}
                      priority
                    />
                    <h5 className="truncate text-sm font-medium">{item?.item.name}</h5>
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
        <div className="w-full">
          <h2 className="mt-10 text-2xl">You can drop:</h2>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 md:flex-row justify-items-stretch">
            {caseObj.items.map(({ item, dropRate }) => (
              <div
                key={item.id}
                className={`relative flex flex-col items-center justify-center text-center rounded ${bgGradient[item.rarity]} p-4 group`}
              >
                <Image
                  src={item.imageURL}
                  alt="Case logo"
                  width={150}
                  height={150}
                  className="w-[150px]"
                  placeholder="blur"
                  blurDataURL={item.imageURL}

                />
                <h4 className="text-xs font-medium">{item.name}</h4>
                <h4 className="text-xs font-medium">{dropRate}%</h4>
                <div className="hidden absolute inset-0 opacity-90 bg-black group-hover:flex flex-col items-center justify-center">Chance: <span>{dropRate}%</span></div>
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
