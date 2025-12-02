import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info'; id: number } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md ${
                toast.type === 'success' 
                ? 'bg-emerald-50/90 border-emerald-100 text-emerald-800' 
                : 'bg-stone-900/90 text-white border-stone-800'
            }`}>
                {toast.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
                <span className="text-sm font-medium">{toast.message}</span>
                <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
                    <X size={14} />
                </button>
            </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
