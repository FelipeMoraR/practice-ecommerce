import CardInfo from "../../cardInfo/cardInfo";
import Button from "../../button/button";
import Text from "../../text/text";
import Form from "../../form/form";
import Modal from "../../modal/modal";
import { addressSquema, FormAddAddressValues, FormUpdateAddressValues, updateAddressSquema  } from "../../../models/schemas/address.schema.model";
import useModal from "../../../hooks/useModal";
import { IUserInfo, options } from "../../../models/types/profileUser.model";
import { IErrorApi } from "../../../models/types/api.model";
import { regionCommune } from "../../../models/types/profileUser.model";
import Loader from "../../loader/loader";

interface IMainAddress {
    userInfo: IUserInfo | undefined;
    addressCount: number
    isActive: boolean;
    changeStatusForm: (option: options) => void;
    submitAddAddress: (data: FormAddAddressValues) => Promise<void>
    errorAddAddress: IErrorApi | null;
    commune: Array<regionCommune> | undefined;
    updateAddressIsLoading: boolean;
    addressToEdit: Array<string>;
    submitUpdateAddres: (data: FormUpdateAddressValues) => Promise<void>;
    errorUpdateAddress: IErrorApi | null;
    setAddressToEdit: React.Dispatch<React.SetStateAction<string[]>>;
    setErrorUpdateAddress: React.Dispatch<React.SetStateAction<IErrorApi | null>>;
    deleteAddress: (id: string) => Promise<void>;
}

