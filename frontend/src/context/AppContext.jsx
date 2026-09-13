import { createContext, useState } from "react";
import Swal from "sweetalert2";
import notify from "../utils/notify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [role, setRole] = useState(localStorage.getItem('role') ? localStorage.getItem('role') : false);
    const [uName, setUname] = useState(localStorage.getItem('name') || 'There');
    const [uId, setUId] = useState(localStorage.getItem('id'));

    const handleLogout = (navigate) => {
        Swal.fire({
            title: "Sign Out?",
            text: "Are you sure you want to end your active session?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#64748B",
            confirmButtonText: '<i class="fa-solid fa-right-from-bracket me-1"></i> Yes, Sign Out',
            cancelButtonText: "Cancel",
            reverseButtons: true,
            background: "#0F172A",
            color: "#F8FAFC",
            customClass: {
                popup: 'rounded-4 border border-secondary shadow-lg'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('name');
                localStorage.removeItem('role');
                localStorage.removeItem('id');
                setToken(false);
                setRole(false);
                setUname('There');
                setUId(null);
                notify.info("Signed Out", "You have been securely signed out.");
                if (navigate) navigate('/login');
            }
        });
    };

    const value = {
        backendUrl,
        token,
        setToken,
        role,
        setRole,
        uName,
        setUname,
        uId,
        setUId,
        handleLogout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;