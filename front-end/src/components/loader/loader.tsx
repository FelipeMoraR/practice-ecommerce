interface ILoader {
    text: string;
}

const Loader = ({ text }: ILoader) => {
    return (
        <div>
            <p>{text}</p>
        </div>
    )
}

export default Loader;
