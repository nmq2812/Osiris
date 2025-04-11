"use client";
import React from "react";
import { Card, Row, Col, Typography, Input, Space } from "antd";
import { MailOutlined, InboxOutlined } from "@ant-design/icons";

const { Text } = Typography;

function ClientHomeNewsletter() {
    return (
        <Card
            style={{
                backgroundColor: "#1890ff",
                color: "#fff",
                borderRadius: "8px",
            }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Space>
                        <InboxOutlined style={{ fontSize: 40 }} />
                        <Space direction="vertical" size={0}>
                            <Text
                                strong
                                style={{ fontSize: 18, color: "#fff" }}
                            >
                                Đăng ký nhận tin
                            </Text>
                            <Text style={{ color: "#fff" }}>
                                và cập nhật khuyến mãi liên tục...
                            </Text>
                        </Space>
                    </Space>
                </Col>
                <Col>
                    <Input
                        style={{
                            width: 450,
                            backgroundColor: "rgba(255,255,255,0.25)",
                            border: "none",
                            color: "#fff",
                        }}
                        placeholder="Địa chỉ email"
                        size="large"
                        prefix={<MailOutlined style={{ color: "#fff" }} />}
                    />
                </Col>
            </Row>
        </Card>
    );
}

export default ClientHomeNewsletter;
