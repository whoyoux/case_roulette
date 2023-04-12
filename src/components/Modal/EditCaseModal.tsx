import Image from 'next/image'
import Modal from '.';
import { useState } from 'react';
import { Rarity } from '@prisma/client';

type EditCaseModal = {
    caseObj: Case,
    isOpen: boolean;
    closeModal: () => void;
};

type Case = {
    id: string;
    name: string;
    items: {
        item: {
            id: string;
            name: string;
            imageURL: string;
            rarity: Rarity;
        };
        id: string;
        dropRate: number;
    }[];
    imageURL: string;
    price: number;
    isAvailable: boolean;
}

const EditCaseModal = ({ isOpen, closeModal, caseObj }: EditCaseModal) => {

    const [currentCase, setCase] = useState<Case>(caseObj);

    const [caseName, setCaseName] = useState<string>(caseObj.name);
    const [casePrice, setCasePrice] = useState<string>(caseObj.price.toString());
    const [caseImageURL, setCaseImageURL] = useState<string>(caseObj.imageURL);
    return (
        <Modal title={`Edit ${caseObj.name}`} isOpen={isOpen} closeModal={closeModal}>
            <div className='flex flex-col gap-3 w-full'>
                <h2 className='text-2xl font-medium'>General info</h2>
                <label htmlFor="name-input">Name</label>
                <input
                    type="text"
                    placeholder="Name"
                    className="form-input"
                    id="name-input"
                    value={currentCase.name}
                    onChange={(e) => setCase({ ...currentCase, name: e.target.value })}
                />
                <label htmlFor="imageurl-input">Image URL</label>
                <input
                    type="text"
                    placeholder="Image URL"
                    className="form-input"
                    id="imageurl-input"
                    value={currentCase.imageURL}
                    onChange={(e) => setCase({ ...currentCase, imageURL: e.target.value })}
                />
                <label htmlFor="price-input">Price</label>
                <input
                    type="number"
                    placeholder="Price"
                    className="form-input"
                    id="price-input"
                    value={casePrice}
                    onChange={(e) => setCase({ ...currentCase, price: e.target.valueAsNumber })}
                />
                <div>
                    <h2 className='text-2xl font-medium mt-5'>Items</h2>
                    <div className='flex flex-col gap-8'>
                        {caseObj.items.map(item =>
                            <div key={item.id} className='flex flex-col border-t-2 pt-4 border-zinc-700'>
                                <h3 className='text-xl font-medium'>{item.item.name}</h3>
                                <label htmlFor={`${item.id}-form-name`}>Name</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="form-input"
                                    id={`${item.id}-form-name`}
                                    value={item.dropRate}
                                />
                            </div>)}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    type="button"
                    className="btn btn-sm"
                    onClick={closeModal}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-sm"
                    onClick={closeModal}
                >
                    Save
                </button>
            </div>
        </Modal>
    )
}

export default EditCaseModal;