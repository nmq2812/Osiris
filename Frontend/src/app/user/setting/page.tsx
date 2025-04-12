"use client";
import React from "react";
import { Button, Card, Typography, Row, Col, Space, Avatar, theme } from "antd";
import {
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
    LinkOutlined,
    RightOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import useTitle from "@/hooks/use-title";

const { Title, Text } = Typography;
const { useToken } = theme;

function ClientSetting() {
    useTitle("Thiết đặt tài khoản");
    const { token } = useToken();

    // Danh sách các tùy chọn cài đặt
    const settingOptions = [
        {
            icon: <UserOutlined />,
            title: "Thông tin cá nhân",
            description: "Cập nhật họ và tên, giới tính, địa chỉ...",
            link: "/user/setting/personal",
        },
        {
            icon: <PhoneOutlined />,
            title: "Số điện thoại",
            description: "Thay đổi số điện thoại hiện tại bằng số mới",
            link: "/user/setting/phone",
        },
        {
            icon: <MailOutlined />,
            title: "Email",
            description: "Thay đổi email hiện tại bằng email mới",
            link: "/user/setting/email",
        },
        {
            icon: <LockOutlined />,
            title: "Mật khẩu",
            description: "Thay đổi mật khẩu hiện tại",
            link: "/user/setting/password",
        },
    ];

    return (
        <main>
            <div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <ClientUserNavbar />
                    </Col>

                    <Col xs={24} md={18}>
                        <Card
                            bordered={false}
                            style={{
                                boxShadow:
                                    "0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)",
                                borderRadius: token.borderRadiusLG,
                            }}
                        >
                            <Space
                                direction="vertical"
                                size="large"
                                style={{ width: "100%" }}
                            >
                                <Title level={3}>Thiết đặt</Title>

                                {settingOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: "16px",
                                            borderRadius: token.borderRadius,
                                            border: `1px solid ${token.colorBorderSecondary}`,
                                            transition: "all 0.3s",
                                        }}
                                        className="hover:border-primary"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <Avatar
                                                    size={48}
                                                    style={{
                                                        backgroundColor:
                                                            token.colorPrimaryBg,
                                                        color: token.colorPrimary,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                    icon={option.icon}
                                                />
                                                <div>
                                                    <Text
                                                        strong
                                                        style={{ fontSize: 16 }}
                                                    >
                                                        {option.title}
                                                    </Text>
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            display: "block",
                                                        }}
                                                    >
                                                        {option.description}
                                                    </Text>
                                                </div>
                                            </div>
                                            <Link href={option.link}>
                                                <Button
                                                    type="default"
                                                    className="flex items-center"
                                                >
                                                    Cập nhật
                                                    <RightOutlined />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </main>
    );
}

export default ClientSetting;
