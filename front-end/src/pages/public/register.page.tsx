import Form from "../../components/form/form";
import Loader from "../../components/loader/loader";
import useApi from "../../hooks/useApi";
import { UseAxiosContext } from "../../contexts/axios.context";
import { registerSchema } from "../../models/schemas";
import Text from "../../components/text/text";
import Modal from "../../components/modal/modal";
import useModal from "../../hooks/useModal";
import Button from "../../components/button/button";
import { useNavigate } from "react-router-dom";
import { ErrorApi } from "../../models/types/api.model";

interface IDataRegister {
    email: string;
    password: string;
    name: string;
    lastName: string;
}

interface IResponse {
    status: number;
    message: string;
}

const Register = () => {
    const { api } = UseAxiosContext();
    const { responseApi, apiIsLoading, callApi, errorApi } = useApi<IResponse, IDataRegister>((data) => api.post('/users/register', data));
    const { showModal, hideModal, modalIsOpen } = useModal();
    const navigate = useNavigate();

    const fetchRegister = async (data: IDataRegister) => {
        const response = await callApi(data);
        if(response instanceof ErrorApi) return;
        if (response.data.status === 200) {
            showModal('registerModal');
            return;
        }
    }

    return (
        <>  
            { apiIsLoading && <Loader text="Saving user"/> }
            { <Modal 
                header={<Text text="Registered!" color="black" size="2xl" typeText="strong"/>} 
                body={<Text text={`${responseApi?.data.message}, please check and verify your email.`} 
                color="black" size="base" typeText="em"/>} 
                hideModal={hideModal} 
                isOpen={modalIsOpen('registerModal')}/> 
            }

            <section className="mx-auto my-6 flex flex-col p-4 gap-3">
                <div>
                    <div className="bg-gray-lightest outline-4 outline-black-darkest border-t-4 border-l-4 border-gray-lighter w-fit p-1">
                        <Text typeText="h1" color="black" text="Register" size="2xl"/>
                    </div>

                    <Form
                        mode="all"
                        schema={registerSchema}
                        styleForm = 'primary'
                        onSubmit={fetchRegister}
                        fields={[
                            {
                                name: 'email',
                                label: 'Email',
                                type: 'text',
                                placeholder: 'Insert email',
                                inputStyle: 'primary'
                            },
                            {
                                name: 'password',
                                label: 'Password',
                                type: 'password',
                                placeholder: 'Insert password',
                                inputStyle: 'primary'
                            },
                            {
                                name: 'confirmPassword',
                                label: 'Confirm password',
                                type: 'password',
                                placeholder: 'Insert confirm password',
                                inputStyle: 'primary'
                            },
                            {
                                name: 'name',
                                label: 'Name',
                                type: 'text',
                                placeholder: 'Insert name',
                                inputStyle: 'primary'
                            },
                            {
                                name: 'lastName',
                                label: 'Lastname',
                                type: 'text',
                                placeholder: 'Insert lastName',
                                inputStyle: 'primary'
                            },
                        ]}
                        gridCols={2}
                        defaultValues={ {email: '', password: '', confirmPassword: '', lastName: '', name: ''} }
                        errorSubmit={errorApi}
                    />
                </div>
                
                <div>
                    <Button typeBtn="button" typeStyleBtn="primary-neutral" textBtn="You already have an account? Sing up!" onClickBtn={() => navigate('/login')} />
                </div>
            </section>
        </>
    )
}

export default Register;