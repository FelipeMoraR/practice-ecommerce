import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface IModal {
    header: ReactNode;
    body: ReactNode;
    isOpen: boolean;
    hideModal: () => void;
}

//TODO what mean the last ! in getElementById
const Modal = ({ header, body, isOpen, hideModal }: IModal) => {
    if(!isOpen) return null;

    return createPortal(
    <>
        <div className="fixed z-90 bg-black opacity-70 size-full top-0" onClick={hideModal}></div>
        <div className="fixed fade-in z-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-lightest flex flex-col gap-3 max-w-lg min-w-4xs min-h-[200px]  justify-center p-2 outline-4 outline-black-darkest border-t-4 border-l-4 border-gray-lighter">
            <XMarkIcon onClick={hideModal} className="w-5 h-5 absolute top-0 right-0 m-2 cursor-pointer hover:outline-4 hover:outline-gray "/>
            {header}
            {body}  
        </div> 
    </>, 
    document.getElementById('modal-root')!)
}

export default Modal;