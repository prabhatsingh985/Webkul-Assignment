import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

// Create the Context object
export const AuthContext = createContext();

// Provider Component wraps the entire app to provide User State globally
export const AuthProvider = ({ children }) => {
    // Current User Data (null if not logged in)
    const [user, setUser] = useState(null);
    // Loading state (true while checking if user is logged in)
    const [loading, setLoading] = useState(true);

    // Effect: Check if user is already logged in on page load
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Verify token by trying to fetch profile
                    const response = await api.get('profile/');
                    setUser(response.data);
                } catch (error) {
                    console.error("Not logged in", error);
                    // If invalid, clear tokens
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    // Login Function: Get tokens, save them, fetch user profile
    const login = async (email, password) => {
        const response = await api.post('login/', { email, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        // Fetch full profile immediately after login
        const profileResponse = await api.get('profile/');
        setUser(profileResponse.data);
    };

    // Logout Function: Clear tokens and state
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        // Expose user, login, and logout to valid children components
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
