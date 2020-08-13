import React, { createContext, useState, useEffect } from "react";
import AuthService from "../Services/AuthService";

import "../assets/css/style.css";

export const AuthContext = createContext();

export default ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        AuthService.isAuthenticated().then((data) => {
            setUser(data.user);
            setIsAuthenticated(data.isAuthenticated);
            setIsLoaded(true);
        });
    }, []);

    return (
        <div className="AuthDiv">
            {!isLoaded ? (
                <div className="loadingGif">..........</div>
            ) : (
                <AuthContext.Provider
                    value={{
                        user,
                        setUser,
                        isAuthenticated,
                        setIsAuthenticated,
                    }}
                >
                    {children}
                </AuthContext.Provider>
            )}
        </div>
    );
};
