import Loader from "../../components/loader/loader";
import { useSearchParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { createCustomAxios } from "../../services/axios.service";
import { Navigate } from "react-router-dom";
import { IApi } from "../../models/types/api.model";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const api = createCustomAxios(import.meta.env.VITE_ENDPOINT_BACKEND);
    const token = searchParams.get('token');
    const { errorApi, responseApi, apiIsLoading } = useApi<IApi, null>(() => api.post(`users/confirm-email/${token}`), true);
    
    if(!token) return <Navigate to="/login" state={{ data: null, error: 'Token not provided/invalid' }} replace /> 
    
    if(apiIsLoading) return <Loader text="Verifying email"/>
    
    if (errorApi === 'Not Modified') return <Navigate to="/login" state={{ data: {status: 304, message: 'User is verified, please login.'}, error: null }} replace /> 

    if(errorApi) return <Navigate to="/login" state={{ data: null, error: errorApi }} replace />
    
    

    return <Navigate to="/login" state={{ data: responseApi?.data, error: null }} replace /> 
}

export default VerifyEmail;