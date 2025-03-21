"use client";
import { createContext, useContext, useState } from "react";

interface SidebarContextProps {
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPinned, setIsPinned] = useState<boolean>(false);

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
