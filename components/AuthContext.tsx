import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, SubscriptionTier } from '../types';
import { db } from '../services/dataService';
import { useNavigation } from './NavigationContext';
import { useToast } from './ToastContext';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { navigate } = useNavigation();
  const { showToast } = useToast();

  useEffect(() => {
    // Check for persisted session
    const storedUser = localStorage.getItem('recipeAtlas_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await db.login(email, password);
      setUser(userData);
      localStorage.setItem('recipeAtlas_user', JSON.stringify(userData));
      showToast(`Welcome back, ${userData.name}!`, 'success');
      navigate('HOME');
    } catch (error) {
      showToast("Login failed. Please check credentials.", 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, tier: SubscriptionTier) => {
    setIsLoading(true);
    try {
      const userData = await db.signup(name, email, password, tier);
      setUser(userData);
      localStorage.setItem('recipeAtlas_user', JSON.stringify(userData));
      showToast(`Welcome to the club, ${userData.name}!`, 'success');
      navigate('HOME');
    } catch (error) {
      showToast("Signup failed. Try again.", 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await db.logout();
    setUser(null);
    localStorage.removeItem('recipeAtlas_user');
    showToast("Logged out successfully.", 'info');
    navigate('LOGIN');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
