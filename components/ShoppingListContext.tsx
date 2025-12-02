import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingItem } from '../types';

interface ShoppingListContextType {
  items: ShoppingItem[];
  addItem: (text: string, recipeSlug?: string, recipeTitle?: string) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearList: () => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('shoppingList');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse shopping list", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const addItem = (text: string, recipeSlug?: string, recipeTitle?: string) => {
    // Check if item already exists to avoid duplicates
    if (items.some(i => i.text === text)) return;
    
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      text,
      checked: false,
      recipeSlug,
      recipeTitle
    };
    setItems(prev => [...prev, newItem]);
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearList = () => setItems([]);

  return (
    <ShoppingListContext.Provider value={{ items, addItem, toggleItem, removeItem, clearList }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};
