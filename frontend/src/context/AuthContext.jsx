import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = 'findit_token';
const STORAGE_USER_KEY = 'findit_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    if (token && user) {
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [token, user]);

  const clearError = useCallback(() => setError(null), []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser({ email, password });
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'user') => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser({ name, email, password, role });
      // If backend returns token upon register or if user logs in afterwards
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin',
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
