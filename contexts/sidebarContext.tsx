"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextProps {
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPinned, setIsPinnedState] = useState<boolean>(false);

  useEffect(() => {
    const storedPinned = localStorage.getItem("sidebar-pinned");
    if (storedPinned !== null) {
      setIsPinnedState(JSON.parse(storedPinned));
    }
  }, []);

  const setIsPinned = (pinned: boolean) => {
    setIsPinnedState(pinned);
    localStorage.setItem("sidebar-pinned", JSON.stringify(pinned));
  };

  return (
    <SidebarContext.Provider value={{ isPinned, setIsPinned }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
