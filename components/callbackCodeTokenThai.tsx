"use client";

import { fetchProfile, getThaiIdData } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackCodeTokenThai() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const getKeyData = async () => {
      if (code) {
        try {
          const response = await getThaiIdData(code);
          if (response.status === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);

            // Fetch profile after setting tokens
            const profileRes = await fetchProfile();
            const roles = profileRes?.data?.roles || [];

            if (roles.includes("driver")) {
              router.push("/vehicle-in-use/driver");
            } else {
              router.push("/vehicle-booking/request-list");
            }
          }
        } catch (error) {
          router.push("/login-os");
          console.error("Error fetching thai id data:", error);
          sessionStorage.setItem("errorThaiId", "true");
        }
      }
    };

    getKeyData();
  }, [code, router]);

  return <div></div>;
}
