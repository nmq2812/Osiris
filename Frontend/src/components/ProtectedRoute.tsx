"use client";
import { useAuthStore } from "@/stores/authStore";
import { Button, Typography, Space, Row } from "antd";
import React, { JSX, ReactNode } from "react";
import Link from "next/link";

const { Title, Text } = Typography;

function ProtectedRoute({ children }: { children: ReactNode }): ReactNode {
    const { user } = useAuthStore();

    if (!user) {
        return (
            <main>
                <div className="container mx-auto px-4">
                    <Space
                        direction="vertical"
                        size="large"
                        style={{
                            display: "flex",
                            textAlign: "center",
                            padding: "40px 0",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 120,
                                fontWeight: 700,
                                color: "#f0f0f0",
                                lineHeight: 1,
                            }}
                        >
                            401
                        </Text>

                        <Title level={1}>
                            Vui lòng{" "}
                            <Link
                                href="/signin"
                                className="text-blue-500 hover:underline"
                            >
                                đăng nhập
                            </Link>{" "}
                            để truy cập
                        </Title>

                        <Row justify="center">
                            <Link href="/" passHref>
                                <Button type="default" size="large">
                                    Trở về Trang chủ
                                </Button>
                            </Link>
                        </Row>
                    </Space>
                </div>
            </main>
        );
    }

    return children;
}

export default ProtectedRoute;
