import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('docuexplain_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('docuexplain_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('docuexplain_token');
      if (storedToken) {
        try {
          const liveUser = await authService.getMe();
          setUser(liveUser);
          localStorage.setItem('docuexplain_user', JSON.stringify(liveUser));
        } catch (err) {
          console.warn("Background profile verification note:", err);
        }
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('docuexplain_token', data.access_token);
    localStorage.setItem('docuexplain_user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (fullName, email, password) => {
    const data = await authService.register({
      full_name: fullName,
      email,
      password
    });
    localStorage.setItem('docuexplain_token', data.access_token);
    localStorage.setItem('docuexplain_user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const loginDemo = async () => {
    const demoEmail = "researcher@docuexplain.ai";
    const demoPassword = "DemoUser2026!";
    const demoName = "Dr. Elena Vance (Lead AI Researcher)";

    try {
      return await login(demoEmail, demoPassword);
    } catch (e) {
      try {
        return await register(demoName, demoEmail, demoPassword);
      } catch (regErr) {
        return await login(demoEmail, demoPassword);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('docuexplain_token');
    localStorage.removeItem('docuexplain_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginDemo, logout, isAuthenticated: !!token }}>
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
