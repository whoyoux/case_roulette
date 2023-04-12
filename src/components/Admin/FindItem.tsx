import { api } from "@/utils/api";
import { formatter } from "@/utils/balanceFormatter";
import Image from "next/image";
import { useState } from "react";

import { debounce } from "ts-debounce";
import copyToClipboard from "@/utils/copyToClipboard";
import { MINIMUM_CHARACTERS_TO_SEARCH } from "@/constants";

const FindItem = () => {
    const [name, setName] = useState<string>("");

    const itemsQuery = api.admin.findItems.useQuery({ name: name.trimStart().trimEnd() }, { enabled: name.length >= MINIMUM_CHARACTERS_TO_SEARCH, refetchOnWindowFocus: false });

    const findItem = async () => {
        if (name.length < MINIMUM_CHARACTERS_TO_SEARCH) return;

        console.log("Find item");
        await itemsQuery.refetch();
    }

    const debouncedFindItem = debounce(findItem, 1000);

    return (
        <div className="w-full text-center flex flex-col">
            <h1 className="py-4 text-xl font-medium">Find item with name</h1>
            <input
                type="text"
                placeholder="Name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyUp={() => debouncedFindItem()}
            />
            <div className="my-2">
                <h2 className="text-xl">Items:</h2>

                {itemsQuery.data && !itemsQuery.isLoading && itemsQuery.data.items.length === 0 && <p>Nothing found.</p>}
                {itemsQuery.isFetching && <p>Loading...</p>}

                <div className="flex flex-col gap-5">
                    {!itemsQuery.isFetching && itemsQuery.data && itemsQuery.data.items && itemsQuery.data.items.map(item => {
                        return <div className="w-full bg-zinc-800 rounded-md px-5 py-4 flex flex-col" key={item.id}>
                            <div className="flex justify-between items-center">
                                <Image src={item.imageURL} width={80} height={80} alt="Item image" />
                                <div>{item.name}</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{formatter.format(item.price)}</span>
                                <button className="p-3 bg-red-500 rounded-sm font-medium" onClick={() => copyToClipboard(item.id, true, "Copied to clipboard!")}>Copy ID</button>
                            </div>
                        </div>
                    })}

                </div>


            </div>
        </div>
    )
}

export default FindItem