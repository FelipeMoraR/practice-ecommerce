import { AxiosResponse } from "axios";
import { useEffect, useState, useCallback } from "react";


// FIXME add a limiter per minute
const useApi = <T>(promiseFn: () => Promise<AxiosResponse<T>>, autoCall: boolean = false) => { // ANCHOR when you pass a promise as a parameter the promise will be executed anyways so we have to send a function that execute the promise not the promise it self

  const [apiIsLoading, setApiIsLoading] = useState(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [responseApi, setResponseApi] = useState<AxiosResponse<T> | null>(null);

  const callApi = useCallback(async () => {
    try {
      console.log('call');
      setApiIsLoading(true);
      setErrorApi(null);
      const response = await promiseFn();
      setResponseApi(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorApi(message);
    } finally {
      setApiIsLoading(false);
    }
  }, [promiseFn]);

  useEffect(() => {
    if (autoCall) {
      callApi();
    }
    // Only run on mount if autoCall is true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCall]);

  return { apiIsLoading, errorApi, responseApi, callApi };
};

export default useApi;