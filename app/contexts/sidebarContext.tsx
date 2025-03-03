"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface SidebarContextType {
  isPinned: boolean;
  toggleIsPinned: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const toggleIsPinned = () => {
    setIsPinned((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isPinned, toggleIsPinned }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
