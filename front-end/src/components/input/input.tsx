import { Control, Controller, DeepRequired, FieldErrorsImpl, Path } from "react-hook-form";
import { z, ZodTypeAny } from "zod";

interface InputProps<T extends ZodTypeAny> {
    name: Path<z.infer<T>>;
    control: Control<z.infer<T>>;
    label: string;
    type: string;
    error?: FieldErrorsImpl<DeepRequired<z.TypeOf<T>>>[string] | undefined
}

const Input = <T extends ZodTypeAny>({name, control, label, type, error} : InputProps<T>) => {
    return (
        <div>
            <label htmlFor = { name }>{ label }</label>
            <Controller //Controlled by the form
                name = { name }
                control = { control }
                render = {({ field }) => (
                <input
                    id = { name }
                    type={ type }
                    {...field} // NOTE  spread operator, this give all the necesary configuration of the input to work with the form
                />
                )}
            />
            {error?.message && typeof error.message === 'string' && <p>{error.message}</p>}
        </div>
    );
};

export default Input;
