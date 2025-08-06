import { UseAuthValidateSessionContext } from '../../contexts/authValidation.context';
import { INavbarContentMobile } from "../../models/types";
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/solid'
import Button from "../button/button";
import { Link, useNavigate } from "react-router-dom";
import { UseAuthActionContext } from '../../contexts/authAction.context';

const NavbarContentMobile = ({ pages, elementClicked, handlerNavbarSlidersClick }: INavbarContentMobile) => {
    const { userIsLoged } = UseAuthValidateSessionContext();
    const { fetchLogoutUser } = UseAuthActionContext();
    const navigate = useNavigate();
    
    return (
        <>  
            { pages && (
                <ul className='flex gap-3 w-full items-center justify-center flex-col items-end'>
                    { pages.map((page, index) => (
                        <li 
                            className = {`relative w-full p-2 border-4 group ${index === elementClicked ? 'bg-gray transition-background-color duration-150 border-gray-lightest text-gray-lightest' : 'bg-gray-lightest'}`} 
                            key = {index}
                        >
                            <div className = 'flex gap-2 justify-between items-center'>
                                <Link to = {page.anchor}> {page.text} </Link>

                                { page.subPages && <ChevronDownIcon className={`w-5 h-5 ${index === elementClicked ? 'rotate-180 transition-all duration-100' : ''}`} onClick = {() => handlerNavbarSlidersClick(index)} /> }
                            </div>
                                    
                            { page.subPages && (
                                <ul className={`relative ${index === elementClicked ? 'opacity-100 h-auto p-2 mt-1' : 'opacity-0 h-0 p-0'} overflow-hidden right-0 w-full flex flex-col gap-2 bg-gray outline-4 transition-height duration-200`}>
                                    { page.subPages.map((subPage, subIndex) => (
                                        <li key = {[index,subIndex].join('')}>
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

export default NavbarContentMobile;
