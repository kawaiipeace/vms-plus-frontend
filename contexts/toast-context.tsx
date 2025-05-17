"use client";
import React, { createContext, useState, useContext } from 'react';

type ToastType = {
  show: boolean;
  title: string;
  desc: React.ReactNode;
  status: 'success' | 'error' | 'warning' | 'info';
};

type ToastContextType = {
  toast: ToastType;
  showToast: (toast: Omit<ToastType, 'show'>) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastType>({
    show: false,
    title: '',
    desc: '',
    status: 'info',
  });

  const showToast = (newToast: Omit<ToastType, 'show'>) => {
    setToast({ ...newToast, show: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};