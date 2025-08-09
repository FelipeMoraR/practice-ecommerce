import Form from "../../components/form/form";
import Text from "../../components/text/text";
import useApi from "../../hooks/useApi";
import { forgotPasswordSquema, FormForgotPasswordValues } from "../../models/schemas/forgotpassword.schema.model";
import { UseAxiosContext } from "../../contexts/axios.context";
import Loader from "../../components/loader/loader";
import Modal from "../../components/modal/modal";
import useModal from "../../hooks/useModal";
import { UseAuthValidateSessionContext } from "../../contexts/authValidation.context";
import { IApi } from "../../models/types/api.model";
import Button from "../../components/button/button";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const { api } = UseAxiosContext();
    const { apiIsLoading, callApi, errorApi, responseApi } = useApi<IApi, FormForgotPasswordValues>((data) => api.post('/users/send-email-forgot-password', data))
    const { showModal, hideModal, modalIsOpen } = useModal();
    const { deviceId } = UseAuthValidateSessionContext();
    const navigate = useNavigate();

    const onSubmit = async (data: FormForgotPasswordValues) => {
        const response = await callApi(data);
        if(response && response.status === 200) showModal('forgotPasswordModal');   
    }

    return (
        <>
            { apiIsLoading && <Loader text="Sending email" /> }

            <Modal 
                header = { <Text text="Forgot passowrd" color="black" size="2xl" typeText="strong" /> } 
                body = { <Text text={`${responseApi?.data?.message}`} color="black" size="base" typeText="em" /> } 
                hideModal={ hideModal } 
                isOpen = { modalIsOpen('forgotPasswordModal') }
            />

            <section className="mx-auto my-6 flex flex-col p-4 gap-3">
                <div>
                    <div className="bg-gray outline-4 outline-black-darkest border-t-4 border-l-4 border-black-lighter w-fit p-1">
                        <Text typeText="h1" color="white" text="Forgot Password" size="2xl"/>
                    </div>
                    
                    <Form 
                        styleForm="primary"
                        defaultValues={{ email: '', deviceId: deviceId}}
                        errorSubmit={errorApi}
                        fields={[
                            {
                                name: 'email',
                                label: 'Email',
                                type: 'text',
                                placeholder: 'Insert email',
                                inputStyle: 'primary'
                            }
                            ]}
                        gridCols={1}
                        mode="all"
                        onSubmit={onSubmit}
                        schema={forgotPasswordSquema}
                    />
                </div>

                <div>
                    <Button typeStyleBtn="secondary-neutral" typeBtn="button" onClickBtn={() => navigate('/login')} textBtn="Remember your password? Login!" />
                </div>
            </section>
        </>
    )
}

export default ForgotPassword;
