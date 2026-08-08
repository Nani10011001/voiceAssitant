import {  ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage.tsx"
import MicSpeaker from "./components/MicSpeaker.tsx"
const App = () => {


 
  return (
 
    <div>
      <ToastContainer/>
<HomePage/>
<MicSpeaker/>
    </div>
  )
}

export default App
