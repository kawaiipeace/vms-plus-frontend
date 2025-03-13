"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { fetchProfile } from "@/app/services/authService";

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
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProfile();
        setProfile(response.data);
      } catch (error) {
        setError("Error fetching profile");
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading, error }}>
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
