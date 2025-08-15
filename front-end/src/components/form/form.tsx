import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, Path } from "react-hook-form";
import { ZodTypeAny, z } from "zod";
import Input from "../input/input.tsx";
import Button from "../button/button.tsx";
import Text from "../text/text.tsx";
import { IErrorApi } from "../../models/types/api.model.ts";
import { StyleForm, InputStyle, InputType } from "../../models/types/input.model.ts";
import Select from "../select/select.tsx";

type Mode = "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all" | undefined;
type FormType = InputProps | SelectPropts;

type OptionSelect = {
    value: string | number;
    label: string;
}

interface BaseFieldProps {
    name: string;
    label: string;
}

interface SelectPropts extends BaseFieldProps {
    type: 'select';
    options: OptionSelect[];
}
interface InputProps extends BaseFieldProps{
    type: Exclude<InputType, 'select'>;
    placeholder?: string;
    inputStyle?: InputStyle;
    min?: number;
    max?: number;
}

interface FormProps<T extends ZodTypeAny> {
    styleForm: StyleForm; 
    schema: T;
    mode: Mode;
    defaultValues: z.infer<T>; // NOTE This create the object type by the schema
    onSubmit: SubmitHandler<z.infer<T>>; 
    errorSubmit: IErrorApi | null;
    gridCols: number;
    fields: Array<FormType>;
}

const Form = <T extends ZodTypeAny>({ styleForm, schema, mode, defaultValues, onSubmit, errorSubmit, gridCols, fields }: FormProps<T>) => { // ANCHOR T is a generic to which the schema gives structure
    const { control, handleSubmit, formState: { errors } } = useForm<z.infer<T>>({ // NOTE handleSubmit controll the submit of the form in base of the schema
        resolver: zodResolver(schema),
        mode: mode,
        defaultValues: defaultValues
    })

    const objStylesForm = {
        primary: 'bg-gray-lightest relative outline-4 outline-black-darkest border-t-4 border-l-4 border-black-lighter p-4 flex flex-col gap-2 min-w-[250px] w-full',
        secondary: 'bg-gray-darker relative outline-4 outline-black-darkest border-t-4 border-l-4 border-gray-darkest p-4 flex flex-col gap-2 min-w-[250px] w-full'
    }

    const objGridCols: { [key: number]: string } = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    }
    const fieldToRender = (field: FormType, key: number) => {
        switch (field.type) {
            case 'select':
                return(
                    <Select 
                        key={key}
                        control={control}
                        label={field.label}
                        name={field.name as Path<z.infer<T>>}
                        options={field.options}
                        error={errors[field.name]}
                    />
                );
            default:
                return (
                    <Input 
                        key={key}
                        name={field.name as Path<z.infer<T>>}
                        control={control}
                        label={field.label}
                        type={field.type}
                        inputStyle={field?.inputStyle}
                        error = {errors[field.name]}
                        placeholder={field.placeholder}
                        max={field.max}
                        min={field.min}
                    />
                )
        }
    }

    return (
        <form onSubmit = { handleSubmit(onSubmit) } className = {objStylesForm[styleForm]}>
            <div className={`grid grid-cols-1 ${objGridCols[gridCols]} gap-3`}>
                {
                    fields.map((element, index: number) => fieldToRender(element, index))
                }
            </div>
            

            { errorSubmit && 
                <Text color={styleForm === 'primary' ? "red-darkest" : 'red'} size="base" text={errorSubmit.error} typeText="p"/>
            }

            <div className="w-full flex justify-center">
                <div className='min-w-[50px] w-full h-[40px] shrink-0 grow px-2'>
                    <Button typeBtn="submit" typeStyleBtn={Object.keys(errors).length > 0 ? 'primary-red' : 'secondary-green' } textBtn="Send" disabled={Object.keys(errors).length > 0} />
                </div>
            </div>
            
            
            
        </form>
    )
}

export default Form;
