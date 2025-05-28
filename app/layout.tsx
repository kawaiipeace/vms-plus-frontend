import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";
import "../public/assets/css/ibmplexsansthai.css";
import "../public/assets/css/ibmplexsansthailooped.css";
import "../public/assets/css/ibmthaifonts.css";
import "../public/assets/css/material-symbols.css";
import ThemeToggle from "@/components/themeToggle";
import { SidebarProvider } from "@/contexts/sidebarContext";
import { FormProvider } from "@/contexts/requestFormContext";
import { ProfileProvider } from "@/contexts/profileContext";
import Script from "next/script";
import { RequestDetailProvider } from "@/contexts/requestDetailContext";
import { CarpoolProvider } from "@/contexts/carpoolFormContext";
import { ToastProvider } from "@/contexts/toast-context";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Car Pool",
  description: "Car Pool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <Script
          id="env-config"
          src="/env/env-config.js"
          strategy="beforeInteractive"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#317EFB" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <Head>
        <ThemeToggle />
      </Head>

      <body className="light-mode">
        <ProfileProvider>
          <SidebarProvider>
            <RequestDetailProvider>
              <FormProvider>
                <ToastProvider>
                  <CarpoolProvider>
                    {" "}
                    <Suspense>{children}</Suspense>
                  </CarpoolProvider>
                </ToastProvider>
              </FormProvider>
            </RequestDetailProvider>
          </SidebarProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
