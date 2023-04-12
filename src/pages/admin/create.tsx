import CreateItem from "@/components/Admin/CreateItem";
import FindItem from "@/components/Admin/FindItem";
import CreateCase from "@/components/Admin/CreateCase";
import isAdmin from "@/utils/isAdmin";
import type { GetServerSidePropsContext, NextPage } from "next";

const Create: NextPage = () => {
  return (
    <main className="flex w-full flex-col items-center justify-center gap-10 pt-10">
      <h1 className="text-4xl">Create panel</h1>
      <div className="flex w-full flex-col justify-center gap-10 max-w-2xl mb-64">
        <CreateItem />
        <FindItem />
        <CreateCase />
      </div>
    </main>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const adminUser = await isAdmin(ctx)

  if (!adminUser) {
    return {
      notFound: true
    }
  }

  return {
    props: {},
  };
};

export default Create;
