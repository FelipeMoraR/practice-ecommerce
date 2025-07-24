import { AxiosResponse } from "axios";
import { useEffect, useState } from "react"

type IAutoCall = boolean | null;
type IUseApi<T> = Promise<AxiosResponse<T>>;

const useApi = <T>(promise: IUseApi<T>, autoCall: IAutoCall)  => {
    const [ apiIsLoading, setApiIsLoading ] = useState<boolean>(false);
    const [ errorApi, setErrorApi ] = useState<string | null>(null);
    const [ responseApi, setResponseApi ] = useState<AxiosResponse<T> | null>(null)

    const callApi = async () => {
        try {
            setApiIsLoading(true);
            const response: AxiosResponse<T> = await promise;
            if (response.status !== 200) {
                setApiIsLoading(false);
                setErrorApi(`Unexpected status code: ${response.status}`);
                return;
            }
            setResponseApi(response);
        } catch (error) {
            console.log('Error in use api: ', error);
            setErrorApi(error instanceof Error ? error.message : String(error));
            throw error;
        } finally {
            setApiIsLoading(false)
        }
    }
    
    useEffect(() => {
        if (autoCall) callApi();
    }, [autoCall]);

    return {apiIsLoading, errorApi, responseApi}
}

export default useApi;
