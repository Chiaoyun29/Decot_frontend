import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const storageKey = sessionStorage.getItem('storageKey') || `user-${Date.now()}`;
    sessionStorage.setItem('storageKey', storageKey);

    const initialUser = JSON.parse(sessionStorage.getItem(`${storageKey}-user`)) || null;
    const initialToken = sessionStorage.getItem(`${storageKey}-token`) || null;

    const [user, setUser] = useState(initialUser);
    const [token, setToken] = useState(initialToken);

    useEffect(() => {
        if (user) {
            sessionStorage.setItem(`${storageKey}-user`, JSON.stringify(user));
        } else {
            sessionStorage.removeItem(`${storageKey}-user`);
        }
        if (token) {
            sessionStorage.setItem(`${storageKey}-token`, token);
        } else {
            sessionStorage.removeItem(`${storageKey}-token`);
        }
    }, [user, token, storageKey]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};