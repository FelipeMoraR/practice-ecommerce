import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, Path } from "react-hook-form";
import { ZodTypeAny, z } from "zod";
import Input from "../input/input.tsx";

type Mode = "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all" | undefined

interface InputProps {
    name: string;
    label: string;
    type: string;
}

interface FormProps<T extends ZodTypeAny> {
    schema: T;
    mode: Mode;
    defaultValues: z.infer<T>; // NOTE This create the object type by the schema
    onSubmit: SubmitHandler<z.infer<T>>; 
    fields: InputProps[];
}

const Form = <T extends ZodTypeAny>({ schema, mode, defaultValues, onSubmit, fields }: FormProps<T>) => { // ANCHOR T is a generic to which the schema gives structure
    const { control, handleSubmit, formState: { errors } } = useForm<z.infer<T>>({ // NOTE handleSubmit controll the submit of the form in base of the schema
        resolver: zodResolver(schema),
        mode: mode,
        defaultValues: defaultValues
    })

    return (
        <form onSubmit = { handleSubmit(onSubmit) }>
            {
                fields.map((element: InputProps, index: number) => (
                    <Input
                        key = {index}
                        name = {element.name as Path<z.infer<T>>}
                        control = {control}
                        label = {element.label}
                        type = {element.type}
                        error = {errors[element.name]}
                    />
                ))
            }

            <button type = "submit">Submit</button>
        </form>
    )
}

export default Form;
