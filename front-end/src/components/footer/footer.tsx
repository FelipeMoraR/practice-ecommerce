import Button from "../button/button";

const Footer = () => {
    const handleExternalRedirect = (url: string): Window | null => window.open(url, '_blank');

    return (
        <footer className = 'w-full bg-gray-lighter border-t-4 border-dark flex justify-between p-3'>
            <div className="flex gap-3">
                <a href="">One link</a>
                <a href="">other link</a>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                    <Button typeBtn = "button" typeStyleBtn="primary-yellow" textBtn="y" onClickBtn={() => handleExternalRedirect('https://www.youtube.com/@pvrpleD3v')}/>
                </div>

                <div>
                    <Button typeBtn = "button" typeStyleBtn="primary-yellow" textBtn="Li" onClickBtn={() => handleExternalRedirect('https://www.linkedin.com/in/felipemorarecabal-3082121ba')}/>
                </div>

                <div>
                    <Button typeBtn = "button" typeStyleBtn="primary-yellow" textBtn="web" onClickBtn={() => handleExternalRedirect('https://www.purpledev.org')}/>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
