type ItemRarity = "COMMON" | "UNCOMMON" | "RARE" | "MYTHICAL" | "LEGENDARY";

const colorsToItemRarity = {
  COMMON: "bg-blue-500",
  UNCOMMON: "bg-violet-500",
  RARE: "bg-pink-500",
  MYTHICAL: "bg-red-500",
  LEGENDARY: "bg-orange-400",
};

const bgGradient = {
  COMMON: "bg-gradient-to-tr from-cyan-500 to-blue-500",
  UNCOMMON: "bg-gradient-to-tr from-violet-600 to-indigo-600",
  RARE: "bg-gradient-to-tr from-fuchsia-600 to-pink-600",
  MYTHICAL: "bg-gradient-to-tr from-rose-600 to-red-500",
  LEGENDARY: "bg-gradient-to-tr from-amber-300 to-yellow-500",
}

type ModalType = {
  title: string,
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode
}

const MINIMUM_CHARACTERS_TO_SEARCH = 2;

export { colorsToItemRarity, MINIMUM_CHARACTERS_TO_SEARCH, bgGradient };
export type { ItemRarity, ModalType };
