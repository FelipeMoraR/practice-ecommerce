import { UseAuthActionContext } from "../../contexts/authAction.context";
import { FormLoginValues, loginSchema } from "../../models/schemas";
import Loader from "../../components/loader/loader";
import Form from "../../components/form/form";
import Text from "../../components/text/text";
import { UseAuthValidateSessionContext } from "../../contexts/authValidation.context";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { fetchLoginUser, isLoadingLogin, errorLogin } = UseAuthActionContext();
    const { deviceId } = UseAuthValidateSessionContext();
    const navigate = useNavigate();
    
    const onSubmit = async (data: FormLoginValues) => {
        await fetchLoginUser(data);
        navigate('/profile');
    }

    return (
        <>
            {isLoadingLogin && <Loader text="loading" />}

            <section className="mx-auto my-6 flex flex-col p-4">
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
            </section>
        </>
        
    )
}

export default LoginPage;
