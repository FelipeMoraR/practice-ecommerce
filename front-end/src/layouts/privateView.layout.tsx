import { ReactNode } from "react";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";

const PrivateViewLayout = ({ children }: { children: ReactNode}) => {
    return (
        <>
            <Navbar />
            
            {children}

            <Footer />
        </>
    )
}

export default PrivateViewLayout;
