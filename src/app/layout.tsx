import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/next';

import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { SongsProvider } from "@/context/SongsContext"; // Asegúrate de que la ruta sea /context/

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juan Rey 4C",
  description: "Utilidades y portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SongsProvider>
            <Navbar />
            {children}
            <SpeedInsights />
            <Analytics />
          </SongsProvider>
        </Providers>
      </body>
    </html>
  );
}
