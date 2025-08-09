import { UseAuthValidateSessionContext } from '../../contexts/authValidation.context';
import { INavbar } from "../../models/types/navbar.model";
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/solid'
import Button from "../button/button";
import { Link, useNavigate } from "react-router-dom";
import { UseAuthActionContext } from '../../contexts/authAction.context';

const NavBarContentDesktop = ({ imgRoute, pages }: INavbar) => {
    const { userIsLoged } = UseAuthValidateSessionContext();
    const { fetchLogoutUser } = UseAuthActionContext();
    const navigate = useNavigate();
    
    return (
        <>  
            <div className = 'w-20 h-full pb-2 lg:hidden xl:block'>
                <img src = {imgRoute} alt="logoNavbar" className='size-full object-contain border-4 border-black ' />
            </div>

            { pages && (
                <div className='flex gap-3 justify-center w-auto flex-row items-end'>
                    { pages.map((page, index) => (
                        <div 
                            className='cursor-pointer group relative'
                            key = {index}
                        >
                            <button 
                                className = 'relative bg-white border-4 p-2 group-hover:cursor-pointer w-auto group-hover:bg-gray group-hover:border-gray-lightest group-hover:text-gray-lightest transition-all duration-100 text-2xl border-t-4 border-l-4 border-r-4 border-b-0' 
                                onClick={() => navigate(page.anchor)}
                            >
                                <div className = 'flex gap-2 justify-between items-center'>
                                    <p>{page.text}</p>

                                    { page.subPages && <ChevronDownIcon className={`w-8 h-8 group-hover:rotate-180 transition-all duration-100 `} /> }
                                </div>
                            </button> 

                            { page.subPages && (
                                <ul className={`right-0 w-full flex flex-col bg-gray border-4 border-gray-lighter duration-200 p-2 pointer-events-none overflow-auto h-auto opacity-0 group-hover:pointer-events-auto group-hover:cursor-default group-hover:opacity-100 transition-opacity duration-200 absolute gap-0`}>
                                    { page.subPages.map((subPage, subIndex) => (
                                        <Link to = {subPage.anchor} className='text-white text-lg hover:cursor-pointer opacity-50 hover:opacity-100 hover:border-4 hover:border-white hover:text-xl hover:p-1 transition-all duration-50' key = {[index,subIndex].join('')}>
                                            {subPage.text}
                                        </Link>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
               
            { userIsLoged ? (
                <div className = 'flex gap-3 flex-row lg:items-center'>
                    <div className = 'h-[40px]'>
                        <Button typeBtn = "button" typeStyleBtn = 'secondary-yellow' textBtn = 'Profile' iconBtn = { UserIcon } onClickBtn = {() => navigate('profile')} />
                    </div>
                    
                    <div className = 'h-[40px]'>
                        <Button typeBtn = "button" typeStyleBtn = 'secondary-red' textBtn = 'Logout'  onClickBtn = {fetchLogoutUser} />
                    </div>                    
                </div>
            ) : (
                <div className = 'flex gap-3 flex-row lg:items-center'>
                    <div className = 'h-[40px]'>
                        <Button typeBtn = "button" typeStyleBtn = 'primary-red' textBtn = 'Login'  onClickBtn = {() => navigate('/login') } />
                    </div>
                        
                    <div className = 'h-[40px]'>
                        <Button typeBtn = "button" typeStyleBtn = 'primary-green' textBtn = 'Register' onClickBtn = {() => navigate('/register')} />
                    </div>
                </div>
            )}
        </>
    )
}

export default NavBarContentDesktop;
