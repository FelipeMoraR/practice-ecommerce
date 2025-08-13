import Text from "../../components/text/text";
import CardInfo from "../../components/cardInfo/cardInfo";
import { useEffect, useRef, useState } from "react";
import useApi from "../../hooks/useApi";
import { UseAxiosContext } from "../../contexts/axios.context";
import Loader from "../../components/loader/loader";
import { IApi } from "../../models/types/api.model";
import Button from "../../components/button/button";
import Form from "../../components/form/form";
import { updateBasicUserInfoSchema, FormUpdateBasicUserInfoValues } from "../../models/schemas/updateBasicUserInfo.schema.model";
import { addAddressSquema, FormAddAddressValues } from "../../models/schemas/addAddress.schema.model";
import Modal from "../../components/modal/modal";
import useModal from "../../hooks/useModal";


type options = 'basicInfo' | 'phone' | 'password' | 'address';

type IUserInfo = {
    addresses: Array<IAddress>;
    email: string;
    isVerified: boolean;
    lastname: string;
    name: string;
    phone: string | null;
}

type regionCommune = {
    id: number;
    name: string
}

interface IInfoRegionCommune extends IApi {
    data: Array<regionCommune>
}

interface IResponseUser extends IApi {
    user: IUserInfo;
}

interface ISectionToUpdate {
    basicInfo: boolean;
    phone: boolean;
    password: boolean;
    address: boolean;
}

interface IAddress {
    street: string;
    number: number;
    numDpto: number;
    postalCode: string;
    idCommune: number;
}

