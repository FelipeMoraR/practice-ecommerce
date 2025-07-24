import { ReactNode } from "react";
import { UseAuthValidateSessionContext } from "../../contexts/authValidation.context";
import { Navigate } from "react-router-dom";;

const PrivateRoute = ({ children }: { children: ReactNode}) => {
    const { userIsLoged } = UseAuthValidateSessionContext(); 

    if (!userIsLoged) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;
