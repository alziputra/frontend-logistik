import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          const payload = res.data?.data || res.data;
          const userData = payload?.user || payload;
          if (userData && userData.email) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Failed to verify session token:', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const payload = response.data?.data || response.data;
      const jwtToken = payload?.token;
      const userData = payload?.user;

      if (jwtToken) {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
      }
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Login gagal, periksa email dan password Anda';
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.message || 'Registrasi gagal';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout, setUser }}>
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
