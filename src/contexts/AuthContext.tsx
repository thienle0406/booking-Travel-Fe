import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { User } from '../types/user';
import { apiService } from '../services/apiService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isDriver: boolean;
    login: (userId: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (newUser: User) => void; // Update user in context
    companyId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser) as User;
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    const login = async (userId: string, password: string) => {
        try {
            const response = await apiService.auth.login(userId, password);
            const { token, user: loggedInUser } = response;

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(loggedInUser));

            setUser(loggedInUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            setIsAuthenticated(false);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update user profile (for ProfilePage)
    const updateUser = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsAuthenticated(true);
    };

    const isAdmin = user?.role === 'ADMIN';
    const isDriver = user?.role === 'DRIVER';
    const companyId = user?.companyId || null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600">Loading authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAdmin,
                isDriver,
                login,
                logout,
                updateUser,
                companyId
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};