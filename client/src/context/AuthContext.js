import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const initialUser = JSON.parse(localStorage.getItem('user')) || null;
    const initialToken = localStorage.getItem('token') || null;

    const [user, setUser] = useState(initialUser);
    const [token, setToken] = useState(initialToken);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    }, [user, token]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};