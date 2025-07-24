import { ReactNode } from 'react';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';
import logo from '../assets/images/dogdoing.jpg';
import { IPageNavbarFather } from '../models/types';

interface IPageLayout {
    pages: IPageNavbarFather[];
    children: ReactNode;
}

const PageLayout = ({ children, pages }: IPageLayout) => {
    return (
        <>
            <Navbar imgRoute = {logo} pages={pages}/>
            
            {children}

            <Footer />
        </>
    )
}

export default PageLayout;
