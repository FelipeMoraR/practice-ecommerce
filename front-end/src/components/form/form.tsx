import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, Path } from "react-hook-form";
import { ZodTypeAny, z } from "zod";
import Input from "../input/input.tsx";
import Button from "../button/button.tsx";
import Text from "../text/text.tsx";

type Mode = "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all" | undefined;
type StyleForm = 'primary' | 'secondary'
type InputStyle = 'primary' | 'secondary';

interface InputProps {
    name: string;
    label: string;
    type: string;
    inputStyle?: InputStyle;
    placeholder?: string;
}

interface FormProps<T extends ZodTypeAny> {
    styleForm: StyleForm; 
    schema: T;
    mode: Mode;
    defaultValues: z.infer<T>; // NOTE This create the object type by the schema
    onSubmit: SubmitHandler<z.infer<T>>; 
    errorSubmit: string | null;
    gridCols: number;
    fields: InputProps[];
}

const Form = <T extends ZodTypeAny>({ styleForm, schema, mode, defaultValues, onSubmit, errorSubmit, gridCols, fields }: FormProps<T>) => { // ANCHOR T is a generic to which the schema gives structure
    const { control, handleSubmit, formState: { errors } } = useForm<z.infer<T>>({ // NOTE handleSubmit controll the submit of the form in base of the schema
        resolver: zodResolver(schema),
        mode: mode,
        defaultValues: defaultValues
    })

    const objStylesForm = {
        primary: 'bg-gray-lightest relative outline-4 outline-black-darkest border-t-4 border-l-4 border-black-lighter p-4 flex flex-col gap-2 min-w-[250px] max-w-[500px]',
        secondary: 'bg-gray-darker relative outline-4 outline-black-darkest border-t-4 border-l-4 border-gray-darkest p-4 flex flex-col gap-2 min-w-[250px] max-w-[500px]'
    }

    const objGridCols: { [key: number]: string } = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    }

    return (
        <form onSubmit = { handleSubmit(onSubmit) } className = {objStylesForm[styleForm]}>
            <div className={`grid grid-cols-1 ${objGridCols[gridCols]} gap-3`}>
                {
                fields.map((element: InputProps, index: number) => (
                    <Input
                        key = {index}
                        name = {element.name as Path<z.infer<T>>}
                        control = {control}
                        label = {element.label}
                        type = {element.type}
                        inputStyle={element.inputStyle}
                        error = {errors[element.name]}
                        placeholder={element.placeholder}
                    />
                ))
            }
            </div>
            

            { errorSubmit && 
                <Text color={styleForm === 'primary' ? "red-darkest" : 'red'} size="base" text={errorSubmit} typeText="p"/>
            }

            <div className="w-full flex justify-center">
                <div className='min-w-[50px] max-w-[200px] w-full h-[40px] shrink-0'>
                    <Button typeBtn="submit" typeStyleBtn={Object.keys(errors).length > 0 ? 'primary-red' : 'secondary-green' } textBtn="Send" disabled={Object.keys(errors).length > 0} />
                </div>
            </div>
            
            
            
        </form>
    )
}

export default Form;
