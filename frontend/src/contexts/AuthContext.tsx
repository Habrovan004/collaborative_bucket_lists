import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: any) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (data: any) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const result = await authAPI.getProfile();
      if (result.success) {
        setUser(result.data.user);
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (credentials: any) => {
    const result = await authAPI.login(credentials);
    if (result.success) {
      localStorage.setItem('token', result.data.token);
      setUser(result.data.user);
    }
    return result;
  };

  const register = async (userData: any) => {
    const result = await authAPI.register(userData);
    if (result.success) {
      localStorage.setItem('token', result.data.token);
      setUser(result.data.user);
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const changePassword = async (passwords: any) => {
    return await authAPI.changePassword(passwords);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, changePassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};