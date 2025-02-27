import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";
import "../public/assets/css/ibmplexsansthai.css";
import "../public/assets/css/ibmplexsansthailooped.css";
import "../public/assets/css/ibmthaifonts.css";
import ThemeToggle from "@/app/components/themeToggle";

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
      <Head>
        <ThemeToggle />
      </Head>
      <body className="light-mode sidebar-expanded">{children} 
       
      </body>
    </html>
  );
}
