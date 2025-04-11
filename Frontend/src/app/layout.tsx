"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderSection from "@/components/layout/header";
import FooterSection from "@/components/layout/footer";
import { QueryClient, QueryClientProvider } from "react-query";
import "antd/dist/reset.css";
import "@ant-design/v5-patch-for-react-19";
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
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryClientProvider client={queryClient}>
                    <HeaderSection />
                    <div className=""></div>
                    {children}
                    <FooterSection />
                </QueryClientProvider>
            </body>
        </html>
    );
}
