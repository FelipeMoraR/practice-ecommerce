import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, Path } from "react-hook-form";
import { ZodTypeAny, z } from "zod";

type Mode = "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all" | undefined

interface FormProps<T extends ZodTypeAny> {
    schema: T;
    mode: Mode;
    defaultValues: z.infer<T>; // NOTE This create the object type by the schema 
}

const Form = <T extends ZodTypeAny>({ schema, mode, defaultValues }: FormProps<T>) => { // ANCHOR T is a generic to which the schema gives structure
    const { control, handleSubmit, formState: { errors } } = useForm<z.infer<T>>({ // NOTE handleSubmit controll the submit of the form in base of the schema
        resolver: zodResolver(schema),
        mode: mode,
        defaultValues: defaultValues
    })

    const onSubmit: SubmitHandler<z.infer<T>> = (data) => {
        console.log('info data => ', data)
    }

    return (
        <form onSubmit = { handleSubmit(onSubmit) }>
            <div>
                <label htmlFor={'username'}>{'test username'}</label>
                <Controller //Controlled by the form
                    name={'username' as Path<z.infer<T>>}
                    control={control}
                    render={({ field }) => (
                        <input
                            id = {'username'}
                            type = {'text'}
                            {...field} // NOTE  spread operator, this give all the necesary configuration of the input to work with the form
                        />
                    )}
                />
                
            </div>

            <div>
                <label htmlFor={'password'}>{'test password'}</label>
                <Controller //Controlled by the form
                    name={'password' as Path<z.infer<T>>}
                    control={control}
                    render={({ field }) => (
                        <input
                            id = {'password'}
                            type = {'text'}
                            {...field}
                        />
                    )}
                />
            </div>

            {errors && <p>{JSON.stringify(errors)}</p>}

            <button type = "submit">Submit</button>
        </form>
    )
}

export default Form;
