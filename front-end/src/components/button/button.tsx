import { ComponentType, SVGProps } from "react";

type TypeStyleBtn = 'primary-red' | 'secondary-red' | 'primary-green' | 'secondary-green' | 'primary-yellow' | 'secondary-yellow' | 'primary-neutral' | 'secondary-neutral'
type TypeBtn = "submit" | "reset" | "button" | undefined;

interface IButton {
    typeStyleBtn: TypeStyleBtn;
    typeBtn: TypeBtn;
    textBtn?: string;
    iconBtn?: ComponentType<SVGProps<SVGSVGElement>>;
    disabled?: boolean;
    onClickBtn?: () => void;
}

const Button = ({ typeBtn, typeStyleBtn, textBtn, iconBtn: IconBtn, disabled = false, onClickBtn }: IButton) => {
    const typesButtons = {
        "primary-red": 'flex gap-2 size-full p-2 items-center justify-center bg-red border-t-3 border-l-3 border-red-darker outline-4 outline-black-darkest  hover:bg-red-darker hover:border-red-darkest hover:text-red-lighter lg:hover:scale-95 transition-all duration-50',
        "secondary-red": 'flex gap-2 size-full p-2 items-center justify-center bg-red-lightest border-t-3 border-l-3 border-red-lighter outline-4 outline-black-darkest  hover:bg-red hover:border-red-darker hover:text-red-lightest lg:hover:scale-95 transition-all duration-50',
        "primary-green": 'flex gap-2 size-full p-2 items-center justify-center bg-green border-t-3 border-l-3 border-green-darker outline-4 outline-black-darkest  hover:bg-green-darker hover:border-green-darkest hover:text-green-lighter lg:hover:scale-95 transition-all duration-50',
        "secondary-green": 'flex gap-2 size-full p-2 items-center justify-center bg-green-lightest border-t-3 border-l-3 border-green-lighter outline-4 outline-black-darkest  hover:bg-green hover:border-green-darker hover:text-green-lightest lg:hover:scale-95 transition-all duration-50',
        "primary-yellow": 'flex gap-2 size-full p-2 items-center justify-center bg-yellow border-t-3 border-l-3 border-yellow-darker outline-4 outline-black-darkest  hover:bg-yellow-darker hover:border-yellow-darkest hover:text-yellow-lighter lg:hover:scale-95 transition-all duration-50',
        "secondary-yellow": 'flex gap-2 size-full p-2 items-center justify-center bg-yellow-lightest border-t-3 border-l-3 border-yellow-lighter outline-4 outline-black-darkest  hover:bg-yellow hover:border-yellow-darker hover:text-yellow-lightest lg:hover:scale-95 transition-all duration-50',
        "primary-neutral": 'flex gap-2 size-full p-2 items-center justify-center bg-gray border-t-3 border-l-3 border-gray-darker outline-4 outline-black-darkest text-white  hover:bg-gray-darker hover:border-gray-darkest hover:text-gray-lighter lg:hover:scale-95 transition-all duration-50',
        "secondary-neutral": 'flex gap-2 size-full p-2 items-center justify-center border-t-3 border-l-3 border-gray-lighter outline-4 outline-black-darkest  hover:bg-gray-lightest hover:border-black-lighter hover:text-gray lg:hover:scale-95 transition-all duration-50',
    }
    return (
        <button type = {typeBtn} className = {`${typesButtons[typeStyleBtn]} ${disabled ? 'hover:cursor-not-allowed' : 'pointer-events-auto hover:cursor-pointer'}`} onClick={onClickBtn} disabled = {disabled}>
            {textBtn && <p>{textBtn}</p> }
            {IconBtn && <IconBtn className="w-5 h-5" />}
        </button>
    )
}

export default Button;
