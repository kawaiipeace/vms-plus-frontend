// contexts/profileContext.tsx
"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { fetchProfile } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Profile } from "@/app/types/profile-type";


interface ProfileContextType {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || profile) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await fetchProfile();
        console.log('profile',response.data)
        setProfile(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load user profile");
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [profile]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setProfile(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        error,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
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