const Profile = () => {
    const { api } = UseAxiosContext();
    const { showModal, hideModal, modalIsOpen } = useModal();
    const [showForm, setShowForm] = useState<ISectionToUpdate>({
        basicInfo: false,
        phone: false,
        password: false,
        address: false,
    });

    const { 
        responseApi: responseUserInfo, 
        apiIsLoading: userInfoIsLoading,
        errorApi: userInfoError,
        callApi: callUserInfo
    } = useApi<IResponseUser, undefined>(() => api.get('users/get-user'), true);
    const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);

    const { 
        responseApi: responseAllCommune, 
        apiIsLoading: allCommuneIsLoading,
        errorApi: allCommuneError
    } = useApi<IInfoRegionCommune, undefined>(() => api.get('address/all-communes'), true);
    const [commune, setCommune] = useState<Array<regionCommune> | undefined>(undefined);

    const {
        responseApi: responseUpdateBasicInfo,
        apiIsLoading: UpdateBasicInfoIsLoading,
        callApi: callUpdateBasicInfo,
        errorApi: errorUpdateBasicInfo
    } = useApi<IApi, FormUpdateBasicUserInfoValues>((data) => api.patch('users/update-basic-user-info', data));
    const updatedBasicInfoConfirmed = useRef<boolean>(false);

    const {
        responseApi: responseAddAddress,
        apiIsLoading: addAddressIsLoading,
        callApi: callAddAddress,
        errorApi: errorAddAddress
    } = useApi<IInfoRegionCommune, unknown>((data) => api.post('/users/add-user-address', data));
    

    const changeStatusForm = (option: options) => setShowForm(prev => ({ ...prev, [option]: !prev[option] }))
    
    const updateBasicInfoUser = async (data:FormUpdateBasicUserInfoValues) => {
        if(!updatedBasicInfoConfirmed.current) {
            showModal('updateBasicInfoModal');
            return
        }
        const result = await callUpdateBasicInfo(data);
        if (result?.status === 200) setUserInfo(prev => prev ? { ...prev, name: data.name, lastname: data.lastName } : undefined)
    }

    const addAddress = async (data: FormAddAddressValues) => {
        const dataParsed = {
            ...data,
            number: Number(data.number),
            numDpto: Number(data.numDpto)
        }
        
        const result = await callAddAddress(dataParsed);
        if(result?.status === 200) callUserInfo();
    }

    // NOTE To capture the entry data
    useEffect(() => {
        setUserInfo(responseUserInfo?.data.user);
    }, [responseUserInfo]);

    // NOTE To capture communes
    useEffect(() => {
        setCommune(responseAllCommune?.data.data);
    }, [responseAllCommune, responseUpdateBasicInfo]);

    // NOTE To controll the view of modal
    useEffect(() => {
        if(responseUpdateBasicInfo) {
            showModal('resultUpdateBasicInfo');
        } 
        else if(responseAddAddress) {
            hideModal();
            showModal('resultAddAddress');
        }
    }, [responseUpdateBasicInfo, responseAddAddress, showModal, hideModal]);
    
    if (userInfoIsLoading || allCommuneIsLoading) {
        return (
            <> 
                <section className="flex mx-auto p-2 my-3">
                    <Text text="Profile" color="black" size="3xl" typeText="h1"/>
                </section>
                <Loader text="Preparing data" />
            </>
        )
    }

    if (userInfoError) {
        return (
            <h1>ERROR LOADING USER INFO {userInfoError.status} {userInfoError.error}</h1>
        )
    }

    if (allCommuneError) {
        return (
            <h1>ERROR LOADING all communes</h1>
        )
    }

    return (
        <>  
            <Modal 
                header = {<Text text="Are you shure to update this values?" color="black" size="lg" typeText="strong" />} 
                body = {
                    <div className="flex flex-col gap-3">
                        <Text text="Once you update any of these parameters you will not be able to do so again for 30 days." color="black" size="base" typeText="em" />
                        <div className="flex gap-3">
                            <Button typeBtn="button" typeStyleBtn="secondary-green" onClickBtn={() => {updatedBasicInfoConfirmed.current = true; hideModal();}} textBtn="Confirm"/>
                            <Button typeBtn="button" typeStyleBtn="secondary-red" onClickBtn={hideModal} textBtn="Discard"/>
                        </div>
                    </div>
                } 
                hideModal={hideModal} 
                isOpen={modalIsOpen('updateBasicInfoModal')} 
            />
                    
            <Modal
                header = {<Text text="Result updating basic information user" color="black" size="lg" typeText="strong" />}
                body={<Text text={`${responseUpdateBasicInfo?.data.message}`} color="black" size="base" typeText="em" />}
                hideModal={hideModal}
                isOpen = {modalIsOpen('resultUpdateBasicInfo')}
            />

            <Modal
                header = {<Text text="Result for adding an address" color="black" size="lg" typeText="strong" />}
                body={<Text text={`${responseAddAddress?.data.message}`} color="black" size="base" typeText="em" />}
                hideModal={hideModal}
                isOpen = {modalIsOpen('resultAddAddress')}
            />

            <section className="flex mx-auto p-2 my-3 gap-6">
                <Text text="Profile" color="black" size="3xl" typeText="h1"/>
                <div>
                    { UpdateBasicInfoIsLoading ? (<Loader isFullScreen = {false} />) : (
                        <CardInfo 
                            header = {
                                <div className="flex gap-3 justify-between">
                                    <Text text="Basic information" color="black" size="2xl" typeText="strong"/>
                                    <div className="max-w-[100px]">
                                        <Button typeBtn="button" typeStyleBtn={showForm.basicInfo ? 'primary-red' : 'primary-green'} onClickBtn={() => changeStatusForm("basicInfo")} textBtn={showForm.basicInfo ? 'Cancel' : 'Update'} />
                                    </div>
                                </div>
                            }
                            body = {
                                showForm.basicInfo ? (
                                    <div className="flex flex-col gap-2">
                                        <Form
                                            mode="all"
                                            schema={updateBasicUserInfoSchema}
                                            onSubmit={updateBasicInfoUser}
                                            defaultValues={userInfo ? {name: userInfo.name, lastName: userInfo.lastname} : {name: '', lastName: ''}}
                                            errorSubmit={errorUpdateBasicInfo}
                                            fields={[
                                                {
                                                    name: 'name',
                                                    label: 'New name',
                                                    type: 'text',
                                                    placeholder: 'Insert new name'
                                                },
                                                {
                                                    name: 'lastName',
                                                    label: 'New lastname',
                                                    type: 'text',
                                                    placeholder: 'Insert new lastname'
                                                }
                                            ]}
                                            gridCols={2}
                                            styleForm="primary"
                                        />
                                        <div className="flex items-baseline gap-1">
                                            <Text text="Email: " color="black" size="lg" typeText="strong"/>
                                            <Text text={userInfo ? userInfo.email : 'Error loading data'} color="black" size="base" typeText="p"/>
                                        </div>

                                        <div className="flex items-baseline gap-1">
                                            <Text text="User is verified?: " color="black" size="lg" typeText="strong"/>
                                            <Text text={userInfo ? userInfo.isVerified ? 'Yes' : 'No' : 'Error loading data'} color="black" size="base" typeText="p"/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-3">
                                            <div className="flex items-baseline gap-1">
                                                <Text text="Name:" color="black" size="lg" typeText="strong"/>
                                                <Text text={userInfo ? userInfo.name : 'Error loading data'} color="black" size="base" typeText="p"/>
                                            </div>

                                            <div className="flex items-baseline gap-1">
                                                <Text text="Lastname: " color="black" size="lg" typeText="strong"/>
                                                <Text text={userInfo ? userInfo.lastname : 'Error loading data'} color="black" size="base" typeText="p"/>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-baseline gap-1">
                                            <Text text="Email: " color="black" size="lg" typeText="strong"/>
                                            <Text text={userInfo ? userInfo.email : 'Error loading data'} color="black" size="base" typeText="p"/>
                                        </div>

                                        <div className="flex items-baseline gap-1">
                                            <Text text="User is verified?: " color="black" size="lg" typeText="strong"/>
                                            <Text text={userInfo ? userInfo.isVerified ? 'Yes' : 'No' : 'Error loading data'} color="black" size="base" typeText="p"/>
                                        </div>
                                        
                                    </div>
                                )
                            }
                            typeCard={1}
                        />
                    )}
                    
                </div>

                <div>
                    {addAddressIsLoading ? (<Loader text="Adding a new address" isFullScreen = {false} />) : (
                        <CardInfo 
                            header = {
                                <div className="flex gap-3 justify-between">
                                    <Text text="Addresses" color="black" size="2xl" typeText="strong"/>
                                    <div className="max-w-[100px]">
                                        <Button typeBtn="button" typeStyleBtn={showForm.address ? 'primary-red' : 'primary-green'} onClickBtn={() => changeStatusForm("address")} textBtn={showForm.address ? 'Cancel' : 'Add'} />
                                    </div>
                                </div> 
                            }
                            body = {
                                showForm.address ? (
                                    <div className="flex flex-col gap-3">
                                        <Form
                                            mode="all"
                                            schema={addAddressSquema}
                                            onSubmit={addAddress}
                                            defaultValues={{idCommune: 0, number: '1', postalCode: '', street: '', numDpto: '1'}}
                                            errorSubmit={errorAddAddress}
                                            fields={[
                                                {
                                                    type: 'select',
                                                    label: 'Commune',
                                                    name: 'idCommune',
                                                    options: commune ? [{label: '------', value: 0}, ...commune.map(el => ({label: el.name, value: el.id})) ] : []
                                                },
                                                {
                                                    type: 'number',
                                                    label: 'House number',
                                                    name: 'number',
                                                    inputStyle: 'primary',
                                                    placeholder: 'Insert number',
                                                    min: 1
                                                },
                                                {
                                                    type: 'text',
                                                    label: 'Postal code',
                                                    name: 'postalCode',
                                                    inputStyle: 'primary',
                                                    placeholder: 'Insert postal code'
                                                },
                                                {
                                                    type: 'text',
                                                    label: 'Street',
                                                    name: 'street',
                                                    inputStyle: 'primary',
                                                    placeholder: 'Insert street'
                                                },
                                                {
                                                    type: 'number',
                                                    label: 'Num dpto',
                                                    name: 'numDpto',
                                                    inputStyle: 'primary',
                                                    placeholder: 'Insert Num dpto',
                                                    min: 1
                                                }
                                            ]}
                                            gridCols={1}
                                            styleForm="primary"
                                        />

                                        <div className="flex flex-col gap-1">
                                            {responseUserInfo?.data.user.addresses.map((el, index) => (
                                                <div key = {index}>
                                                    {JSON.stringify(el)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                      
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        {responseUserInfo?.data.user.addresses.map((el, index) => (
                                            <div key = {index}>
                                                {JSON.stringify(el)}
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                            typeCard={1}
                        />
                    )}
                </div>
            </section>
        </>
    )
}

export default Profile;