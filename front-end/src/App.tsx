import Form from "./components/form/form.tsx"
import { loginSchema, FormLoginValues} from "./models/schemas"
import { UseAxiosContext } from "./contexts/axios.context.tsx"
import { UseAuthContext } from "./contexts/auth.context.tsx";

function App() {
  const { api } = UseAxiosContext();
  const { userIsLoged, isLoadingLogin, fetchLoginUser, userData, errorLogin } = UseAuthContext();

  const fetchProtected = async () => {
    try {
      const response = await api.post('/users/protected');
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
        defaultValues={ {username: '', password: ''} }
        onSubmit={onSubmit}
        fields={[
          {
            name: 'username',
            label: 'Test username',
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
      { userIsLoged && (
        <>
          <h2>You're logged maaan {userData.username}</h2>
          <button onClick={() => {fetchProtected()}}>fech protected</button> 
        </>
      )}
      
    </>
  )
}

export default App
