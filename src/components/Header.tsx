import { api } from "@/utils/api";
import { formatter } from "@/utils/balanceFormatter";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  const { data } = api.user.getBalance.useQuery();
  return (
    <header className="flex w-screen items-center justify-between bg-gray-200 px-10 py-10">
      <Link href="/" className="text-2xl font-medium">
        Case Roulette
      </Link>
      <div className="flex gap-5">
        {session ? (
          <>
            <div>balance: {formatter.format(data?.balance || 0)}</div>
            <div>{session.user.name}</div>
          </>
        ) : (
          <>
            <div className="btn" onClick={() => signIn("discord")}>
              login
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
