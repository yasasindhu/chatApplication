import { createContext, useState,useEffect } from "react";
export const UserContext = createContext({});
import axios from "axios";

// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    useEffect(()=>{
        axios.get('/profile',{withCredentials:true}).then(response=>{
            setId(response.data.id);
            setUsername(response.data.username);
        })
    },[])
    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>{children}</UserContext.Provider>
    )
}