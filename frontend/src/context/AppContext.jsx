import { createContext, useState } from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [role, setRole] = useState(localStorage.getItem('role') ? localStorage.getItem('role') : false)
    const [uName, setUname] = useState(localStorage.getItem('name') || 'There')
    const [uId, setUId] = useState(localStorage.getItem('id'))


    const value = {
        backendUrl,
        token,
        setToken,
        role,
        setRole,
        uName,
        setUname,
        uId,
        setUId
    }


    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider