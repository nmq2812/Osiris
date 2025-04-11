import React from "react";
import { Button, Typography, Space, Row } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

function ClientError() {
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
                        Oops...
                    </Text>

                    <Title level={1}>Đã có lỗi xảy ra</Title>

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

export default ClientError;
