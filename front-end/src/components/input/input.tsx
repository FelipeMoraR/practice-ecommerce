import { Control, Controller, DeepRequired, FieldErrorsImpl, Path } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import Text from "../text/text";

interface InputProps<T extends ZodTypeAny> {
    name: Path<z.infer<T>>;
    control: Control<z.infer<T>>;
    label: string;
    type: string;
    placeholder?: string;
    error?: FieldErrorsImpl<DeepRequired<z.TypeOf<T>>>[string] | undefined
}

const Input = <T extends ZodTypeAny>({name, control, label, type, placeholder, error} : InputProps<T>) => {
    const stylesInput = {
        default: 'bg-white py-1 px-2 text-black outline-4 outline-black border-t-4 border-l-4 border-gray-lighter transition-all duration-100',
        error: 'bg-red py-1 px-2 text-white outline-4 outline-red-darkest border-t-4 border-l-4 border-red-lighter transition-all duration-100'
    }

    const styleLabel = {
        default: 'outline-4 outline-black w-fit py-px px-1 transition-all duration-100',
        error: 'outline-4 outline-red-darkest w-fit py-px px-1 transition-all duration-100'
    }

    return (
        <div className="flex flex-col gap-1 p-2">
            <label className={error ? styleLabel['error'] : styleLabel['default']} htmlFor = { name }> <Text color={error ? 'red-darkest' : 'black'} size="base" text={label} typeText="p"/></label>
            <Controller //Controlled by the form
                name = { name }
                control = { control }
                render = {({ field }) => (
                    <input
                        id = { name }
                        type={ type }
                        {...field} // NOTE Spread operator, this give all the necesary configuration of the input to work with the form
                        className = {error ? stylesInput['error'] : stylesInput['default']}
                        placeholder={placeholder}
                    />
                )}
            />
            {error?.message && typeof error.message === 'string' && <Text color="red-darkest" text={error.message} size="sm" typeText="p"/>}
        </div>
    );
};

export default Input;
