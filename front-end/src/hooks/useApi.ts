import { AxiosResponse } from "axios";
import { useEffect, useState, useCallback } from "react";

const useApi = <T>(promise: Promise<AxiosResponse<T>>, autoCall: boolean = false) => {
  const [apiIsLoading, setApiIsLoading] = useState(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [responseApi, setResponseApi] = useState<AxiosResponse<T> | null>(null);

  const callApi = useCallback(async () => {
    try {
      setApiIsLoading(true);
      setErrorApi(null);
      const response = await promise;
      setResponseApi(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorApi(message);
    } finally {
      setApiIsLoading(false);
    }
  }, [promise]);

  useEffect(() => {
    if (autoCall) callApi();
  }, [autoCall, callApi]);

  return { apiIsLoading, errorApi, responseApi, callApi };
};

export default useApi;