import { Navigate, Outlet } from "react-router-dom";
import { UseAuthValidateSessionContext } from "../../contexts/authValidation.context";



const PublicRoute = () => {
    const { userIsLoged } = UseAuthValidateSessionContext();

    if (userIsLoged) {
        return <Navigate to='/profile' replace />
    }
        
    return <Outlet/>;
}

export default PublicRoute;