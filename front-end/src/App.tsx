import Form from "./components/form/form.tsx"
import { loginSchema, FormLoginValues} from "./models/schemas"
import { UseAxiosContext } from "./contexts/axios.context.tsx"
import { UseAuthValidateSessionContext } from "./contexts/authValidation.context.tsx";
import { UseAuthActionContext } from "./contexts/authAction.context.tsx";

function App() {
  const { api } = UseAxiosContext();
  const { userIsLoged, userData, errorValidationSession } = UseAuthValidateSessionContext();
  const { fetchLoginUser, isLoadingLogin, errorLogin } = UseAuthActionContext();

  const fetchProtected = async () => {
    try {
      const response = await api.get('/users/get-user');
      console.log('response protected =>', response);
      return;
    } catch(error) {
      console.error('Error in protected fetch', error);
      return;
    }
  }

  const onSubmit = (data: FormLoginValues) => fetchLoginUser(data);

  
  if (isLoadingLogin) {
    return(
      <h1>Loading login...</h1>
    )
  }

  return (
    <>
      <h1>From :D</h1>
      <Form 
        mode="onBlur"
        schema={loginSchema}
        defaultValues={ {email: '', password: '', deviceId: 1} }
        onSubmit={onSubmit}
        fields={[
          {
            name: 'email',
            label: 'Test email',
            type: 'text'
          },
          {
            name: 'password',
            label: 'Test password',
            type: 'text'
          }
        ]}
      />
      {errorLogin && <p>{errorLogin}</p>}
      {errorValidationSession && <p>{errorValidationSession}</p>}
      { userIsLoged && userData && (
        <>
          <h2>You're logged maaan {userData.userFullName}</h2>
          <button onClick={() => {fetchProtected()}}>fech protected</button> 
        </>
      )}
    </>
  )
}

export default App
