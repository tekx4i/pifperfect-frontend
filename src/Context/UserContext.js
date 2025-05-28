// src/context/UserContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context for user info
const UserContext = createContext();

// Create a provider component to wrap around your app
export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        // Try to get user info from localStorage if available
        const storedUser = localStorage.getItem("userInfo");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Update userInfo and localStorage
    const updateUserInfo = (newUserInfo) => {
        setUserInfo(newUserInfo);
        localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
    };

    return (
        <UserContext.Provider value={{ userInfo, updateUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access user context
export const useUserInfo = () => {
    return useContext(UserContext);
};
