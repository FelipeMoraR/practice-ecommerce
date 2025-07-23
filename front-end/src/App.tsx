import { UseAuthValidateSessionContext } from "./contexts/authValidation.context"
import PublicViewLayout from "./layouts/publicView.layout"
import PrivateViewLayout from "./layouts/privateView.layout";

function App() {
  const { userIsLoged } = UseAuthValidateSessionContext();
  
  if (userIsLoged) return <PrivateViewLayout children = {<h1> private </h1>} />

  return <PublicViewLayout children = {<h1> public </h1>} />
}

export default App
