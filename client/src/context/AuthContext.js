import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();

        if (currentUser && isAuthenticated) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const register = async (username, email, password, confirmPassword) => {
        try {
            await authService.register(username, email, password, confirmPassword);
            return await login(username, password);
        } catch (error) {
            throw error;
        }
    };

    const login = async (username, password) => {
        try {
            const response = await authService.login(username, password);
            if (response.user) {
                setUser(response.user);
                return { success: true };
            }
            return { success: false, error: 'Ошибка входа' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Ошибка входа'
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user && authService.isAuthenticated()
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};