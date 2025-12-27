import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('dugsiga_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('dugsiga_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('dugsiga_user');
        }
    }, [user]);

    const login = (email, password) => {
        // Mock Authentication
        if (email === 'admin@dugsiga.com' && password === 'password') {
            const userData = { email, name: 'Admin User', role: 'admin' };
            setUser(userData);
            return { success: true };
        }

        if (email === 'teacher@dugsiga.com' && password === 'password') {
            const userData = { email, name: 'Teacher User', role: 'teacher' };
            setUser(userData);
            return { success: true };
        }

        if (email === 'student@dugsiga.com' && password === 'password') {
            const userData = { email, name: 'Student One', role: 'student', studentId: 1, classId: 'Form 4' };
            setUser(userData);
            return { success: true };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
