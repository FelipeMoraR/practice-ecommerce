import CardInfo from "../../cardInfo/cardInfo";
import Text from "../../text/text";
import Button from "../../button/button";
import Form from "../../form/form";
import { updateProfilePasswordSchema, FormUpdateProfilePassword } from "../../../models/schemas/profileUpdatePassword.schema";
import { options } from "../../../models/types/profileUser.model";
import { IErrorApi } from "../../../models/types/api.model";

interface IUpdatePassword {
    errorUpdatePassword: IErrorApi | null;
    changeStatusForm: (option: options) => void;
    isActive: boolean;
    submitUpdatePassword: (data: FormUpdateProfilePassword) => Promise<void>;
}

const UpdatePassword = ({ errorUpdatePassword, changeStatusForm, isActive = false, submitUpdatePassword } : IUpdatePassword) => {
  return (
    <div className="max-w-[400px]">
      <CardInfo
        header={
          <div className="flex gap-3 justify-between">
            <Text
              text="Update password"
              color="black"
              size="2xl"
              typeText="strong"
            />
            <div className="max-w-[100px] max-h-[30px]">
              <Button
                typeBtn="button"
                typeStyleBtn={isActive ? "primary-red" : "primary-green"}
                onClickBtn={() => changeStatusForm("password")}
                textBtn={isActive ? "Cancel" : "Update"}
              />
            </div>
          </div>
        }
        body={
          isActive && (
            <div className="flex flex-col gap-2">
              <Form
                mode="all"
                schema={updateProfilePasswordSchema}
                onSubmit={submitUpdatePassword}
                defaultValues={{
                  oldPassword: "",
                  confirmNewPassword: "",
                  newPassword: "",
                }}
                errorSubmit={errorUpdatePassword}
                fields={[
                  {
                    name: "oldPassword",
                    label: "Old password",
                    type: "password",
                    placeholder: "Insert old password",
                  },
                  {
                    name: "newPassword",
                    label: "New password",
                    type: "password",
                    placeholder: "Insert new password",
                  },
                  {
                    name: "confirmNewPassword",
                    label: "Confirm new password",
                    type: "password",
                    placeholder: "Insert confirm new password",
                  },
                ]}
                gridCols={1}
                styleForm="primary"
              />
            </div>
          )
        }
        typeCard={isActive ? 5 : 1}
      />
    </div>
    
  );
};

export default UpdatePassword;
