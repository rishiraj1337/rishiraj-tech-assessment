import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED !== 'false';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('jwt') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('jwt');
    const savedUser = sessionStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
    }
    setLoading(false);
  }, []);

  // Handle user login
  const login = async (email, password) => {
    if (!AUTH_ENABLED) {
      sessionStorage.setItem('authed', 'true');
      setUser({ id: 1, email, name: 'Demo User', goalType: 'general', targetValue: 100 });
      return;
    }

    const res = await api.post('/api/auth/login', { email, password });
    const { token: jwtToken, user: userData } = res.data;

    sessionStorage.setItem('jwt', jwtToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('authed', 'true');

    setToken(jwtToken);
    setUser(userData);
    return res.data;
  };

  // Handle user registration
  const register = async (payload) => {
    const res = await api.post('/api/auth/register', payload);
    const { token: jwtToken, user: userData } = res.data;

    sessionStorage.setItem('jwt', jwtToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('authed', 'true');

    setToken(jwtToken);
    setUser(userData);
    return res.data;
  };

  // Handle user logout
  const logout = () => {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authed');
    setToken(null);
    setUser(null);
  };

  // Update user profile in state and session storage
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !AUTH_ENABLED || !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        authEnabled: AUTH_ENABLED,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
