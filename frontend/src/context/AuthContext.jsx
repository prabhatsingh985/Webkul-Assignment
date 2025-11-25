import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await api.get('profile/');
                    setUser(response.data);
                } catch (error) {
                    console.error("Not logged in", error);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('login/', { email, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        const profileResponse = await api.get('profile/');
        setUser(profileResponse.data);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
