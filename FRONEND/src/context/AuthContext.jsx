import React, { useEffect, useState, createContext, useContext } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('roadmaster_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (userData) => {
    // Store the user data from API response
    localStorage.setItem('roadmaster_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const signup = async (email, password) => {
    // Mock signup
    // In a real app, you would make an API call to register the user
    const userData = {
      email,
      userType: 'user'
    };
    localStorage.setItem('roadmaster_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('roadmaster_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{
    user,
    login,
    signup,
    logout,
    isAuthenticated
  }}>
      {children}
    </AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 