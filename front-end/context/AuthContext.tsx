import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  isAuthenticationInProcess: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticationInProcess, setIsAuthenticationInProcess] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsAuthenticationInProcess(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setIsAuthenticationInProcess(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAuthenticationInProcess(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthenticationInProcess, login, logout }}>
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
