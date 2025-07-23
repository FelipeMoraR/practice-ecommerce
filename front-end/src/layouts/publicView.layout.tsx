import { ReactNode } from 'react';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';
import logo from '../assets/images/dogdoing.jpg';
import { IPageNavbarFather } from '../models/types';

const PublicViewLayout = ({ children }: { children: ReactNode}) => {
    const publicPages: IPageNavbarFather[] = [
        {
            anchor: 'https://www.youtube.com/watch?v=DzpmhfiBCO8',
            text: 'Home',
            subPages: null
        }, 
        {
            anchor: 'Products',
            text: 'Products',
            subPages: [
                {
                    anchor: 'Shirts',
                    text: 'Shirts'
                },
                {
                    anchor: 'Pants',
                    text: 'Pants'
                }
            ]
        },
        {
            anchor: 'Contact',
            text: 'Contact',
            subPages: [
                {
                    anchor: 'contact1',
                    text: 'contact1'
                },
                {
                    anchor: 'contact2',
                    text: 'contact2'
                },
                {
                    anchor: 'contact3',
                    text: 'contact3'
                }
            ]
        },
        {
            anchor: 'Contact',
            text: 'Contact',
            subPages: [
                {
                    anchor: 'contact1',
                    text: 'contact1'
                },
                {
                    anchor: 'contact2',
                    text: 'contact2'
                },
                {
                    anchor: 'contact3',
                    text: 'contact3'
                },
                {
                    anchor: 'contact4',
                    text: 'contact4'
                }
            ]
        },
        {
            anchor: 'Contact',
            text: 'Contact',
            subPages: [
                {
                    anchor: 'contact1',
                    text: 'contact1'
                },
                {
                    anchor: 'contact2',
                    text: 'contact2'
                },
                {
                    anchor: 'contact3',
                    text: 'contact3'
                },
                {
                    anchor: 'contact4',
                    text: 'contact4'
                },
                {
                    anchor: 'contact4',
                    text: 'contact4'
                }
            ]
        },
        {
            anchor: 'Contact',
            text: 'Contact',
            subPages: [
                {
                    anchor: 'contact1',
                    text: 'contact1'
                },
                {
                    anchor: 'contact2',
                    text: 'contact2'
                },
                {
                    anchor: 'contact3',
                    text: 'contact3'
                },
                {
                    anchor: 'contact4',
                    text: 'contact4'
                },
                {
                    anchor: 'contact4',
                    text: 'contact4'
                },
                {
                    anchor: 'contact4',
                    text: 'contact4'
                }
            ]
        },
        
    ]
    return (
        <>
            <Navbar imgRoute = {logo} pages={publicPages}/>
            
            {children}

            <Footer />
        </>
    )
}

export default PublicViewLayout;