const MainAddress = ({ 
    userInfo,
    addressCount, 
    isActive = false, 
    changeStatusForm, 
    submitAddAddress, 
    errorAddAddress, 
    commune,
    updateAddressIsLoading,
    addressToEdit,
    submitUpdateAddres,
    errorUpdateAddress,
    setAddressToEdit,
    setErrorUpdateAddress,
    deleteAddress
}: IMainAddress) => {
  const {hideModal, modalIsOpen, showModal} = useModal();

  return (
    <div className="max-w-[400px] h-fit">
      <CardInfo
        header={
          <div className="flex gap-3 justify-between">
            <Text text="Addresses" color="black" size="2xl" typeText="strong" />
            <Text
              text={`${addressCount}/3`}
              color="black"
              size="2xl"
              typeText="strong"
            />
            <div className="max-w-[100px] max-h-[30px]">
              <Button
                typeBtn="button"
                typeStyleBtn={
                  isActive
                    ? "primary-red"
                    : addressCount >= 3
                    ? "primary-red"
                    : "primary-green"
                }
                onClickBtn={() => changeStatusForm("address")}
                disabled={addressCount >= 3}
                textBtn={isActive ? "Cancel" : "Add"}
              />
            </div>
          </div>
        }
        body={
          isActive ? (
            <div className="flex flex-col gap-3">
              <Form
                mode="all"
                schema={addressSquema}
                onSubmit={submitAddAddress}
                defaultValues={{
                  idCommune: 0,
                  number: "1",
                  postalCode: "",
                  street: "",
                  numDpto: "",
                }}
                errorSubmit={errorAddAddress}
                fields={[
                  {
                    type: "select",
                    label: "Commune",
                    name: "idCommune",
                    options: commune
                      ? [
                          { label: "------", value: 0 },
                          ...commune.map((el) => ({
                            label: el.name,
                            value: el.id,
                            selected: false,
                          })),
                        ]
                      : [],
                  },
                  {
                    type: "number",
                    label: "House number",
                    name: "number",
                    inputStyle: "primary",
                    placeholder: "Insert number",
                    min: 1,
                  },
                  {
                    type: "text",
                    label: "Postal code",
                    name: "postalCode",
                    inputStyle: "primary",
                    placeholder: "Insert postal code",
                  },
                  {
                    type: "text",
                    label: "Street",
                    name: "street",
                    inputStyle: "primary",
                    placeholder: "Insert street",
                  },
                  {
                    type: "number",
                    label: "Num dpto",
                    name: "numDpto",
                    inputStyle: "primary",
                    placeholder: "Insert Num dpto",
                    min: 1,
                  },
                ]}
                gridCols={1}
                styleForm="primary"
              />

              <div className="flex flex-col gap-1">
                {userInfo?.addresses.map((el, index) => (
                  <div className="flex flex-col w-full" key={index}>
                        <div className="border-4 bg-yellow p-1">
                          <Text
                            color="black"
                            size="base"
                            text={el.commune.name}
                            typeText="strong"
                          />
                        </div>

                        <div className="border-b-4 border-l-4 border-r-4 bg-yellow p-1">
                          <div className="flex gap-1">
                            <Text
                              color="black"
                              size="base"
                              text="Street: "
                              typeText="strong"
                            />
                            <Text
                              color="black"
                              size="base"
                              text={`${el.street} ${el.number} #${el.numDpto}`}
                              typeText="p"
                            />
                          </div>

                          <div className="flex gap-1">
                            <Text
                              color="black"
                              size="base"
                              text="Postal code: "
                              typeText="strong"
                            />
                            <Text
                              color="black"
                              size="base"
                              text={el.postalCode}
                              typeText="p"
                            />
                          </div>
                        </div>
                      </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {updateAddressIsLoading && (
                <Loader text="Updating address" isFullScreen={false} />
              )}
              {userInfo?.addresses.map((el, index) => {
                if (addressToEdit.some((edit) => edit === el.id)) {
                  return (
                    <div key={index} className="flex flex-col gap-3 p-3 bg-gray-lightest border-4">
                      <Form
                        mode="all"
                        schema={updateAddressSquema}
                        onSubmit={submitUpdateAddres}
                        defaultValues={{
                          idAddress: el.id,
                          idCommune: el.commune.id,
                          number: `${el.number}`,
                          postalCode: `${el.postalCode}`,
                          street: el.street,
                          numDpto: `${el.numDpto}`,
                        }}
                        errorSubmit={errorUpdateAddress}
                        fields={[
                          {
                            type: "select",
                            label: "Commune",
                            name: "idCommune",
                            options: commune
                              ? [
                                  { label: "------", value: 0 },
                                  ...commune.map((el) => ({
                                    label: el.name,
                                    value: el.id,
                                  })),
                                ]
                              : [],
                          },
                          {
                            type: "number",
                            label: "House number",
                            name: "number",
                            inputStyle: "primary",
                            placeholder: "Insert number",
                            min: 1,
                          },
                          {
                            type: "text",
                            label: "Postal code",
                            name: "postalCode",
                            inputStyle: "primary",
                            placeholder: "Insert postal code",
                          },
                          {
                            type: "text",
                            label: "Street",
                            name: "street",
                            inputStyle: "primary",
                            placeholder: "Insert street",
                          },
                          {
                            type: "number",
                            label: "Num dpto",
                            name: "numDpto",
                            inputStyle: "primary",
                            placeholder: "Insert Num dpto",
                            min: 1,
                          },
                        ]}
                        gridCols={1}
                        styleForm="primary"
                      />
                      <div className="w-full">
                        <Button
                          typeBtn="button"
                          typeStyleBtn="primary-red"
                          onClickBtn={() => {
                          setAddressToEdit((prev) =>
                              prev.filter((addr) => addr !== el.id)
                            );
                            setErrorUpdateAddress(null);
                          }}
                          textBtn="Cancel"
                      />
                      </div>
                      
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className={`flex gap-2 ${index}`}>
                      <Modal
                        header={
                          <Text
                            text="Are you shure?"
                            color="black"
                            size="2xl"
                            typeText="strong"
                          />
                        }
                        body={
                          <div className="flex flex-col gap-2">
                            <Text
                              text="To delete this address?"
                              color="black"
                              size="base"
                              typeText="em"
                            />
                            <div className="flex gap-3">
                              <Button
                                typeBtn="button"
                                typeStyleBtn="primary-green"
                                onClickBtn={() => {
                                  hideModal();
                                  deleteAddress(el.id);
                                }}
                                textBtn="Yes"
                              />

                              <Button
                                typeBtn="button"
                                typeStyleBtn="primary-red"
                                onClickBtn={hideModal}
                                textBtn="No"
                              />
                            </div>
                          </div>
                        }
                        hideModal={hideModal}
                        isOpen={modalIsOpen(`delete${el.id}`)}
                      />

                      <div className="flex flex-col w-full">
                        <div className="border-4 bg-yellow p-1">
                          <Text
                            color="black"
                            size="base"
                            text={el.commune.name}
                            typeText="strong"
                          />
                        </div>

                        <div className="border-b-4 border-l-4 border-r-4 bg-yellow p-1">
                          <div className="flex gap-1">
                            <Text
                              color="black"
                              size="base"
                              text="Street: "
                              typeText="strong"
                            />
                            <Text
                              color="black"
                              size="base"
                              text={`${el.street} ${el.number} #${el.numDpto}`}
                              typeText="p"
                            />
                          </div>

                          <div className="flex gap-1">
                            <Text
                              color="black"
                              size="base"
                              text="Postal code: "
                              typeText="strong"
                            />
                            <Text
                              color="black"
                              size="base"
                              text={el.postalCode}
                              typeText="p"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 py-1">
                        <Button
                          typeBtn="button"
                          typeStyleBtn="primary-yellow"
                          onClickBtn={() =>
                            setAddressToEdit((prev) => [...prev, el.id])
                          }
                          textBtn="Edit"
                        />
                        <Button
                          typeBtn="button"
                          typeStyleBtn="primary-red"
                          onClickBtn={() => showModal(`delete${el.id}`)}
                          textBtn="Delete"
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )
        }
        typeCard={isActive ? 5 : 1}
      />
    </div>
    
  );
};

export default MainAddress;
