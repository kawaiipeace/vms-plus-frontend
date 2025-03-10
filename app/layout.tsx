import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";
import "../public/assets/css/ibmplexsansthai.css";
import "../public/assets/css/ibmplexsansthailooped.css";
import "../public/assets/css/ibmthaifonts.css";
import "../public/assets/css/material-symbols.css";
import ThemeToggle from "@/app/components/themeToggle";
import { SidebarProvider } from "@/app/contexts/sidebarContext";
import { FormProvider } from "@/app/contexts/requestFormContext";

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
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      <Head>
        <ThemeToggle />
      </Head>
      <body className="light-mode">
        <SidebarProvider>
          <FormProvider>{children}</FormProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
