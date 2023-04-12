type ItemRarity = "COMMON" | "UNCOMMON" | "RARE" | "MYTHICAL" | "LEGENDARY";

const colorsToItemRarity = {
  COMMON: "bg-blue-500",
  UNCOMMON: "bg-violet-500",
  RARE: "bg-pink-500",
  MYTHICAL: "bg-red-500",
  LEGENDARY: "bg-orange-400",
};

type ModalType = {
  title: string,
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode
}

const MINIMUM_CHARACTERS_TO_SEARCH = 2;

export { colorsToItemRarity, MINIMUM_CHARACTERS_TO_SEARCH };
export type { ItemRarity, ModalType };
