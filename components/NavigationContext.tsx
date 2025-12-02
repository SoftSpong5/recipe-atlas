import React, { createContext, useContext, useState } from 'react';
import { PageView, NavigationState } from '../types';

interface NavigationContextType {
  currentPath: NavigationState;
  navigate: (page: PageView, params?: { slug?: string }) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<NavigationState>({ currentPage: 'HOME' });

  const navigate = (page: PageView, params?: { slug?: string }) => {
    window.scrollTo(0, 0);
    setCurrentPath({ currentPage: page, params });
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
