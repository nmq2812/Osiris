"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderSection from "@/components/layout/header";
import FooterSection from "@/components/layout/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "antd/dist/reset.css";

import useAdminAuthStore from "@/stores/use-admin-auth-store";
const queryClient = new QueryClient();

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useAdminAuthStore();
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryClientProvider client={queryClient}>
                    <HeaderSection />
                    {children}
                    <FooterSection />
                </QueryClientProvider>
            </body>
        </html>
    );
}
