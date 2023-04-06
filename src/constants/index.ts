type ItemRarity = "COMMON" | "UNCOMMON" | "RARE" | "MYTHICAL" | "LEGENDARY";

const colorsToItemRarity = {
  COMMON: "bg-blue-500",
  UNCOMMON: "bg-violet-500",
  RARE: "bg-pink-500",
  MYTHICAL: "bg-red-500",
  LEGENDARY: "bg-red-500",
};

export { colorsToItemRarity };
export type { ItemRarity };
