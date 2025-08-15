import Text from "../../components/text/text";
import { useEffect, useRef, useState } from "react";
import useApi from "../../hooks/useApi";
import { UseAxiosContext } from "../../contexts/axios.context";
import Loader from "../../components/loader/loader";
import { IApi, ErrorApi } from "../../models/types/api.model";
import Button from "../../components/button/button";
import { FormUpdateBasicUserInfoValues } from "../../models/schemas/updateBasicUserInfo.schema.model";
import { FormAddAddressValues, FormUpdateAddressValues } from "../../models/schemas/address.schema.model";
import Modal from "../../components/modal/modal";
import useModal from "../../hooks/useModal";
import { FormUpdateProfilePassword } from "../../models/schemas/profileUpdatePassword.schema";
import { FormUpdatePhone } from "../../models/schemas/phone.schema.model";
import UpdateBasicInfoView from "../../components/user/updateBasicInfo/updateBasicInfo";
import { options, IUserInfo, regionCommune } from "../../models/types/profileUser.model";
import UpdatePhone from "../../components/user/updatePhone/updatePhone";
import UpdatePassword from "../../components/user/updatePassword/updatePassword";
import MainAddress from "../../components/user/addressLogic/mainAddress";
import CardInfo from "../../components/cardInfo/cardInfo";

