import { ComponentType, SVGProps } from "react";

type TypeBtn = 'login' | 'logout' | 'primary' | 'secondary' | 'register'

interface IButton {
    typeBtn: TypeBtn;
    textBtn: string;
    iconBtn: ComponentType<SVGProps<SVGSVGElement>>;
}

const Button = ({ typeBtn, textBtn, iconBtn: IconBtn }: IButton) => {
    const typesButtons = {
        login: 'flex gap-2 max-w-max p-2 items-center h-[40px] bg-red-50 hover:cursor-pointer',
        logout: 'flex gap-2 max-w-max p-2 items-center h-[40px] bg-red-50 hover:cursor-pointer',
        register: 'flex gap-2 max-w-max p-2 items-center h-[40px] bg-red-50 hover:cursor-pointer',
        primary: 'flex gap-2 max-w-max p-2 items-center h-[40px] bg-red-50 hover:cursor-pointer',
        secondary: 'flex gap-2 max-w-max p-2 items-center h-[40px] bg-red-50 hover:cursor-pointer'
    }
    return (
        <button className = {typesButtons[typeBtn]}>
            <p>{textBtn}</p>
            {IconBtn && <IconBtn className="w-5 h-5" />}
        </button>
    )
}

export default Button;
