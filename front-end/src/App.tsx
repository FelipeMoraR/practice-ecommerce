import Form from "./components/form/form.tsx"
import { loginSchema } from "./models/schemas"



function App() {
  
  return (
    <>
      <h1>Hola</h1>
      <Form 
        mode="onBlur"
        schema={loginSchema}
        defaultValues={ {username: '', password: ''} }
      />
    </>
  )
}

export default App
