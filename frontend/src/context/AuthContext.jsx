import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    // We can assume loading is false if we have a user, or we can keep it simple. 
    // If we rely on token validation, we might want to keep loading true until validated.
    // For this requirement ("stay logged in"), lazy init is the key fix.
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Optional: Re-validate token with backend here if needed, 
        // but for now lazy init solves the immediate "refresh -> logout" issue.
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            const { user, token } = response.data;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setUser(user);

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed',
            };
        }
    };

    const register = async (name, email, phone, password) => {
        try {
            const response = await api.post('/users/register', {
                name,
                email,
                phone,
                password,
            });
            const { user, token } = response.data;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setUser(user);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed',
            };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/users/me', profileData);
            const { user } = response.data;

            // Update local state and storage
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update profile',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,

        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
