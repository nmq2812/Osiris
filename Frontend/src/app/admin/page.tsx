"use client";
import React from "react";
import { Layout } from "antd";
import DefaultHeader from "@/components/layout/DefaultHeader";
import DefaultNavbar from "@/components/layout/DefaultNavbar";
import useTitle from "@/hooks/use-title";
import useAdminAuthStore from "@/stores/use-admin-auth-store";
import AdminSignin from "../admin-signin/page";

const { Content } = Layout;

function Admin() {
    useTitle();

    const { user } = useAdminAuthStore();

    if (!user) {
        return <AdminSignin />;
    }

    console.log("Admin user: ", user);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Layout>
                <DefaultNavbar />
                <Layout style={{ padding: "24px", background: "#f5f5f5" }}>
                    <Content
                        style={{
                            background: "#fff",
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            borderRadius: 8,
                        }}
                    >
                        {/* Page content goes here - use proper routing in Next.js for content */}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default Admin;
