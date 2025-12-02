import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CollectionModalContextType {
  isOpen: boolean;
  recipeId: string | null;
  openModal: (recipeId: string) => void;
  closeModal: () => void;
}

const CollectionModalContext = createContext<CollectionModalContextType | undefined>(undefined);

export const CollectionModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeId, setRecipeId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setRecipeId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setRecipeId(null);
    setIsOpen(false);
  };

  return (
    <CollectionModalContext.Provider value={{ isOpen, recipeId, openModal, closeModal }}>
      {children}
    </CollectionModalContext.Provider>
  );
};

export const useCollectionModal = () => {
  const context = useContext(CollectionModalContext);
  if (!context) {
    throw new Error('useCollectionModal must be used within a CollectionModalProvider');
  }
  return context;
};
