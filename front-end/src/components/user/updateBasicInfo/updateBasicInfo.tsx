import CardInfo from "../../cardInfo/cardInfo";
import Text from "../../text/text";
import Button from "../../button/button";
import Form from "../../form/form";
import { updateBasicUserInfoSchema, FormUpdateBasicUserInfoValues } from "../../../models/schemas/updateBasicUserInfo.schema.model";
import { IErrorApi } from "../../../models/types/api.model";
import { options, IUserInfo } from "../../../models/types/profileUser.model";

interface IUpdateBasicInfo {
    userInfo: IUserInfo | undefined;
    errorUpdateBasicInfo: IErrorApi | null;
    changeStatusForm: (option: options) => void;
    isActive: boolean;
    submitUpdateBasicInfoUser: (data: FormUpdateBasicUserInfoValues) => Promise<void>;
}

const UpdateBasicInfoView = ({ userInfo, errorUpdateBasicInfo, changeStatusForm, isActive = false, submitUpdateBasicInfoUser }: IUpdateBasicInfo) => {
  return (
    <div className="max-w-[400px]">
      <CardInfo
        header={
          <div className="flex gap-3 justify-between">
            <Text
              text="Basic information"
              color="black"
              size="2xl"
              typeText="strong"
            />
            <div className="max-w-[100px] max-h-[30px]">
              <Button
                typeBtn="button"
                typeStyleBtn={
                  isActive ? "primary-red" : errorUpdateBasicInfo && errorUpdateBasicInfo.status === 403 ? 'primary-red':'primary-green'
                }
                onClickBtn={() => changeStatusForm('basicInfo')}
                textBtn={isActive ? "Cancel" : "Update"}
                disabled={
                  errorUpdateBasicInfo && errorUpdateBasicInfo.status === 403
                    ? true
                    : false
                }
              />
            </div>
          </div>
        }
        body={
          isActive ? (
            <div className="flex flex-col gap-2">
              <Form
                mode="all"
                schema={updateBasicUserInfoSchema}
                onSubmit={submitUpdateBasicInfoUser}
                defaultValues={
                  userInfo
                    ? { name: userInfo.name, lastName: userInfo.lastname }
                    : { name: "", lastName: "" }
                }
                errorSubmit={errorUpdateBasicInfo}
                fields={[
                  {
                    name: "name",
                    label: "New name",
                    type: "text",
                    placeholder: "Insert new name",
                  },
                  {
                    name: "lastName",
                    label: "New lastname",
                    type: "text",
                    placeholder: "Insert new lastname",
                  },
                ]}
                gridCols={2}
                styleForm="primary"
              />
              <div className="flex items-baseline gap-2 bg-gray-lighter border-4">
                <div className="border-r-4 p-1 bg-gray max-w-[105px] w-full">
                  <Text
                    text="Email: "
                    color="white"
                    size="lg"
                    typeText="strong"
                  />
                </div>
                <Text
                  text={userInfo ? userInfo.email : "Error loading data"}
                  color="black"
                  size="base"
                  typeText="p"
                />
              </div>

              <div className="flex items-baseline gap-2 bg-gray-lighter border-4">
                <div className="border-r-4 p-1 bg-gray max-w-[105px] w-full">
                  <Text
                    text="Verified?: "
                    color="white"
                    size="lg"
                    typeText="strong"
                  />
                </div>

                <Text
                  text={
                    userInfo
                      ? userInfo.isVerified
                        ? "Yes"
                        : "No"
                      : "Error loading data"
                  }
                  color="black"
                  size="base"
                  typeText="p"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex gap-3">
                <div className="flex items-baseline bg-yellow border-4 w-full">
                  <div className="border-r-4 p-1 bg-yellow-darker max-w-[105px] w-full">
                    <Text text="Name" color="black" size="lg" typeText="strong" />
                  </div>
                  <div className="px-2">
                    <Text
                      text={userInfo ? userInfo.name : "Error loading data"}
                      color="black"
                      size="base"
                      typeText="p"
                    />
                  </div>
                  
                </div>

                <div className="flex items-baseline bg-yellow border-4 w-full">
                  <div className="border-r-4 p-1 bg-yellow-darker max-w-[105px] w-full mr-1">
                    <Text
                      text="Lastname: "
                      color="black"
                      size="lg"
                      typeText="strong"
                    />
                  </div>

                  <div className="px-2">
                    <Text
                      text={userInfo ? userInfo.lastname : "Error loading data"}
                      color="black"
                      size="base"
                      typeText="p"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 bg-yellow border-4">
                <div className="border-r-4 p-1 bg-yellow-darker max-w-[105px] w-full">
                  <Text
                    text="Email: "
                    color="black"
                    size="lg"
                    typeText="strong"
                  />
                </div>
                <Text
                  text={userInfo ? userInfo.email : "Error loading data"}
                  color="black"
                  size="base"
                  typeText="p"
                />
              </div>

              <div className="flex items-baseline gap-2 bg-yellow border-4">
                <div className="border-r-4 p-1 bg-yellow-darker max-w-[105px] w-full">
                  <Text
                    text="Verified?: "
                    color="black"
                    size="lg"
                    typeText="strong"
                  />
                </div>

                <Text
                  text={
                    userInfo
                      ? userInfo.isVerified
                        ? "Yes"
                        : "No"
                      : "Error loading data"
                  }
                  color="black"
                  size="base"
                  typeText="p"
                />
              </div>
            </div>
          )
        }
        typeCard={isActive ? 5 : 1}
      />
    </div>
    
  );
};

export default UpdateBasicInfoView;
