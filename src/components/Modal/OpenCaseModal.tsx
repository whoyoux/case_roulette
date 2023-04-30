import Image from 'next/image'
import Modal from '.';

type OpenCaseModalType = {
    itemName: string;
    imageURL: string;
    title: string;
    isOpen: boolean;
    closeModal: () => void;
};


const OpenCaseModal = ({ title, itemName, imageURL, isOpen, closeModal }: OpenCaseModalType) => {
    return (
        <Modal title={title} isOpen={isOpen} closeModal={closeModal}>
            <div className='relative w-auto flex flex-col h-[185px]'>
                <Image src={imageURL} width={250} height={200} alt="item image" placeholder='blur' blurDataURL={imageURL} priority className='drop-shadow-2xl' />
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