
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
            const savedUser = JSON.parse(localStorage.getItem('user'));
            if (savedUser) setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            axios.defaults.headers.common['x-auth-token'] = res.data.token;
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            axios.defaults.headers.common['x-auth-token'] = res.data.token;
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
