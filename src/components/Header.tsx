import { api } from "@/utils/api";
import { formatter } from "@/utils/balanceFormatter";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { LogIn, LogOut, User, Landmark, Accessibility } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();

  const { data } = api.user.getBalance.useQuery({} as any, { enabled: !!session });

  const addBalance = () => {
    console.log("add balance");
  };

  return (
    <header className="flex w-screen max-w-full items-center justify-between bg-zinc-800 px-10 py-10">
      <Link href="/" className="text-2xl md:text-4xl font-medium flex items-center gap-2">
        <Accessibility size={42} /> keychain
      </Link>
      <div className="flex items-center gap-5">
        {session ? (
          <>
            <button
              className="hidden md:flex rounded-md bg-zinc-900 px-8 py-3 text-center font-medium"
              onClick={addBalance}
            >
              {formatter.format(data?.balance || 0)}
            </button>
            <UserDropdown
              username={session.user.name || "username"}
              isAdmin={session.user.isAdmin}
              addBalance={addBalance}
              balance={data ? data.balance : null}
            />
          </>
        ) : (
          <>
            <div className="btn flex items-center gap-2" onClick={() => signIn("discord")}>
              login <LogIn />
            </div>
          </>
        )}
      </div>
    </header>
  );
};

interface UserDropdownProps {
  username: string;
  isAdmin: boolean;
  balance: number | null;
  addBalance: () => void;
}

const UserDropdown = ({ username, isAdmin, balance, addBalance }: UserDropdownProps) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex justify-center rounded-md bg-zinc-900 px-7 py-3 font-medium">
        {username}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-20 absolute right-0 flex w-[200px] origin-top-right flex-col rounded-md border-2 border-red-500 bg-zinc-800 p-2">
          <div className="block md:hidden">
            {balance && <Menu.Item key={"DROPDOWN/balance"} as={Fragment}>
              <button
                className="w-full rounded-sm px-2 py-2 hover:bg-zinc-900"
                onClick={addBalance}
              >
                {formatter.format(balance)}
              </button>
            </Menu.Item>}
          </div>
          <Menu.Item key={"DROPDOWN/profile"} as={Fragment}>
            <Link
              href="/profile"
              className="w-full rounded-sm px-2 py-2 hover:bg-zinc-900 flex items-center gap-2"
            >
              <User size={18} /> Profile
            </Link>
          </Menu.Item>
          <Menu.Item key={"DROPDOWN/deposit"} as={Fragment}>
            <button
              className="w-full rounded-sm px-2 py-2 text-left hover:bg-zinc-900 flex items-center gap-2"
              onClick={() => { }}
            >
              <Landmark size={18} /> Deposit
            </button>
          </Menu.Item>
          <Menu.Item key={"DROPDOWN/sign-out"} as={Fragment}>
            <button
              className="w-full rounded-sm px-2 py-2 text-left hover:bg-zinc-900 flex items-center gap-2"
              onClick={() => signOut()}
            >
              <LogOut size={18} /> Sign out
            </button>
          </Menu.Item>
          {isAdmin && (
            <><div className="pl-2 pt-3 font-medium">Admin tools</div>
              <div className="mt-2 flex flex-col">
                <Menu.Item key={"DROPDOWN/admin/create"} as={Fragment}>
                  <Link
                    href="/admin/create"
                    className="w-full rounded-sm px-2 py-2 hover:bg-zinc-900"
                  >
                    Create
                  </Link>
                </Menu.Item>
                <Menu.Item key={"DROPDOWN/admin/manage"} as={Fragment}>
                  <Link
                    href="/admin/manage"
                    className="w-full rounded-sm px-2 py-2 hover:bg-zinc-900"
                  >
                    Manage
                  </Link>
                </Menu.Item>
              </div></>

          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Header;
