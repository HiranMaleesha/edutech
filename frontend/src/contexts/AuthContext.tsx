'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginRequest, AuthResponse } from '../types';
import { apiClient } from '../lib/api';
import toast from 'react-hot-toast';

/**
 * Interface defining the shape of the authentication context.
 */
interface AuthContextType {
  /** Current authenticated user or null if not authenticated */
  user: User | null;
  /** Function to authenticate a user with credentials */
  login: (credentials: LoginRequest) => Promise<boolean>;
  /** Function to log out the current user */
  logout: () => Promise<void>;
  /** Loading state during authentication operations */
  isLoading: boolean;
}

/**
 * React context for authentication state management.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access the authentication context.
 * Must be used within an AuthProvider component.
 *
 * @returns Authentication context value
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Props interface for the AuthProvider component.
 */
interface AuthProviderProps {
  /** Child components to be wrapped with authentication context */
  children: ReactNode;
}

/**
 * Authentication provider component that manages user authentication state.
 * Provides login, logout functionality and maintains user session.
 *
 * @param props - Component props
 * @returns JSX element wrapping children with authentication context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication data on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.setToken(token);
      // In a production app, token validation with the server would be implemented here
      // For now, we assume the stored token is valid and retrieve user info from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          // Clear invalid stored data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Authenticates a user with the provided credentials.
   *
   * @param credentials - User login credentials
   * @returns Promise resolving to true if login successful, false otherwise
   */
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await apiClient.login(credentials);
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Login successful');
        return true;
      } else {
        const errorMessage = response.error || 'Login failed';
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  /**
   * Logs out the current user and clears authentication state.
   *
   * @returns Promise that resolves when logout is complete
   */
  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed, but you have been logged out locally');
    } finally {
      // Always clear local authentication state
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      apiClient.clearToken();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};