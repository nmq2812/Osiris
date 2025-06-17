"use client";
import React, { useEffect } from "react";
import { Layout, theme } from "antd";
import useTitle from "@/hooks/use-title";
import useAdminAuthStore from "@/stores/use-admin-auth-store";
import DefaultNavbar from "@/components/layout/DefaultNavbar";
import useAppStore from "@/stores/use-app-store";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { Content } = Layout;
const { useToken } = theme;

const queryClient = new QueryClient();

function Admin({ children }: { children: React.ReactNode }) {
    useTitle("Admin");
    const { token } = useToken();
    const { user } = useAdminAuthStore();
    const { opened } = useAppStore();
    const router = useRouter();

    // Sử dụng useEffect để chuyển hướng sau khi render
    useEffect(() => {
        if (!user) {
            router.replace("/admin-signin");
        }
    }, [user]);

    return (
        <QueryClientProvider client={queryClient}>
            <Layout style={{ minHeight: "100vh" }}>
                <Layout>
                    <DefaultNavbar />
                    <Layout
                        style={{
                            marginLeft: opened ? 250 : 80,
                            transition: "margin-left 0.2s",
                            padding: "0 24px 24px",
                        }}
                    >
                        <Content
                            style={{
                                background: token.colorBgContainer,
                                marginTop: 24,
                                minHeight: 280,
                                borderRadius: token.borderRadiusLG,
                                padding: 24,
                                overflow: "auto",
                            }}
                        >
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </QueryClientProvider>
    );
}

export default Admin;
