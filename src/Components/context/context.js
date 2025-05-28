import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
// import apiUrl from "../constant/apiurl";

// Create the context
const VerifyTokenContext = createContext();

// Provider component
export const VerifyTokenProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifiedToken, setVerifyToken] = useState(false);

    const verifyToken = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                handleLogout();
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`localhost:3000/auth/me`, config);

            if (response.status === 200) {
                setIsAuthenticated(true);
                setUser(response.data);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token from storage
        setIsAuthenticated(false); // Ensure user is marked as unauthenticated
        setUser(null);
        setLoading(false);
    };

    useEffect(() => {
        verifyToken();
    }, [verifiedToken]);

    return (
        <VerifyTokenContext.Provider value={{ isAuthenticated, user, verifyToken, loading, verifiedToken, setVerifyToken }}>
            {children}
        </VerifyTokenContext.Provider>
    );
};

export const useVerifyToken = () => {
    return useContext(VerifyTokenContext);
};
