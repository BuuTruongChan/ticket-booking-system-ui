import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderOrganizerLink } from "@/components/auth/header-organizer-link";
import { UserProfile } from "@/components/auth/user-profile";
import { QueryProvider } from "@/components/providers";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticket Booking System",
  description: "Find your concerts, book your tickets, and enjoy the show!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {typeof metadata.title === "string"
                    ? metadata.title
                    : "Ticket Booking System"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {typeof metadata.description === "string"
                    ? metadata.description
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <HeaderOrganizerLink />
                <UserProfile />
              </div>
            </div>
          </header>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
