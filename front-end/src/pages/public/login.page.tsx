import { UseAuthActionContext } from "../../contexts/authAction.context";
import { UseAuthValidateSessionContext } from "../../contexts/authValidation.context";
import { UseAxiosContext } from "../../contexts/axios.context";
import { FormLoginValues, loginSchema } from "../../models/schemas";
import Loader from "../../components/loader/loader";
import Form from "../../components/form/form";

const LoginPage = () => {
    const { api } = UseAxiosContext();
    const { userIsLoged, userData, errorValidationSession } = UseAuthValidateSessionContext();
    const { fetchLoginUser, isLoadingLogin, errorLogin } = UseAuthActionContext();

    const fetchProtected = async () => {
        try {
            const response = await api.get('/users/get-user');
            console.log('response protected =>', response);
            return;
        } catch(error) {
            console.error('Error in protected fetch', error);
            return;
        }
    }

    const onSubmit = (data: FormLoginValues) => fetchLoginUser(data);

    if (isLoadingLogin) {
        return (
            <Loader text="Loading login"/>
        )
    }

    return (
        <>
            <h1 className="mt-2 text-gray-700">Form :D</h1>
            <Form 
                mode="onBlur"
                schema={loginSchema}
                defaultValues={ {email: '', password: '', deviceId: 1} }
                onSubmit={onSubmit}
                fields={[
                {
                    name: 'email',
                    label: 'Test email',
                    type: 'text'
                },
                {
                    name: 'password',
                    label: 'Test password',
                    type: 'text'
                }
                ]}
            />
            {errorLogin && <p>{errorLogin}</p>}
            {errorValidationSession && <p>{errorValidationSession}</p>}
            { userIsLoged && userData && (
                <>
                <h2>You're logged maaan {userData.userFullName}</h2>
                <button onClick={() => {fetchProtected()}}>fech protected</button> 
                </>
            )}
        </>
    )
}

export default LoginPage;
