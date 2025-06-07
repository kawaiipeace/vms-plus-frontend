"use client";
import React, { createContext, useState, useContext } from 'react';

type ToastType = {
  show: boolean;
  title: string;
  desc: React.ReactNode;
  seeDetailText?: string;
  seeDetail?: {
    onClick: () => void;
    text: string;
  };
  status: 'success' | 'error' | 'warning' | 'info';
};

type ToastContextType = {
  toast: ToastType;
  showToast: (toast: Omit<ToastType, 'show'>) => void;
  hideToast: () => void;
  clearToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const initialToast: ToastType = {
    show: false,
    title: '',
    desc: '',
    status: 'success',
    seeDetail: undefined,
    seeDetailText: '',
  };

  const [toast, setToast] = useState<ToastType>(initialToast);

  const showToast = (newToast: Omit<ToastType, 'show'>) => {
    setToast({ ...newToast, show: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const clearToast = () => {
    setToast(initialToast);
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast, clearToast }}>
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