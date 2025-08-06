import { UseAuthValidateSessionContext } from "../../contexts/authValidation.context";
import { Navigate } from "react-router-dom";;
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const { userIsLoged } = UseAuthValidateSessionContext(); 

    if (!userIsLoged) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet/>;
}

export default PrivateRoute;
