import { ComponentType, SVGProps } from "react";

type TypeBtn = 'login' | 'logout' | 'primary' | 'secondary' | 'register'

interface IButton {
    typeBtn: TypeBtn;
    textBtn?: string;
    iconBtn: ComponentType<SVGProps<SVGSVGElement>>;
    onClickBtn: () => void;
}

const Button = ({ typeBtn, textBtn, iconBtn: IconBtn, onClickBtn }: IButton) => {
    const typesButtons = {
        login: 'flex gap-2 size-full p-2 items-center justify-center bg-red-50 hover:cursor-pointer',
        logout: 'flex gap-2 size-full p-2 items-center justify-center bg-red-50 hover:cursor-pointer',
        register: 'flex gap-2 size-full p-2 items-center justify-center bg-red-50 hover:cursor-pointer',
        primary: 'flex gap-2 size-full p-2 items-center justify-center bg-red-50 hover:cursor-pointer',
        secondary: 'flex gap-2 size-full p-2 items-center justify-center bg-red-50 hover:cursor-pointer'
    }
    return (
        <button className = {typesButtons[typeBtn]} onClick={onClickBtn}>
            {textBtn && <p>{textBtn}</p> }
            {IconBtn && <IconBtn className="w-5 h-5" />}
        </button>
    )
}

export default Button;
