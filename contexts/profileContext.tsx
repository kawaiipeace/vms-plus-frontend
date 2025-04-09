"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { fetchProfile } from "@/services/authService";
import { useRouter } from "next/navigation";

interface Profile {
  emp_id: string;
  first_name: string;
  last_name: string;
  dept_sap_full: string;
}

interface ProfileContextType {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const initializeProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
  
      setIsAuthenticated(true);
  
      try {
        const response = await fetchProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
  
    initializeProfile();
  }, []);
  

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading, error, isAuthenticated }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = React.useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};