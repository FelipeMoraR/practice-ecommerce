import { Routes, Route } from "react-router-dom"
import PrivateRoute from "./components/routes/privateRoute"
import PageLayout from "./layouts/pageLayout"
import Home from "./pages/public/home.page"
import { IPageNavbarFather } from "./models/types/navbar.model"
import { UseAuthValidateSessionContext } from "./contexts/authValidation.context"
import LoginPage from "./pages/public/login.page";
import Loader from "./components/loader/loader";
import Register from "./pages/public/register.page";
import VerifyEmail from "./pages/public/verifyEmail.page";

function App() {
    const { userIsLoged, isLoadingValidationSession } = UseAuthValidateSessionContext();
    if (isLoadingValidationSession) {
        return <Loader text = "Validating sesion"/>
    }

    let pages: IPageNavbarFather[] = [
            {
                anchor: '/',
                text: 'Home',
                subPages: null
            },
            {
                anchor: 'Products',
                text: 'Products',
                subPages: [
                    {
                        anchor: 'Shirts',
                        text: 'Shirts'
                    },
                    {
                        anchor: 'Pants',
                        text: 'Pants'
                    }
                ]
            },
            {
                anchor: 'Contact',
                text: 'Contact',
                subPages: [
                    {
                        anchor: 'contact1',
                        text: 'contact1'
                    },
                    {
                        anchor: 'contact2',
                        text: 'contact2'
                    },
                    {
                        anchor: 'contact3',
                        text: 'contact3'
                    }
                ]
            },
            {
                anchor: 'Contact',
                text: 'Contact',
                subPages: [
                    {
                        anchor: 'contact1',
                        text: 'contact1'
                    },
                    {
                        anchor: 'contact2',
                        text: 'contact2'
                    },
                    {
                        anchor: 'contact3',
                        text: 'contact3'
                    }
                ]
            }
    ]

    if (userIsLoged) {
        pages = [...pages, {
                anchor: 'profile',
                text: 'profile',
                subPages: [
                    {
                        anchor: 'profile1',
                        text: 'profile1'
                    },
                    {
                        anchor: 'profile2',
                        text: 'profile2'
                    },
                    {
                        anchor: 'profile3',
                        text: 'profile3'
                    }
                ]
            }]
    }
    
    return (
        <Routes>
            <Route element = {<PageLayout pages = {pages}/>}> 
                <Route index element = { <Home/> } />
                <Route path = 'login' element =  { <LoginPage/> } />
                <Route path = 'register' element = { <Register/> } />

                <Route element = {<PrivateRoute />}>
                    <Route path = 'profile' element =  { <h1>Profile</h1> } />
                </Route>
            </Route>

            <Route path = '/validation/verifying-email' element = { <VerifyEmail/> } />
        </Routes>
    )
}

export default App
