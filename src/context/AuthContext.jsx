import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('dcc_user')) || null;
        } catch {
            return null;
        }
    });

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('dcc_user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await API.post('/auth/register', { name, email, password });
        localStorage.setItem('dcc_user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('dcc_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
