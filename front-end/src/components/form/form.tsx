import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, Path } from "react-hook-form";
import { ZodTypeAny, z } from "zod";
import Input from "../input/input.tsx";
import Button from "../button/button.tsx";
import Text from "../text/text.tsx";

type Mode = "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all" | undefined;
type StyleForm = 'primary' | 'secondary'

interface InputProps {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
}

interface FormProps<T extends ZodTypeAny> {
    styleForm: StyleForm; 
    schema: T;
    mode: Mode;
    defaultValues: z.infer<T>; // NOTE This create the object type by the schema
    onSubmit: SubmitHandler<z.infer<T>>; 
    errorSubmit: string | null;
    fields: InputProps[];
}

const Form = <T extends ZodTypeAny>({ styleForm, schema, mode, defaultValues, onSubmit, errorSubmit, fields }: FormProps<T>) => { // ANCHOR T is a generic to which the schema gives structure
    const { control, handleSubmit, formState: { errors } } = useForm<z.infer<T>>({ // NOTE handleSubmit controll the submit of the form in base of the schema
        resolver: zodResolver(schema),
        mode: mode,
        defaultValues: defaultValues
    })

    const objStylesForm = {
        primary: 'bg-gray-lightest outline-4 outline-black-darkest border-t-4 border-l-4 border-black-lighter p-4 flex flex-col gap-3 min-w-[150px] max-w-[800px]',
        secondary: ''
    }

    return (
        <form onSubmit = { handleSubmit(onSubmit) } className = {objStylesForm[styleForm]}>
            {
                fields.map((element: InputProps, index: number) => (
                    <Input
                        key = {index}
                        name = {element.name as Path<z.infer<T>>}
                        control = {control}
                        label = {element.label}
                        type = {element.type}
                        error = {errors[element.name]}
                        placeholder={element.placeholder}
                    />
                ))
            }

            { errorSubmit && 
                <Text color="red-darkest" size="base" text={errorSubmit} typeText="p"/>
            }

            <div className="w-full flex justify-center">
                <div className='min-w-[50px] max-w-[200px] w-full h-[40px] shrink-0'>
                    <Button typeBtn="submit" typeStyleBtn="secondary-green" textBtn="Send" disabled={Object.keys(errors).length > 0} />
                </div>
            </div>
            
            
            
        </form>
    )
}

export default Form;
