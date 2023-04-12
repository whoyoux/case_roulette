import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import customToast from "../Notification";
import Head from "next/head";

type ItemType = {
    id: string;
    percents: number;
};

const CreateCase = () => {
    const [caseName, setCaseName] = useState<string>("");
    const [casePrice, setCasePrice] = useState<string>("");
    const [caseImageURL, setCaseImageURL] = useState<string>("");

    const [tempItemId, setTempItemId] = useState<string>("");
    const [tempItemPercents, setTempItemPercents] = useState<string>("");

    const [tempItems, setTempItems] = useState<ItemType[]>([]);

    const [percentsLeft, setPercentsLeft] = useState<number>(100);

    const createCaseMutation = api.admin.caseCreate.useMutation();

    useEffect(() => {
        setPercentsLeft(100 - countPercents());
    }, [tempItems]);

    const addItemToTempList = () => {
        try {
            if (tempItems.find((item) => item.id === tempItemId)) {
                throw new Error("You cannot add multiple time same item!");
            }

            if (tempItemPercents.length === 0 || tempItemId.length === 0) {
                throw new Error("Item fields cannot be empty!");
            }
            const tempPercents: number = Number.parseInt(tempItemPercents);

            if (!tempPercents) {
                throw new Error("Item percents must be a number!");
            }

            if (tempPercents <= 0) {
                throw new Error("Item percents cannot be a negative number or 0!");
            }

            setTempItems([...tempItems, { id: tempItemId, percents: tempPercents }]);

            setTempItemId("");
            setTempItemPercents("");
        } catch (err) {
            alert(err);
        }
    };

    const removeItemFromList = (name: string) => {
        setTempItems([...tempItems.filter((item) => item.id !== name)]);
    };

    const countPercents = () => {
        return tempItems.reduce((acc, curr) => {
            return acc + curr.percents;
        }, 0);
    };

    const createCase = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (
                caseName.length === 0 ||
                caseImageURL.length === 0 ||
                casePrice.length === 0
            ) {
                throw new Error("Case fields cannot be empty!");
            }

            const tempPrice: number = Number.parseInt(casePrice);

            if (!tempPrice) {
                throw new Error("Case price must be a number!");
            }

            const totalPercents = countPercents();

            if (totalPercents !== 100) {
                const difference = Math.abs(100 - totalPercents);
                throw new Error(
                    `Combined percents must be equal to 100! Difference: ${difference}`
                );
            }

            // CREATE CASE
            await createCaseMutation.mutateAsync({
                name: caseName,
                imageURL: caseImageURL,
                price: tempPrice,
                items: {
                    create: tempItems.map((tempItem) => {
                        return {
                            dropRate: tempItem.percents,
                            item: {
                                connect: {
                                    id: tempItem.id,
                                },
                            },
                        };
                    }),
                },
            });

            customToast({ message: "Created a case!" })
        } catch (err) {
            console.error(err);
            customToast({ message: "Some error occurs. Please check console." })
        }
    };
    return (
        <>
            <form className="flex flex-col gap-3 text-center">
                <h1 className="text-2xl">Case Create</h1>
                <input
                    type="text"
                    placeholder="Name"
                    className="form-input"
                    value={caseName}
                    onChange={(e) => setCaseName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Price"
                    className="form-input"
                    value={casePrice}
                    onChange={(e) => setCasePrice(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    className="form-input"
                    value={caseImageURL}
                    onChange={(e) => setCaseImageURL(e.target.value)}
                />

                <div className="my-5 flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Item ID"
                        className="form-input"
                        value={tempItemId}
                        onChange={(e) => setTempItemId(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Item win %"
                        className="form-input"
                        value={tempItemPercents}
                        onChange={(e) => setTempItemPercents(e.target.value)}
                    />
                    <button
                        className="form-btn"
                        type="button"
                        onClick={addItemToTempList}
                    >
                        Add item
                    </button>

                    {tempItems.length > 0 && (
                        <div>
                            <h4>Current items:</h4>
                            <div className="flex flex-col">
                                {tempItems.map((item) => (
                                    <div key={item.id}>
                                        <div>ID: {item.id}</div>
                                        <div>Percents: {item.percents}</div>
                                        <button
                                            onClick={() => removeItemFromList(item.id)}
                                            className="w-full rounded-md bg-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="py-2 text-xl ">
                        Percents left: <b>{percentsLeft.toString()}</b>
                    </div>
                </div>

                <button
                    type="submit"
                    className="form-btn"
                    onClick={(e) => createCase(e)}
                >
                    Create case
                </button>
            </form>
        </>
    )
}

export default CreateCase