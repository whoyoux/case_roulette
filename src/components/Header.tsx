import Link from "next/link";

const Header = () => {
  return (
    <header className="flex w-screen bg-gray-200 px-10 py-4">
      <Link href="/" className="text-2xl font-medium">
        Case Roulette
      </Link>
    </header>
  );
};

export default Header;
