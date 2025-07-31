import { INavbar } from '../../models/types';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import NavBarContent from './navbarContent';
import Button from '../button/button';
import { useEffect, useState } from 'react';

const Navbar = ({ imgRoute, pages }: INavbar) => {
    const [ showNavMobile , setShowNavMobile ] = useState<boolean>(false);
    const [ sizeScreen, setSizeScreen ] = useState<number>(window.innerWidth);
    
    const handlerShowNavbar = (): void => {
        if (window.innerWidth > 1024) return;
        
        setShowNavMobile(prev => !prev);
    }

    useEffect(() => {
        const handleResize = (): void => setSizeScreen(window.innerWidth);
        
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>  
            {sizeScreen > 1023 ? (
                <nav className = 'h-24 px-8 py-2 flex flex-row justify-between gap-12 bg-indigo-200'>
                    <NavBarContent imgRoute = {imgRoute} pages = {pages} />
                </nav>
            ) : (
                <>
                    <nav className = 'flex justify-center p-2 bg-indigo-200 relative'>
                        <div className = "w-15 h-full">
                            <img src = {imgRoute} alt="logoNavbarMobile" className='size-full object-contain rounded-full border-1 border-black' />
                        </div>
                        <div className='absolute right-0 top-0 w-[76px] h-full'>
                            <Button typeBtn = 'primary-red' iconBtn = {Bars3Icon} onClickBtn = {handlerShowNavbar} />
                        </div>
                    </nav>

                    <aside className = {`fixed transform ${showNavMobile ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} transition-all duration-300 right-0 top-0 h-full p-3 bg-indigo-100 flex flex-col gap-6`}>
                        <div className='absolute w-[40px] -left-8 top-2'>
                            <Button typeBtn = 'primary-green' iconBtn = {XMarkIcon} onClickBtn = {handlerShowNavbar}/>
                        </div>
                        <NavBarContent imgRoute = {imgRoute} pages = {pages} />
                    </aside>
                </>
                
            )}
            
        </>
    )
}

export default Navbar;

