import Form from "../../components/form/form";
import Loader from "../../components/loader/loader";
import useApi from "../../hooks/useApi";
import { UseAxiosContext } from "../../contexts/axios.context";
import { registerSchema } from "../../models/schemas";
import Text from "../../components/text/text";
import Modal from "../../components/modal/modal";
import useModal from "../../hooks/useModal";

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

    const fetchRegister = async (data: IDataRegister) => {
        const response = await callApi(data);
        if (response && response.data.status === 200) {
            showModal('registerModal');
            return;
        }
    }

    // FIXME pass the grid class to group better the form
    return (
        <>  
            { apiIsLoading && <Loader text="Saving user"/> }
            { <Modal 
                header={<Text text="Registered!" color="black" size="2xl" typeText="strong"/>} 
                body={<Text text={`${responseApi?.data.message}, please verify your email.`} 
                color="black" size="base" typeText="em"/>} 
                hideModal={hideModal} 
                isOpen={modalIsOpen('registerModal')}/> 
            }

            <section className="mx-auto my-6 flex flex-col p-4">
                <div className="bg-gray-lightest outline-4 outline-black-darkest border-t-4 border-l-4 border-gray-lighter w-fit p-1">
                    <Text typeText="h1" color="black" text="Register" size="2xl"/>
                </div>

                <Form
                    mode="all"
                    schema={registerSchema}
                    styleForm = 'secondary'
                    onSubmit={fetchRegister}
                    fields={[
                        {
                            name: 'email',
                            label: 'Email',
                            type: 'text',
                            placeholder: 'Insert email',
                            inputStyle: 'secondary'
                        },
                        {
                            name: 'password',
                            label: 'Password',
                            type: 'password',
                            placeholder: 'Insert password',
                            inputStyle: 'secondary'
                        },
                        {
                            name: 'confirmPassword',
                            label: 'Confirm password',
                            type: 'password',
                            placeholder: 'Insert confirm password',
                            inputStyle: 'secondary'
                        },
                        {
                            name: 'name',
                            label: 'Name',
                            type: 'text',
                            placeholder: 'Insert name',
                            inputStyle: 'secondary'
                        },
                        {
                            name: 'lastName',
                            label: 'Lastname',
                            type: 'text',
                            placeholder: 'Insert lastName',
                            inputStyle: 'secondary'
                        },
                    ]}
                    gridCols={2}
                    defaultValues={ {email: '', password: '', confirmPassword: '', lastName: '', name: ''} }
                    errorSubmit={errorApi}
                />
            </section>
        </>
    )
}

export default Register;