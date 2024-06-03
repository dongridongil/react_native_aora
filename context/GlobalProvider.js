import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLogged(true);
                    setUser(res);
                } else {
                    setIsLogged(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    const handleLogout = () => {
        // 로그아웃 시 사용자 상태 초기화
        setIsLogged(false);
        setUser(null);
    };
    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                loading,
                handleLogout
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;