type responseModal = {
    title: string;
    body: string;
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



const Profile = () => {
    const { api } = UseAxiosContext();
    const { showModal, hideModal, modalIsOpen } = useModal();
    const [ addressCount, setAddressCount ] = useState<number>(0);
    const [ addressToEdit, setAddressToEdit ] = useState<Array<string>>([]);
    const [ textModalResult, setTextModalResult ] = useState<responseModal | null>(null);
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
        apiIsLoading: UpdateBasicInfoIsLoading,
        callApi: callUpdateBasicInfo,
        errorApi: errorUpdateBasicInfo
    } = useApi<IApi, FormUpdateBasicUserInfoValues>((data) => api.patch('users/update-basic-user-info', data));
    const updatedBasicInfoConfirmed = useRef<boolean>(false);

    const {
        apiIsLoading: addAddressIsLoading,
        callApi: callAddAddress,
        errorApi: errorAddAddress
    } = useApi<IInfoRegionCommune, unknown>((data) => api.post('/users/add-user-address', data));
    
    const {
        apiIsLoading: deleteAddressIsLoading,
        callApi: callDeleteAddress,
    } = useApi<IApi, unknown>((idAddress) => api.delete(`/users/delete-user-address/${idAddress}`));

    const {
        apiIsLoading: updateAddressIsLoading,
        callApi: callUpdateAddress,
        errorApi: errorUpdateAddress,
        setErrorApi: setErrorUpdateAddress
    } = useApi<IInfoRegionCommune, unknown>((data) => api.patch('/users/update-user-address', data));
    
    const {
        apiIsLoading: updatePasswordIsLoading,
        callApi: callUpdatePassword,
        errorApi: errorUpdatePassword
    } = useApi<IApi, unknown>((data) => api.patch('/users/update-password-user', data));
    const updatedProfilePassword = useRef<boolean>(false);

    const {
        apiIsLoading: updatePhoneIsLoading,
        callApi: callUpdatePhone,
        errorApi: errorUpdatePhone
    } = useApi<IApi, unknown>((data) => api.put('/users/update-user-phone', data));

    const customHideModal = () => {
        hideModal();
        setTextModalResult(null);
    }

    const changeStatusForm = (option: options) => setShowForm(prev => ({ ...prev, [option]: !prev[option] }))
    
    const updateBasicInfoUser = async (data:FormUpdateBasicUserInfoValues) => {
        if(!updatedBasicInfoConfirmed.current) {
            showModal('updateBasicInfoModal');
            return
        }
        const result = await callUpdateBasicInfo(data);
        if(result instanceof ErrorApi) {
            setTextModalResult({
                title: 'Error updating basic data',
                body: result.error
            });
            showModal('resultResponse');
            return;
        }
        if (result?.status === 200) {
            setUserInfo(prev => prev ? { ...prev, name: data.name, lastname: data.lastName } : undefined);
            setShowForm(prev => ({...prev, basicInfo: false }));
            setTextModalResult({
                title: 'Result updating basic data',
                body: result.data.message
            });
            showModal('resultResponse');
            return;
        }
        
    }

    const addAddress = async (data: FormAddAddressValues) => {
        const dataParsed = {
            ...data,
            number: Number(data.number),
            numDpto: Number(data.numDpto)
        }
        
        const result = await callAddAddress(dataParsed);
        if(result instanceof ErrorApi){
            setTextModalResult({
                title: 'Error adding an address',
                body: result.error
            });
            showModal('resultResponse');
            return;
        }
        if(result.status === 200) {
            // NOTE I refresh the info of the user because i need the correct id of the address.
            // FIXME the backend must return the address added to avoid this bellow.
            callUserInfo();
            setShowForm(prev => ({...prev, address: false}));
            setTextModalResult({
                title: 'Result adding an address',
                body: result.data.message
            });
            showModal('resultResponse');
            return;
        }
        
    }

    const deleteAddress = async (id: string) => {
        const result = await callDeleteAddress(id);
        if(result instanceof ErrorApi) {
            setTextModalResult({
                title: 'Result deleting address',
                body: result.error
            });
            showModal('resultResponse');
            return;
        }
        if(result.status === 200){
            callUserInfo();
            setTextModalResult({
                title: 'Result deleting address',
                body: result.data.message
            });
            showModal('resultResponse');
            return;
        }
        
    }
    
    const updateAddress = async (data: FormUpdateAddressValues) => {
        const dataParsed = {
            ...data,
            number: Number(data.number),
            numDpto: Number(data.numDpto)
        }
        
        const result = await callUpdateAddress(dataParsed);
        if(result instanceof ErrorApi){
            setTextModalResult({
                title: 'Error updating address',
                body: result.error
            });
            showModal('resultResponse');
            return;
        }
        if(result.status === 200) {
            // NOTE I refresh the info of the user because i need the correct id of the address.
            // FIXME the backend must return the address added to avoid this bellow.
            callUserInfo();
            setShowForm(prev => ({...prev, address: false}));
            setAddressToEdit(prev => prev.filter(el => el !== data.idAddress));
            setTextModalResult({
                title: 'Result updating address',
                body: result.data.message
            });
            showModal('resultResponse');
            return;
        }
    }

    const updateProfilePassword = async (data: FormUpdateProfilePassword) => {
        if(!updatedProfilePassword.current) {
            showModal('updateProfilePassword');
            return;
        }
        const result = await callUpdatePassword(data);
        if(result instanceof ErrorApi){
            setTextModalResult({
                title: 'Error updating password',
                body: result.error
            });
            showModal('resultResponse');
            updatedProfilePassword.current = false;
            return;
        }
        if(result.status === 200) {
            callUserInfo();
            setShowForm(prev => ({...prev, password: false}));
            setTextModalResult({
                title: 'Result updating password',
                body: `${result.data.message}, redirecting...`
            });
            showModal('resultResponse');
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000)

            return;
        }
    }

    const updatePhone = async (data: FormUpdatePhone) => {
        const result = await callUpdatePhone(data);
        if(result instanceof ErrorApi){
            setTextModalResult({
                title: 'Error updating phone',
                body: result.error
            });
            showModal('resultResponse');
            updatedProfilePassword.current = false;
            return;
        }
        if(result.status === 200) {
            callUserInfo();
            setShowForm(prev => ({...prev, phone: false}));
            setTextModalResult({
                title: 'Result updating phone',
                body: result.data.message
            });
            showModal('resultResponse');
            return;
        }
    }

    // NOTE To capture the entry data
    useEffect(() => {
        setUserInfo(responseUserInfo?.data.user);
        setAddressCount(responseUserInfo ? responseUserInfo.data.user.addresses.length : 0);
    }, [responseUserInfo]);

    // NOTE To capture communes
    useEffect(() => {
        setCommune(responseAllCommune?.data.data);
    }, [responseAllCommune]);

    // NOTE Controll error updating basic data user
    useEffect(() => {
        if(errorUpdateBasicInfo && errorUpdateBasicInfo.status === 403) setShowForm(prev => ({...prev, basicInfo: false}));
    }, [errorUpdateBasicInfo]);

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

    if (userInfoError || allCommuneError) {
        return (
            <section className="flex flex-col gap-3 mx-auto p-2 my-3">
                <Text text="Profile" color="black" size="3xl" typeText="h1"/>

                <CardInfo 
                    header = {<Text text='Error loading data' color="black" size="3xl" typeText="p"/>}
                    body = {<Text text='Please try again later.' color="black" size="base" typeText="em"/>}
                    typeCard={2}
                />
            </section> 
        )
    }

    return (
        <>  
            <Modal 
                header = {<Text text="Are you shure to update this values?" color="black" size="2xl" typeText="strong" />} 
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
                header = {<Text text="Are you shure change your password?" color="black" size="2xl" typeText="strong" />} 
                body = {
                    <div className="flex flex-col gap-3">
                        <Text text="This action will log out you and close all session associate to this account" color="black" size="base" typeText="em" />
                        <div className="flex gap-3">
                            <Button 
                            typeBtn="button" 
                            typeStyleBtn="secondary-green" 
                            onClickBtn={() => {
                                updatedProfilePassword.current = true; 
                                hideModal();
                            }} 
                            textBtn="I understand"/>
                            <Button 
                            typeBtn="button" 
                            typeStyleBtn="secondary-red" 
                            onClickBtn={hideModal} 
                            textBtn="Discard"/>
                        </div>
                    </div>
                } 
                hideModal={hideModal} 
                isOpen={modalIsOpen('updateProfilePassword')} 
            />
            
            <Modal
                header = {<Text text={textModalResult ? textModalResult.title : ''} color="black" size="lg" typeText="strong" />}
                body={<Text text={textModalResult ? textModalResult.body : ''} color="black" size="base" typeText="em" />}
                hideModal={customHideModal}
                isOpen = {modalIsOpen('resultResponse')}
            />

            <section className="flex flex-col mx-auto p-2 my-3 gap-6">
                <div className="w-full text-center">
                    <Text text="Profile" color="black" size="4xl" typeText="strong"/>
                </div>
                
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 max-w-[1300px]">
                    <div className="flex flex-col gap-6">                        
                        { UpdateBasicInfoIsLoading ? (<Loader isFullScreen = {false} text="Updating values" />) : (
                            <UpdateBasicInfoView 
                                userInfo={userInfo}
                                changeStatusForm={changeStatusForm}
                                errorUpdateBasicInfo={errorUpdateBasicInfo}
                                isActive = {showForm.basicInfo}
                                submitUpdateBasicInfoUser={updateBasicInfoUser} 
                            />
                        )}
                            
                        { updatePhoneIsLoading ? (<Loader isFullScreen = {false} text="Updating phone" />) : (
                            <UpdatePhone 
                                userInfo={userInfo}
                                changeStatusForm={changeStatusForm}
                                errorUpdatePhone={errorUpdatePhone}
                                isActive = {showForm.phone}
                                submitUpdatePhoner={updatePhone}
                            />
                        )}                        
                        
                        { updatePasswordIsLoading ? (<Loader isFullScreen = {false} text="Updating password" />) : (
                            <UpdatePassword 
                                changeStatusForm={changeStatusForm}
                                errorUpdatePassword={errorUpdatePassword}
                                isActive = {showForm.password}
                                submitUpdatePassword={updateProfilePassword}
                            />
                        )} 
                    </div>

                    
                    {deleteAddressIsLoading && (<Loader text="Deleting address"/>)}
                    {addAddressIsLoading ? (<Loader text="Adding a new address" isFullScreen = {false} />) : (
                        <MainAddress 
                            userInfo={userInfo}
                            addressCount={addressCount}
                            addressToEdit={addressToEdit}
                            changeStatusForm={changeStatusForm}
                            commune={commune}
                            deleteAddress={deleteAddress}
                            errorAddAddress={errorAddAddress}
                            errorUpdateAddress={errorUpdateAddress}
                            isActive={showForm.address}
                            setAddressToEdit={setAddressToEdit}
                            setErrorUpdateAddress={setErrorUpdateAddress}
                            submitAddAddress={addAddress}
                            submitUpdateAddres={updateAddress}
                            updateAddressIsLoading={updateAddressIsLoading}
                        />
                    )} 
                </div>
            </section>
        </>
    )
}

export default Profile;