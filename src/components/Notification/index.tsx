import { toast } from "react-hot-toast";
import Image from "next/image";

type CustomToastType = {
  message: string;
  imageURL?: string;
};

const customToast = ({ message, imageURL }: CustomToastType) =>
  toast.custom((t) => (
    <div
      className={`${t.visible ? "animate-enter" : "animate-leave"
        } pointer-events-auto flex w-full max-w-md rounded-lg border-2 border-red-500 bg-zinc-800 text-xl shadow-md items-center`}
    >
      {imageURL && (
        <div className="relative ml-5 my-3 ">
          <Image src={imageURL} width={100} height={100} alt="item image" />
        </div>
      )}
      <div className="px-4 py-6">New item: <b>{message}</b></div>
    </div>
  ));
export default customToast;
