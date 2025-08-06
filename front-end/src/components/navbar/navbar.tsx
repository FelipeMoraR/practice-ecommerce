import { INavbar } from '../../models/types';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import NavBarContentDesktop from './navbarContentDesktop';
import NavbarContentMobile from './navbarContentMobile';
import Button from '../button/button';
import { useEffect, useState } from 'react';

const Navbar = ({ imgRoute, pages }: INavbar) => {
    const [ showNavMobile , setShowNavMobile ] = useState<boolean>(false);
    const [ sizeScreen, setSizeScreen ] = useState<number>(window.innerWidth);
    const [ elementClicked, setElementClicked ] = useState<number | null>(null);
    
    const handlerNavbarSlidersClick = (num: number): void => {
        if (window.innerWidth > 1024) return;
        
        setElementClicked(prev => {
            if (prev === num) return null;
            return num;
        });
    }

    const handlerShowNavbar = (): void => {
        if (window.innerWidth > 1024) return;
        
        setShowNavMobile(prev => !prev);
        setElementClicked(null);
    }

    useEffect(() => {
        const handleResize = (): void => setSizeScreen(window.innerWidth);
        
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>  
            {sizeScreen > 1023 ? (
                <nav className = 'h-24 px-8 pt-2 flex flex-row justify-between gap-12 bg-gray-lighter outline-4'>
                    <NavBarContentDesktop imgRoute = {imgRoute} pages = {pages} />
                </nav>
            ) : (
                <>
                    <nav className = 'flex justify-center p-2 bg-gray-lighter outline-4 relative'>
                        <div className = "w-15 h-full">
                            <img src = {imgRoute} alt="logoNavbarMobile" className='size-full object-contain border-4 border-black' />
                        </div>
                        <div className='absolute right-0 top-0 w-[76px] h-full'>
                            <Button typeBtn = "button" typeStyleBtn = 'primary-neutral' iconBtn = {Bars3Icon} onClickBtn = {handlerShowNavbar} />
                        </div>
                    </nav>

                    <div className={`fixed z-40 bg-black opacity-70 size-full ${showNavMobile ? 'block' : 'hidden'}`} onClick = {handlerShowNavbar}></div>

                    <aside className = {`fixed z-50 transform ${showNavMobile ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} transition-all duration-300 right-0 top-0 h-full p-3 pt-15 bg-gray-lighter border-4 flex flex-col gap-6`}>
                        <div className='absolute w-[40px] -left-8 top-2'>
                            <Button typeBtn = "button" typeStyleBtn = 'primary-neutral' iconBtn = {XMarkIcon} onClickBtn = {handlerShowNavbar}/>
                        </div>

                        <NavbarContentMobile pages = {pages} elementClicked={elementClicked} handlerNavbarSlidersClick={handlerNavbarSlidersClick} />
                    </aside>
                </>
            )}
        </>
    )
}

export default Navbar;

