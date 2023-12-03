import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const storageKey = sessionStorage.getItem('storageKey') || `user-${Date.now()}`;
    sessionStorage.setItem('storageKey', storageKey);

    const initialUser = JSON.parse(localStorage.getItem(`${storageKey}-user`)) || null;
    const initialToken = localStorage.getItem(`${storageKey}-token`) || null;

    const [user, setUser] = useState(initialUser);
    const [token, setToken] = useState(initialToken);

    useEffect(() => {
        localStorage.setItem(`${storageKey}-user`, JSON.stringify(user));
        localStorage.setItem(`${storageKey}-token`, token);
    }, [user, token]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};