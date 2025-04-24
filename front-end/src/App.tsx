import Form from "./components/form/form.tsx"
import { loginSchema, FormLoginValues} from "./models/schemas"



function App() {
  const onSubmit = (data: FormLoginValues) => {
    console.log('info data => ', data)
  }

  return (
    <>
      <h1>Hola</h1>
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
    </>
  )
}

export default App
