import { useEffect } from 'react';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';
import logo from '../assets/images/dogdoing.jpg';
import { IPageNavbarFather } from '../models/types/navbar.model';
import { UseAuthActionContext } from '../contexts/authAction.context';
import Loader from '../components/loader/loader';
import Modal from '../components/modal/modal';
import useModal from '../hooks/useModal';
import { Outlet } from 'react-router-dom';

interface IPageLayout {
    pages: IPageNavbarFather[];
}

const PageLayout = ({ pages }: IPageLayout) => {
    const { isLoadingLogout, errorLogout, setErrorLogout } = UseAuthActionContext();
    const { showModal, hideModal, modalIsOpen } = useModal();

    const handleHideErrorLogout = () => {
        hideModal();
        setErrorLogout(null);
    } 

    useEffect(() => {
        if (errorLogout) {
            showModal('logoutModal');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorLogout])

    return (
        <>
            { isLoadingLogout && <Loader text='Logout'/> }
            { <Modal header = {<h1>Logout status</h1>} body = {<p>{errorLogout?.error}</p>} isOpen = {modalIsOpen('logoutModal')} hideModal={handleHideErrorLogout} /> }

            <Navbar imgRoute = {logo} pages={pages}/>
            <Outlet/>
            <Footer />
        </>
    )
}

export default PageLayout;
