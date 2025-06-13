"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/contexts/toast-context";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { hideToast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    hideToast();
  }, [pathname]);

  return <>{children}</>;
}