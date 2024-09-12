'use client'; // This forces the component to be rendered client-side

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management

type AuthContextType = {
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth session using cookies
    const token = Cookies.get('token');
    if (token) {
      const storedUser = Cookies.get('user'); // Store user info in a cookie
      if (storedUser) setUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data.user);
      Cookies.set('user', data.user, { expires: 30 }); // Save user in cookies
      Cookies.set('token', data.token, { expires: 30 }); // Save token in cookies
      window.location.assign('/'); // Navigate after login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const { data } = await axios.post('/api/auth/signup', { username, email, password });
      setUser(data.user);
      Cookies.set('user', data.user, { expires: 30 }); // Save user in cookies
      Cookies.set('token', data.token, { expires: 30 }); // Save token in cookies
      window.location.assign('/'); // Navigate after signup
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    Cookies.remove('token');
    window.location.assign('/'); // Navigate to login page
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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
