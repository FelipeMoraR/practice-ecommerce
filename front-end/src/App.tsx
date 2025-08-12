import { Routes, Route } from "react-router-dom"
import PrivateRoute from "./components/routes/privateRoute"
import PublicRoute from "./components/routes/publicRoute"
import PageLayout from "./layouts/pageLayout"
import Home from "./pages/public/home.page"
import { IPageNavbarFather } from "./models/types/navbar.model"
import { UseAuthValidateSessionContext } from "./contexts/authValidation.context"
import LoginPage from "./pages/public/login.page";
import Loader from "./components/loader/loader";
import Register from "./pages/public/register.page";
import VerifyEmail from "./pages/public/verifyEmail.page";
import ForgotPassword from "./pages/public/forgotPassword.page";
import ResetPassword from "./pages/public/resetPassword.page";
import Profile from "./pages/public/profile.page"

function App() {
    const { userData, userIsLoged, isLoadingValidationSession } = UseAuthValidateSessionContext();
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
            }
    ]

    if (userIsLoged) {
        pages = [...pages, {
                anchor: 'private',
                text: 'Private',
                subPages: null
            }]
    }

    // NOTE If is admin show this page
    if (userData?.typeUser === 1) {
        pages = [...pages, {
            anchor: '/admin/users',
            text: 'Users',
            subPages: null
        }]
    }
    
    return (
        <Routes>
            <Route element = {<PageLayout pages = {pages}/>}> 
                <Route index element = { <Home/> } />
                <Route path = 'login' element =  { <LoginPage/> } />
                <Route path = 'register' element = { <Register/> } />
                {/* NOTE This is to protect the pages that only can be accessed without a session*/}
                <Route element={<PublicRoute />}>
                    <Route path = 'forgot-password' element = {<ForgotPassword/>} />
                    <Route path = 'reset-password' element = { <ResetPassword/> } />
                </Route>
                <Route element = {<PrivateRoute />}>
                    <Route path = 'profile' element =  { <Profile/> } />
                </Route>
            </Route>

            <Route path = '/validation/verifying-email' element = { <VerifyEmail/> } />
        </Routes>
    )
}

export default App
