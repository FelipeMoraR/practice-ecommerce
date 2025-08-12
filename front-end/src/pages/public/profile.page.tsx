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
import Modal from "../../components/modal/modal";
import useModal from "../../hooks/useModal";


type options = 'basicInfo' | 'phone' | 'password' | 'address';

type IUserInfo = {
    addresses: Array<unknown>;
    email: string;
    isVerified: boolean;
    lastname: string;
    name: string;
    phone: string | null;
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

const Profile = () => {
    const { api } = UseAxiosContext();
    const { 
        responseApi: responseUserInfo, 
        apiIsLoading: userInfoIsLoading,
        errorApi: userInfoError
    } = useApi<IResponseUser, undefined>(() => api.get('users/get-user'), true);
    const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);
    
    const {
        responseApi: responseUpdateBasicInfo,
        apiIsLoading: UpdateBasicInfoIsLoading,
        callApi: callUpdateBasicInfo,
        errorApi: errorUpdateBasicInfo
    } = useApi<IApi, FormUpdateBasicUserInfoValues>((data) => api.patch('users/update-basic-user-info', data));
    const updatedBasicInfoConfirmed = useRef<boolean>(false);

    const { showModal, hideModal, modalIsOpen } = useModal();

    const [showForm, setShowForm] = useState<ISectionToUpdate>({
        basicInfo: false,
        phone: false,
        password: false,
        address: false,
    });

    const changeStatusForm = (option: options) => setShowForm(prev => ({ ...prev, [option]: !prev[option] }))
    
    const updateBasicInfoUser = async (data:FormUpdateBasicUserInfoValues) => {
        if(!updatedBasicInfoConfirmed.current) {
            showModal('updateBasicInfoModal');
            return
        }
        const result = await callUpdateBasicInfo(data);
        if (result?.status === 200) setUserInfo(prev => prev ? { ...prev, name: data.name, lastname: data.lastName } : undefined)
    }

    // NOTE To capture the entry data
    useEffect(() => {
        setUserInfo(responseUserInfo?.data.user);
    }, [responseUserInfo]);

    // NOTE To controll the view of modal
    useEffect(() => {
        if(responseUpdateBasicInfo) {
            showModal('resultUpdateBasicInfo');
        }
    }, [responseUpdateBasicInfo, showModal]);
    
    if (userInfoIsLoading) {
        return (
            <> 
                <section className="flex mx-auto p-2 my-3">
                    <Text text="Profile" color="black" size="3xl" typeText="h1"/>
                </section>
                <Loader text="Loading user data" />
            </>
        )
    }
    if (userInfoError) {
        return (
            <h1>ERROR LOADING USER INFO {userInfoError.status} {userInfoError.error}</h1>
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

            <section className="flex flex-col mx-auto p-2 my-3 gap-6">
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
            </section>
        </>
    )
}

export default Profile;