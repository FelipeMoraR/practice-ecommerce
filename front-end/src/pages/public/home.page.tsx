import Button from "../../components/button/button";

const Home = () => {
    return (
        <div className="w-full flex justify-center items-center ">
            <div className="w-100 flex  flex-col gap-10 m-5">
                <Button typeBtn = "button" typeStyleBtn = 'primary-red' textBtn="Primary red" onClickBtn={() => console.log('si')}/>
                <Button typeBtn = "button" typeStyleBtn = 'secondary-red' textBtn="Secondary red" onClickBtn={() => console.log('si')}/>
                <Button typeBtn = "button" typeStyleBtn = 'primary-green' textBtn="Primary" onClickBtn={() => console.log('si')}/>
                <Button typeBtn = "button" typeStyleBtn = 'secondary-green' textBtn="Secondary" onClickBtn={() => console.log('si')}/>
                <Button typeBtn = "button" typeStyleBtn = 'primary-yellow' textBtn="Primary" onClickBtn={() => console.log('si')}/>
                <Button typeBtn = "button" typeStyleBtn = 'secondary-yellow' textBtn="Secondary" onClickBtn={() => console.log('si')}/>
                <Button typeBtn = "button" typeStyleBtn = 'primary-neutral' textBtn="Primary" onClickBtn={() => console.log('si')}/>
                <Button typeBtn = "button" typeStyleBtn = 'secondary-neutral' textBtn="Secondary" onClickBtn={() => console.log('si')}/>
            </div>
        </div>
    )
}

export default Home;
