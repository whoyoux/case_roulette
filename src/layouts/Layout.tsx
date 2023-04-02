import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <Header />
      {children}
    </>
  );
};

export default Layout;
