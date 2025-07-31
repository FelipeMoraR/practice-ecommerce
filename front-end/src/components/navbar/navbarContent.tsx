import { UseAuthValidateSessionContext } from '../../contexts/authValidation.context';
import { INavbar } from "../../models/types";
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/solid'
import Button from "../button/button";
import { Link, useNavigate } from "react-router";
import { useState } from 'react';

const NavBarContent = ({ imgRoute, pages }: INavbar) => {
    const { userIsLoged } = UseAuthValidateSessionContext();
    const [ elementClicked, setElementClicked ] = useState<number | null>(null);
    const navigate = useNavigate();

    const handlerNavbarSlidersClick = (num: number): void => {
        if (window.innerWidth > 1024) return;
        
        setElementClicked(prev => {
            if (prev === num) return null;
            return num;
        });
    }

    return (
        <>
            <div className = 'w-20 h-full hidden xl:block'>
                <img src = {imgRoute} alt="logoNavbar" className='size-full object-contain rounded-full border-1 border-black' />
            </div>

            { pages && (
                <ul className='flex gap-3 w-full items-center justify-center flex-col lg:w-auto lg:flex-row'>
                    { pages.map((page, index) => (
                        <li 
                            className = {`relative w-full p-2 group lg:hover:cursor-pointer lg:w-auto lg:h-[40px] lg:hover:bg-indigo-300 lg:transition-bg-indigo-300 lg:duration-100 ${index === elementClicked ? 'bg-indigo-300 transition-background-color duration-150' : ''}`} 
                            key = {index}
                        >
                            <div className = 'flex gap-2 justify-between'>
                                <Link to = {page.anchor}> {page.text} </Link>

                                { page.subPages && <ChevronDownIcon className="w-5 h-5" onClick = {() => handlerNavbarSlidersClick(index)} /> }
                            </div>
                                    
                            { page.subPages && (
                                <ul className={`relative ${index === elementClicked ? 'opacity-100 h-auto p-2' : 'opacity-0 h-0 p-0'} overflow-hidden right-0 w-full flex flex-col gap-1  bg-indigo-300 transition-height duration-200 lg:p-2 lg:pointer-events-none lg:overflow-auto lg:h-auto lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:transition-opacity lg:duration-200 lg:absolute`}>
                                    { page.subPages.map((subPage, subIndex) => (
                                        <li className='lg:opacity-50 lg:hover:opacity-100' key = {[index,subIndex].join('')}>
                                            <Link to = {subPage.anchor}>{subPage.text}</Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            </li>
                        ))}
                </ul>
            )}
               
                
                
            { userIsLoged ? (
                <div className = 'flex gap-3 flex-row lg:items-center'>
                    <div className = 'h-[40px]'>
                        <Button typeBtn = 'primary-red' textBtn = 'Profile' iconBtn = { UserIcon } onClickBtn = {() => navigate('/register')} />
                    </div>
                    
                    <div className = 'h-[40px]'>
                        <Button typeBtn = 'primary-red' textBtn = 'Logout'  onClickBtn = {() => navigate('/register')} />
                    </div>                    
                </div>
            ) : (
                <div className = 'flex gap-3 flex-row lg:items-center'>
                    <div className = 'h-[40px]'>
                        <Button typeBtn = 'primary-red' textBtn = 'Login'  onClickBtn = {() => navigate('/login') } />
                    </div>
                        
                    <div className = 'h-[40px]'>
                        <Button typeBtn = 'primary-green' textBtn = 'Register' onClickBtn = {() => navigate('/register')} />
                    </div>
                </div>
            )}
        </>
    )
}

export default NavBarContent;
