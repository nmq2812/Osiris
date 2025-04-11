"use client";

import { Layout, Space } from "antd";
import ClientHomeBanner from "./ClientHomeBanner";
import ClientHomeFeaturedCategories from "./ClientHomeFeaturedCategories";
import ClientHomeLatestProducts from "./ClientHomeLatestProducts";
import ClientHomeNewsletter from "./ClientHomeNewsletter";
import useTitle from "@/hooks/use-title";

const { Content } = Layout;

export default function HomePage() {
    // State
    useTitle();

    return (
        <Layout>
            <Content
                style={{
                    width: "80vw",
                    margin: "0 auto",
                    padding: "0 16px",
                }}
            >
                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                    <ClientHomeBanner />
                    <ClientHomeFeaturedCategories />
                    <ClientHomeLatestProducts />
                    <ClientHomeNewsletter />
                </Space>
            </Content>
        </Layout>
    );
}
