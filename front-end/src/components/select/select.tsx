import { Control, Controller, DeepRequired, FieldErrorsImpl, Path } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import Text from "../text/text";
import { regexOnlyNumbers } from "../../utils/regex";

type Option = {
    value: string | number;
    label: string;
}

interface SelectPropts<T extends ZodTypeAny> {
    name: Path<z.infer<T>>;
    control: Control<z.infer<T>>;
    label: string;
    options: Option[];
    error?: FieldErrorsImpl<DeepRequired<z.TypeOf<T>>>[string] | undefined
}

const Select = <T extends ZodTypeAny>({name, control, label, options, error }: SelectPropts<T>) => {
    return (
        <div className="flex flex-col gap-1 p-2">
            <label className={error ? 'outline-4 outline-red-darkest w-fit py-px px-1 transition-all duration-100' : 'outline-4 outline-black w-fit py-px px-1 transition-all duration-100'} htmlFor = { name }> 
                <Text color={error ? 'red' : 'black'} size="base" text={label} typeText="p"/>
            </label>
            <Controller //Controlled by the form
                name = { name }
                control = { control }
                render = {({ field: { onChange, value } }) => (
                    <select
                        onChange={(e) => {
                            if(regexOnlyNumbers.test(e.target.value)) {
                                onChange(Number(e.target.value));
                                return;
                            }
                            onChange(e.target.value);
                        }}
                        value={value}
                        className={error ? 'bg-red py-1 px-2 text-white outline-4 outline-red-darkest border-t-4 border-l-4 border-red-lighter transition-all duration-100' : 'bg-white py-1 px-2 text-black outline-4 outline-black border-t-4 border-l-4 border-gray-lighter transition-all duration-100'}
                    >
                        {options.map((option: Option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                            )
                        )}
                    </select>
                )}
            />
            {error?.message && typeof error.message === 'string' && <Text color='red' text={error.message} size="sm" typeText="p"/>}
        </div>
    )
}

export default Select;