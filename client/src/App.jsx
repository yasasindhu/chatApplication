import axios from "axios";
import {UserContextProvider} from './components/organisms/hooks/UserContext/hook';
import Routes from "./components/organisms/Routes";

function App() {
  
  axios.defaults.baseURL=import.meta.env.VITE_API_BASE_URL;
  axios.defaults.withCredentials=true;


  return (
    <UserContextProvider>
     <Routes/>
    </UserContextProvider>
  )
}

export default App
