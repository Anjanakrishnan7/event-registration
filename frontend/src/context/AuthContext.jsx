import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/login', { email, password });
      const { user: userData, tokens } = response.data;
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('refresh', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.detail || 'Invalid login credentials.'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      await API.post('/register', { name, email, password });
      return { success: true };
    } catch (error) {
      const errData = error.response?.data;
      let errMsg = 'Registration failed.';
      if (errData) {
        if (typeof errData === 'object') {
          errMsg = Object.values(errData).flat().join(' ');
        } else if (typeof errData === 'string') {
          errMsg = errData;
        }
      }
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
