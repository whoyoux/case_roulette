import EditCaseModal from '@/components/Modal/EditCaseModal';
import { prisma } from '@/server/db';
import isAdmin from '@/utils/isAdmin';
import type { GetServerSidePropsContext, NextPage, InferGetServerSidePropsType } from 'next'
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';



const Manage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ cases }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  type Case = typeof cases[0];

  const [isModalOpen, setModalOpen] = useState(false);
  const [caseSelected, setCaseSelected] = useState<Case>({} as Case);

  const edit = ({ id }: { id: string }) => {
    console.log('edit');
    setModalOpen(true);

    const foundCase = cases.find(caseObj => caseObj.id === id);

    if (!foundCase) return;

    setCaseSelected(foundCase);

  }

  return (
    <>
      <Head>
        <title>Manage cases - Case Roulette</title>
      </Head>
      <div>
        {caseSelected.id && <EditCaseModal isOpen={isModalOpen} closeModal={() => setModalOpen(false)} caseObj={caseSelected} />}
        <div className='flex gap-5 flex-wrap m-5'>
          {cases.length === 0 && <h1>No case found!</h1>}
          {cases.length > 0 && cases.map((caseObj) => <div key={caseObj.id} className='flex flex-col items-center bg-zinc-800 p-4 rounded-md border-2 border-transparent hover:border-red-500 cursor-pointer' onClick={() => edit({ id: caseObj.id })}>
            <h2 className='text-xl font-medium'>{caseObj.name}</h2>
            <Image src={caseObj.imageURL} width={120} height={80} alt="Case logo" />
          </div>)}
        </div>
      </div>
    </>

  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const adminUser = await isAdmin(ctx)

  if (!adminUser) {
    return {
      notFound: true
    }
  }

  const cases = await prisma.case.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      imageURL: true,
      isAvailable: true,
      items: {
        orderBy: {
          dropRate: "desc"
        },
        select: {
          id: true,
          dropRate: true,
          item: {
            select: {
              id: true,
              name: true,
              imageURL: true,
              rarity: true
            }
          }
        }
      }
    },
  })

  return {
    props: { cases },
  };
};

export default Manage