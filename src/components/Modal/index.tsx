import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Image from 'next/image'

type ModalType = {
    name: string;
    imageURL: string
    isOpen: boolean;
    closeModal: () => void
}

const Modal = ({ isOpen = false, name, imageURL, closeModal }: ModalType) => {
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-30" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-zinc-900 border-2 border-red-500 text-white p-6 text-left align-middle shadow-xl transition-all flex flex-col justify-center items-center gap-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-medium leading-6 py-2"
                                    >
                                        New drop 😯😯😯
                                    </Dialog.Title>

                                    <div className='relative w-1/2 flex flex-col h-[150px]'>
                                        <Image src={imageURL} fill alt="item image" placeholder='blur' blurDataURL={imageURL} />

                                    </div>

                                    <div>
                                        <h2 className='text-2xl font-medium'>{name}</h2>
                                    </div>

                                    <div className="mt-4 flex gap-4">
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={closeModal}
                                        >
                                            Sell
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={closeModal}
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
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Modal;