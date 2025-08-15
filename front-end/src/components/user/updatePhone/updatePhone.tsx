import Text from "../../text/text";
import CardInfo from "../../cardInfo/cardInfo";
import Button from "../../button/button";
import Form from "../../form/form";
import { IUserInfo, options } from "../../../models/types/profileUser.model";
import { IErrorApi } from "../../../models/types/api.model";
import { updatePhoneSchema, FormUpdatePhone } from "../../../models/schemas/phone.schema.model";

interface IUpdatePhone {
    userInfo: IUserInfo | undefined;
    errorUpdatePhone: IErrorApi | null;
    changeStatusForm: (option: options) => void;
    isActive: boolean;
    submitUpdatePhoner: (data: FormUpdatePhone) => Promise<void>;
}

const UpdatePhone = ({ userInfo, errorUpdatePhone, changeStatusForm, isActive = false, submitUpdatePhoner }: IUpdatePhone) => {
  return (
    <div className="max-w-[400px]">
      <CardInfo
        header={
          <div className="flex gap-3 justify-between">
            <Text text="Phone" color="black" size="2xl" typeText="strong" />
            <div className="max-w-[100px] max-h-[30px]">
              <Button
                typeBtn="button"
                typeStyleBtn={ isActive ? "primary-red" : "primary-green"}
                onClickBtn={() => changeStatusForm("phone")}
                textBtn={ isActive ? "Cancel" : "Update"}
              />
            </div>
          </div>
        }
        body={
          isActive ? (
            <div className="flex flex-col gap-2">
              <Form
                mode="all"
                schema={updatePhoneSchema}
                onSubmit={submitUpdatePhoner}
                defaultValues={
                  userInfo?.phone ? { phone: userInfo.phone } : { phone: "" }
                }
                errorSubmit={errorUpdatePhone}
                fields={[
                  {
                    name: "phone",
                    label: "Phone",
                    type: "text",
                    placeholder: "Insert your phone number",
                  },
                ]}
                gridCols={1}
                styleForm="primary"
              />
            </div>
          ) : (
            <div className="flex items-baseline gap-2 bg-yellow border-4 w-full">
              <div className="border-r-4 p-1 bg-yellow-darker max-w-[105px] w-full">
                <Text text="Phone: " color="black" size="lg" typeText="strong" />
              </div>

              <Text
                text={
                  userInfo
                    ? userInfo.phone
                      ? userInfo.phone
                      : "No phone added"
                    : "Error loading data"
                }
                color="black"
                size="base"
                typeText="p"
              />
            </div>
          )
        }
        typeCard={isActive ? 5 : 1}
      />
    </div>
    
  );
};

export default UpdatePhone;
