import { Control, Controller, DeepRequired, FieldErrorsImpl, Path } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import Text from "../text/text";

type InputStyle = 'primary' | 'secondary';

interface InputProps<T extends ZodTypeAny> {
    name: Path<z.infer<T>>;
    control: Control<z.infer<T>>;
    label: string;
    type: string;
    inputStyle?: InputStyle;
    placeholder?: string;
    error?: FieldErrorsImpl<DeepRequired<z.TypeOf<T>>>[string] | undefined
}

const Input = <T extends ZodTypeAny>({name, control, label, type, inputStyle = 'primary', placeholder, error} : InputProps<T>) => {
    const stylesInput = {
        primary: 'bg-white py-1 px-2 text-black outline-4 outline-black border-t-4 border-l-4 border-gray-lighter transition-all duration-100',
        secondary: 'bg-grey py-1 px-2 text-white outline-4 outline-gray-lightest border-t-4 border-l-4 border-black-lighter transition-all duration-100',
        "primary-error": 'bg-red py-1 px-2 text-white outline-4 outline-red-darkest border-t-4 border-l-4 border-red-lighter transition-all duration-100',
        "secondary-error": 'bg-red-darker py-1 px-2 text-white outline-4 outline-red border-t-4 border-l-4 border-red-darkest transition-all duration-100'
    }

    const styleLabel = {
        primary: 'outline-4 outline-black w-fit py-px px-1 transition-all duration-100',
        secondary: 'outline-4 outline-gray-lightest w-fit py-px px-1 transition-all duration-100',
        "primary-error": 'outline-4 outline-red-darkest w-fit py-px px-1 transition-all duration-100',
        "secondary-error": 'outline-4 outline-red w-fit py-px px-1 transition-all duration-100'
    }

    return (
        <div className="flex flex-col gap-1 p-2">
            <label className={error ? styleLabel[`${inputStyle}-error`] : styleLabel[inputStyle]} htmlFor = { name }> 
                <Text color={error ? inputStyle === 'primary' ? 'red-darkest' : 'red' : inputStyle === 'primary' ? 'black' : 'white'} size="base" text={label} typeText="p"/>
            </label>
            <Controller //Controlled by the form
                name = { name }
                control = { control }
                render = {({ field }) => (
                    <input
                        id = { name }
                        type = { type }
                        {...field} // NOTE Spread operator, this give all the necesary configuration of the input to work with the form
                        className = {error ? stylesInput[`${inputStyle}-error`] : stylesInput[inputStyle]}
                        placeholder={placeholder}
                    />
                )}
            />
            {error?.message && typeof error.message === 'string' && <Text color={inputStyle === 'primary' ? "red-darkest" : "red"} text={error.message} size="sm" typeText="p"/>}
        </div>
    );
};

export default Input;
