import useApi from "../../hooks/useApi";
import { IApi } from "../../models/types/api.model";
import Loader from "../../components/loader/loader";
import Form from "../../components/form/form";
import Text from "../../components/text/text";
import { resetPasswordSquema, FormResetPasswordValues } from "../../models/schemas/resetPassword.schema.model";
import { useSearchParams } from "react-router-dom";
import { UseAxiosContext } from "../../contexts/axios.context";
import { Navigate } from "react-router-dom";

interface IDataToSend extends FormResetPasswordValues {
    token: string;
    secret: string;
}

const ResetPassword = () => {
    const [ searchParams ] = useSearchParams();
    const { api } = UseAxiosContext();
    const token = searchParams.get('token');
    const secret = searchParams.get('secret');
    const { callApi, apiIsLoading, errorApi, responseApi } = useApi<IApi, IDataToSend>((data) => api.post('/users/update-password', data));
    
    const onSubmit = (formData: FormResetPasswordValues) => {
        if(!token || !secret) {
            console.error('token or secret not setted');
            return
        }

        const data = {...formData, token, secret}
        callApi(data);
    }

    if (responseApi && responseApi.data.status) {
        return <Navigate to='/login' state={{ data: {status: 200, message: 'Change password successfull, please login with the new password'}, error: null }} replace />
    }
    
    return(
        <>  
            {apiIsLoading && (
                <Loader text="Changing password"/>
            )}
            <section className="mx-auto my-6 flex flex-col p-4">
                <div className="bg-gray outline-4 outline-black-darkest border-t-4 border-l-4 border-black-lighter w-fit p-1">
                    <Text typeText="h1" color="white" text="Reset password" size="2xl"/>
                </div>
                <Form 
                    styleForm="primary"
                    mode="onBlur"
                    schema={resetPasswordSquema}
                    defaultValues={ {newPassword: '', confirmNewPassword: ''} }
                    onSubmit={onSubmit}
                    fields={[
                        {
                            name: 'newPassword',
                            label: 'New password',
                            type: 'password',
                            placeholder: 'Insert new password'
                        },
                        {
                            name: 'confirmNewPassword',
                            label: 'Confirm new password',
                            type: 'password',
                            placeholder: 'Confirm password'
                        }
                    ]}
                    gridCols={1}
                    errorSubmit={errorApi}
                />
            </section>
        </>
    )
}

export default ResetPassword;
