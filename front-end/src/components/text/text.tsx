type TypeText = 'p' | 'strong' | 'em' | 'mark' | 'a' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type Color = 'white' | 'black' | 'gray' | 'red' | 'red-darkest' | 'green' | 'yellow';
type Size = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'

interface IText {
    text: string;
    typeText: TypeText;
    color: Color;
    size: Size;
}

const colorClasses: Record<Color, string> = {
  white: 'text-white',
  black: 'text-black',
  gray: 'text-gray',
  red: 'text-red',
  "red-darkest": 'text-red-darkest',
  green: 'text-green',
  yellow: 'text-yellow',
};

const sizeClasses: Record<Size, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  "2xl": 'text-2xl',
  "3xl": 'text-3xl',
  "4xl": 'text-4xl',
  "5xl": 'text-5xl',
};

const Text = ({ text, typeText, color, size }: IText) => {
    const Tag = typeText;
    return (
        <Tag className = {`${colorClasses[color]} ${sizeClasses[size]}`}>
            {text}
        </Tag>
    );
}

export default Text;