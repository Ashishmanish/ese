import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
    };

    const register = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
