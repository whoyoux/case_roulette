import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'
import { ModalType } from '@/constants'
import Modal from '.';

type OpenCaseModalType = {
    itemName: string;
    imageURL: string;
    title: string;
    isOpen: boolean;
    closeModal: () => void;
};


const OpenCaseModal = ({ title, itemName, imageURL, isOpen, closeModal }: OpenCaseModalType) => {
    console.log(title)
    return (
        <Modal title={title} isOpen={isOpen} closeModal={closeModal}>
            <div className='relative w-1/2 flex flex-col h-[200px]'>
                <Image src={imageURL} fill alt="item image" placeholder='blur' blurDataURL={imageURL} />

            </div>

            <div>
                <h2 className='text-2xl font-medium'>{itemName}</h2>
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    type="button"
                    className="btn btn-sm"
                    onClick={closeModal}
                    disabled
                >
                    Sell
                </button>
                <button
                    type="button"
                    className="btn btn-sm"
                    onClick={closeModal}
                    disabled
                >
                    Upgrade
                </button>
                <button
                    type="button"
                    className="btn btn-sm"
                    onClick={closeModal}
                >
                    Go back
                </button>
            </div>
        </Modal>
    )
}

export default OpenCaseModal;