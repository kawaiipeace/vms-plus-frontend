import type { Metadata } from "next";
import Script from "next/script";
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
      </head>

      <body className="light-mode">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </body>
    </html>
  );
}
