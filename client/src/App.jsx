import axios from "axios";
import {UserContextProvider} from './components/organisms/hooks/UserContext/hook';
import Routes from "./components/organisms/Routes";

function App() {
  
  axios.defaults.baseURL="http://localhost:4000";
  axios.defaults.withCredentials=true;


  return (
    <UserContextProvider>
     <Routes/>
    </UserContextProvider>
  )
}

export default App
