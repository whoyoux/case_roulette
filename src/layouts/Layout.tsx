import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <Header />
      <div className="max-w-6xl mx-auto w-full px-5">
        {children}
      </div>
    </>
  );
};

export default Layout;
