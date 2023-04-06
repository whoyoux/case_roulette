import { GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import superjson from "superjson";
import { appRouter } from "@/server/api/root";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from "@/server/db";
import { Case } from "@prisma/client";

const Home: NextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const cases = props.cases! as Case[];
  return (
    <>
      <Head>
        <title>Case Roulette</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-10">
        <div>
          <h1 className="mb-5 text-3xl font-bold">Our best cases</h1>

          <div className="flex flex-row gap-5 truncate">
            {cases.map((caseObject) => (
              <Link
                href={`/case/${caseObject.id}`}
                passHref
                key={caseObject.id}
              >
                <div className="group flex cursor-pointer flex-col items-center rounded-lg border-2 border-transparent bg-zinc-800 px-4 py-2 font-medium hover:border-red-600">
                  <img
                    src={caseObject.imageURL}
                    alt="Case logo"
                    width={200}
                    className="transition-all group-hover:scale-110"
                  />
                  <h1 className="text-xl">{caseObject.name}</h1>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      session: null,
      prisma,
    },
    transformer: superjson,
  });

  const cases = await ssg.case.getAvailableCasesName.fetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      cases,
    },
    revalidate: 10,
  };
};

export default Home;
