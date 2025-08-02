interface ILoader {
    text?: string;
    isFullScreen?: boolean;
}

const Loader = ({ text, isFullScreen = true }: ILoader) => {
    return (
        <>  
            {isFullScreen && 
                <div className="fixed z-20 bg-black opacity-70 size-full"></div>
            }
            
            <div className="fixed z-30 bg-gray-lightest left-1/2 top-1/2 flex flex-col gap-3 size-50 -translate-x-1/2 -translate-y-1/2 justify-center p-2 outline-4 outline-black-darkest border-t-4 border-l-4 border-gray-lighter">
                <div className="flex justify-between p-3">
                    <div className="size-6 bg-red bounce"></div>
                    <div className="size-6 bg-yellow bounce delay-c-100"></div>
                    <div className="size-6 bg-green bounce delay-c-200"></div>
                    <div className="size-6 bg-black bounce delay-c-300"></div>
                </div>
                
                <div className="w-full text-center animate-pulse flex justify-center">
                    <strong>{text}</strong>
                    <p className="hard-breathing">.</p>
                    <p className="hard-breathing delay-c-100">.</p>
                    <p className="hard-breathing delay-c-200">.</p>
                </div>
            </div>
        </>   
    )
}

export default Loader;
