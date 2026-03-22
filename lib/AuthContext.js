'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for existing session in cookies/localStorage
        const savedUser = localStorage.getItem('auth-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('auth-user', JSON.stringify(userData));
        // Set a cookie for the middleware to check
        document.cookie = `auth-session=true; path=/; max-age=86400`; // 24 hours
        router.push('/dashboard');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth-user');
        document.cookie = `auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isSignedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
