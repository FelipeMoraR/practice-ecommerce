import { UseAuthValidateSessionContext } from '../../contexts/authValidation.context';
import { INavbarContent } from "../../models/types";
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/solid'
import Button from "../button/button";
import { Link, useNavigate } from "react-router";
import { UseAuthActionContext } from '../../contexts/authAction.context';

const NavBarContent = ({ imgRoute, pages, elementClicked, handlerNavbarSlidersClick }: INavbarContent) => {
    const { userIsLoged } = UseAuthValidateSessionContext();
    const { fetchLogoutUser } = UseAuthActionContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetchLogoutUser();
        navigate('/', { replace: true }); // NOTE we have to replace the last page in the history stack to avoid the race condition.
    }

    return (
        <>  
            <div className = 'w-20 h-full hidden xl:block pb-2'>
                <img src = {imgRoute} alt="logoNavbar" className='size-full object-contain border-4 border-black ' />
            </div>

            { pages && (
                <ul className='flex gap-3 w-full items-center justify-center flex-col lg:w-auto lg:flex-row items-end'>
                    { pages.map((page, index) => (
                        <Link to = {page.anchor}>
                            <li 
                                className = {`relative w-full p-2 border-4 group lg:hover:cursor-pointer lg:w-auto lg:hover:bg-gray lg:hover:border-gray-lightest lg:hover:text-gray-lightest lg:transition-all lg:duration-100 lg:text-2xl lg:border-t-4 lg:border-l-4 lg:border-r-4 lg:border-b-0 ${index === elementClicked ? 'bg-gray transition-background-color duration-150 border-gray-lightest text-gray-lightest' : 'bg-gray-lightest'}`} 
                                key = {index}
                            >
                                <div className = 'flex gap-2 justify-between items-center'>
                                    {page.text}

                                    { page.subPages && <ChevronDownIcon className={`w-5 h-5 lg:w-8 lg:h-8 lg:group-hover:rotate-180 lg:transition-all lg:duration-100 ${index === elementClicked ? 'rotate-180 transition-all duration-100' : ''}`} onClick = {() => handlerNavbarSlidersClick(index)} /> }
                                </div>
                                        
                                { page.subPages && (
                                    <ul className={`relative ${index === elementClicked ? 'opacity-100 h-auto p-2 mt-1' : 'opacity-0 h-0 p-0'} overflow-hidden right-0 w-full flex flex-col gap-2 bg-gray outline-4 transition-height duration-200 lg:p-2 lg:pointer-events-none lg:overflow-auto lg:h-auto lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:transition-opacity lg:duration-200 lg:absolute lg:mt-2 lg:gap-0`}>
                                        { page.subPages.map((subPage, subIndex) => (
                                            <Link to = {subPage.anchor}>
                                                <li className='lg:opacity-50 lg:hover:opacity-100 lg:hover:border-4 lg:hover:p-1 lg:transition-all lg:duration-50' key = {[index,subIndex].join('')}>
                                                    {subPage.text}
                                                </li>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        </Link>
                        ))}
                </ul>
            )}
               
            { userIsLoged ? (
                <div className = 'flex gap-3 flex-row lg:items-center'>
                    <div className = 'h-[40px]'>
                        <Button typeBtn = "button" typeStyleBtn = 'secondary-yellow' textBtn = 'Profile' iconBtn = { UserIcon } onClickBtn = {() => navigate('/profile')} />
                    </div>
                    
                    <div className = 'h-[40px]'>
                        <Button typeBtn = "button" typeStyleBtn = 'secondary-red' textBtn = 'Logout'  onClickBtn = {handleLogout} />
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

export default NavBarContent;
