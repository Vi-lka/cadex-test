import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CADEX-TEST",
  description: "CADEX Web-developer (3D visualization and Frontend) assignment for probationers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className='scroll-smooth'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased bg-background`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
