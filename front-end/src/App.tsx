import { Routes, Route } from "react-router-dom"
import PrivateRoute from "./components/routes/privateRoute"
import PageLayout from "./layouts/pageLayout"
import Home from "./pages/public/home.page"
import { IPageNavbarFather } from "./models/types/navbar.model"
import { UseAuthValidateSessionContext } from "./contexts/authValidation.context"
import LoginPage from "./pages/public/login.page";
import Loader from "./components/loader/loader";

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
            anchor: '/profile',
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
      <Route path = '/' element = {<PageLayout children = {<Home/>} pages = {pages} />} />
      <Route path = '/login' element = {<PageLayout children = {<LoginPage/>} pages = {pages} />} />
      <Route path = '/register' element = {<PageLayout children = {<h1> register </h1>} pages = {pages} />} />

      <Route path = '/profile' element = {<PrivateRoute children = {<PageLayout children = {<h1> profile </h1>} pages = {pages} />} />} ></Route>
    </Routes>
  )
}

export default App
