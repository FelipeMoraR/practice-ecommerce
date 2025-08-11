import { UseAuthActionContext } from "../../contexts/authAction.context";
import { FormLoginValues, loginSchema } from "../../models/schemas";
import Loader from "../../components/loader/loader";
import Form from "../../components/form/form";
import Text from "../../components/text/text";
import Modal from "../../components/modal/modal";
import useModal from "../../hooks/useModal";
import { UseAuthValidateSessionContext } from "../../contexts/authValidation.context";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "../../components/button/button";



const LoginPage = () => {
    const { fetchLoginUser, isLoadingLogin, errorLogin, setErrorLogin } = UseAuthActionContext();
    const { deviceId } = UseAuthValidateSessionContext();
    const { showModal, hideModal, modalIsOpen } = useModal();

    const location = useLocation();
    const navigate = useNavigate();

    const onSubmit = async (data: FormLoginValues) => fetchLoginUser(data);
    
    useEffect(() => {
        setErrorLogin(null); // NOTE this is because the redirect not re render the UseAuthActionContext
        if(location.state && location.state.error) showModal('verifyAccountModalError');
        if(location.state && location.state.data) showModal('verifyAccountModalResult');
    }, [location.state, showModal, setErrorLogin]);
    
    // TODO Do the interval to resend the email

    return (
        <>
            {location.state && location.state.error && (
                <Modal header={<Text text='Verify account' color="black" size="3xl" typeText="strong"/>} body={<Text text={`${location.state.error}`} color="black" size="base" typeText="p"/>} hideModal={hideModal} isOpen={modalIsOpen('verifyAccountModalError')} />
            )}
            {location.state && location.state.data && location.state.data.message && (
                <Modal header={<Text text='Verify account' color="black" size="3xl" typeText="strong"/>} body={<Text text={`${location.state.data.message}`} color="black" size="base" typeText="p"/>} hideModal={hideModal} isOpen={modalIsOpen('verifyAccountModalResult')} />
            )}
            
            {isLoadingLogin && <Loader text="loading" />}

            <section className="mx-auto my-6 flex flex-col p-4 gap-3">
                <div>
                    <div className="bg-gray outline-4 outline-black-darkest border-t-4 border-l-4 border-black-lighter w-fit p-1">
                        <Text typeText="h1" color="white" text="Login" size="2xl"/>
                    </div>
                    <Form 
                        styleForm="primary"
                        mode="onBlur"
                        schema={loginSchema}
                        defaultValues={ {email: '', password: '', deviceId} }
                        onSubmit={onSubmit}
                        fields={[
                        {
                            name: 'email',
                            label: 'Email',
                            type: 'text',
                            placeholder: 'Insert email'
                        },
                        {
                            name: 'password',
                            label: 'Password',
                            type: 'password',
                            placeholder: 'Insert password'
                        }
                        ]}
                        gridCols={1}
                        errorSubmit={errorLogin}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3 min-h-[40px]">
                        <Button typeBtn='button' typeStyleBtn="primary-neutral" onClickBtn={() => navigate('/register')} textBtn="Sign up!"/>

                        <Button typeBtn='button' typeStyleBtn="secondary-neutral" onClickBtn={() => navigate('/forgot-password')} textBtn="Password reset"/>
                    </div>
                </div>
            </section>
        </>
        
    )
}

export default LoginPage;
