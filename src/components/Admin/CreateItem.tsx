import { ItemRarity } from "@/constants";
import { api } from "@/utils/api";
import { useState } from "react";

const CreateItem = () => {
    const [itemName, setItemName] = useState<string>("");
    const [itemPrice, setItemPrice] = useState<string>("");
    const [itemRarity, setItemRarity] = useState<ItemRarity>("COMMON");
    const [itemImageURL, setItemImageURL] = useState<string>("");

    const [newItemID, setNewItemID] = useState<string>("");

    const createItemMutation = api.admin.itemCreate.useMutation();

    const createItem = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setNewItemID("");

            if (itemName.length === 0 || itemImageURL.length === 0) {
                throw new Error("Item fields cannot be empty!");
            }

            const newItem = await createItemMutation.mutateAsync({
                name: itemName,
                imageURL: itemImageURL,
                rarity: itemRarity,
            });

            setNewItemID(newItem.id);

            setItemName("");
            setItemImageURL("");
        } catch (err) {
            alert(err);
        }
    };

    const onChangeRarity = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemRarity(e.target.value as ItemRarity);
    };

    return (
        <form className="flex flex-col gap-3 text-center">
            <h1 className="text-2xl">Item Create</h1>
            <input
                type="text"
                placeholder="Name"
                className="form-input"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Price"
                className="form-input"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
            />
            <input
                type="text"
                placeholder="Image URL"
                className="form-input"
                value={itemImageURL}
                onChange={(e) => setItemImageURL(e.target.value)}
            />
            <select onChange={(e) => onChangeRarity(e)} className="form-input ">
                <option>COMMON</option>
                <option>UNCOMMON</option>
                <option>RARE</option>
                <option>MYTHICAL</option>
                <option>LEGENDARY</option>
            </select>
            <button
                type="submit"
                className="form-btn"
                onClick={(e) => createItem(e)}
            >
                Create item
            </button>
            {newItemID && <h2>New Item ID: {newItemID}</h2>}
        </form>
    )
}

export default CreateItem