import { UseAuthValidateSessionContext } from '../../contexts/authValidation.context';
import { ChevronDownIcon, UserIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { INavbar } from '../../models/types';
import Button from '../button/button';
import { useState } from 'react';

const Navbar = ({ imgRoute, pages }: INavbar) => {
    const { userIsLoged } = UseAuthValidateSessionContext();
    const [ elementClicked, setElementClicked ] = useState<number | null>(null);

    const handlerNavbarClick = (num: number): void => {
        if (window.innerWidth > 1024) return;
        
        setElementClicked(prev => {
            if (prev === num) return null;
            return num;
        });
    }

    return (
        <nav className = "fixed h-full flex p-2 bg-indigo-100 flex-col gap-4 lg:justify-center lg:bg-transparent lg:flex-row lg:gap-12 lg:h-24 lg:sticky">
            <div className = 'flex gap-6'>
                <div className = "w-20 h-full hidden lg:block">
                    <img src = {imgRoute} alt="logoNavbar" className='size-full object-contain rounded-full border-1 border-black' />
                </div>

                { pages && (
                    <ul className='flex gap-3 w-full items-center justify-center flex-col lg:w-auto lg:flex-row'>
                        { pages.map((page, index) => (
                            <li 
                                className = 'relative w-full p-2 group lg:hover:cursor-pointer lg:w-auto lg:h-[40px] lg:hover:bg-indigo-300 lg:transition-bg-indigo-300 lg:duration-100' 
                                key = {index}
                            >
                                <div className = 'flex gap-2 justify-between'>
                                    <a href = {page.anchor}>{page.text}</a>

                                    { page.subPages && <ChevronDownIcon className="w-5 h-5" onClick = {() => handlerNavbarClick(index)} /> }
                                </div>
                                
                                { page.subPages && (
                                    <ul className={`relative ${index === elementClicked ? 'opacity-100 h-auto' : 'opacity-0 h-0'} overflow-hidden right-0 w-full flex flex-col gap-1 p-2 bg-indigo-300 transition-height duration-200 pointer-events-none lg:overflow-auto lg:h-auto lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:transition-opacity lg:duration-200 lg:absolute`}>
                                        { page.subPages.map((subPage, subIndex) => (
                                            <li className='lg:opacity-50 lg:hover:opacity-100' key = {[index,subIndex].join('')}>
                                                <a href = {subPage.anchor}>{subPage.text}</a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            
            { userIsLoged ? (
                <div>
                    logeao
                </div>
            ) : (
                <div className='flex gap-3 flex-row lg:items-center'>
                    <Button typeBtn = 'login' textBtn = 'Login' iconBtn = { UserIcon } />
                    <Button typeBtn = 'register' textBtn = 'Register' iconBtn = { UserPlusIcon } />
                </div>
            )}

        </nav>
    )
}

export default Navbar;

