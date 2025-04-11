"use client";
import React from "react";
import {
    Avatar,
    Button,
    Card,
    Divider,
    Row,
    Col,
    Space,
    Typography,
    theme,
} from "antd";
import {
    HomeOutlined,
    LinkOutlined,
    LockOutlined,
    MailOutlined,
    ManOutlined,
    PhoneOutlined,
    WomanOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import useTitle from "@/hooks/use-title";
import { useAuthStore } from "@/stores/authStore";
import ClientUserNavbar from "@/components/ClientUserNavbar";

const { Title, Text } = Typography;
const { useToken } = theme;

function ClientUser() {
    useTitle("Tài khoản của tôi");
    const { token } = useToken();
    const { user } = useAuthStore();

    const IconWrapper = ({ children }: { children: React.ReactNode }) => (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: token.colorBgLayout,
            }}
        >
            {children}
        </div>
    );

    return (
        <main className="container mx-auto px-4 py-6">
            <Row gutter={[32, 24]}>
                <Col xs={24} md={6} lg={5}>
                    <ClientUserNavbar />
                </Col>

                <Col xs={24} md={18} lg={19}>
                    <Card>
                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                        >
                            <Title level={2}>Thông tin tài khoản</Title>

                            <Row gutter={[32, 24]}>
                                <Col xs={24} lg={12}>
                                    <Space
                                        direction="vertical"
                                        size="middle"
                                        style={{ width: "100%" }}
                                    >
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500,
                                            }}
                                        >
                                            Thông tin cá nhân
                                        </Text>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                }}
                                            >
                                                <Avatar
                                                    size={48}
                                                    style={{
                                                        backgroundColor:
                                                            token.colorPrimary,
                                                    }}
                                                >
                                                    {user?.fullname?.charAt(
                                                        0,
                                                    ) || <UserOutlined />}
                                                </Avatar>
                                                <Space
                                                    direction="vertical"
                                                    size={0}
                                                >
                                                    <Text strong>
                                                        {user?.fullname}
                                                    </Text>
                                                    <Text type="secondary">
                                                        @{user?.username}
                                                    </Text>
                                                </Space>
                                            </div>
                                            <Link href="/user/setting/personal">
                                                <Button>Cập nhật</Button>
                                            </Link>
                                        </div>

                                        <Divider dashed />

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                            }}
                                        >
                                            <IconWrapper>
                                                {user?.gender === "M" ? (
                                                    <ManOutlined
                                                        style={{
                                                            fontSize: 20,
                                                            color: token.colorPrimary,
                                                        }}
                                                    />
                                                ) : (
                                                    <WomanOutlined
                                                        style={{
                                                            fontSize: 20,
                                                            color: token.colorPrimary,
                                                        }}
                                                    />
                                                )}
                                            </IconWrapper>
                                            <Space
                                                direction="vertical"
                                                size={0}
                                            >
                                                <Text strong>Giới tính</Text>
                                                <Text>
                                                    {user?.gender === "M"
                                                        ? "Nam"
                                                        : "Nữ"}
                                                </Text>
                                            </Space>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 12,
                                            }}
                                        >
                                            <IconWrapper>
                                                <HomeOutlined
                                                    style={{
                                                        fontSize: 20,
                                                        color: token.colorPrimary,
                                                    }}
                                                />
                                            </IconWrapper>
                                            <Space
                                                direction="vertical"
                                                size={0}
                                            >
                                                <Text strong>Địa chỉ</Text>
                                                <Text>
                                                    {[
                                                        user?.address?.line,
                                                        user?.address?.ward
                                                            ?.name,
                                                        user?.address?.district
                                                            ?.name,
                                                        user?.address?.province
                                                            ?.name,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </Text>
                                            </Space>
                                        </div>
                                    </Space>
                                </Col>

                                <Col xs={24} lg={12}>
                                    <Space
                                        direction="vertical"
                                        size="middle"
                                        style={{ width: "100%" }}
                                    >
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500,
                                            }}
                                        >
                                            Số điện thoại và Email
                                        </Text>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                }}
                                            >
                                                <IconWrapper>
                                                    <PhoneOutlined
                                                        style={{
                                                            fontSize: 20,
                                                            color: token.colorPrimary,
                                                        }}
                                                    />
                                                </IconWrapper>
                                                <Space
                                                    direction="vertical"
                                                    size={0}
                                                >
                                                    <Text strong>
                                                        Số điện thoại
                                                    </Text>
                                                    <Text>{user?.phone}</Text>
                                                </Space>
                                            </div>
                                            <Link href="/user/setting/phone">
                                                <Button>Cập nhật</Button>
                                            </Link>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                }}
                                            >
                                                <IconWrapper>
                                                    <MailOutlined
                                                        style={{
                                                            fontSize: 20,
                                                            color: token.colorPrimary,
                                                        }}
                                                    />
                                                </IconWrapper>
                                                <Space
                                                    direction="vertical"
                                                    size={0}
                                                >
                                                    <Text strong>Email</Text>
                                                    <Text>{user?.email}</Text>
                                                </Space>
                                            </div>
                                            <Link href="/user/setting/email">
                                                <Button>Cập nhật</Button>
                                            </Link>
                                        </div>

                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500,
                                                marginTop: 16,
                                            }}
                                        >
                                            Bảo mật
                                        </Text>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                }}
                                            >
                                                <IconWrapper>
                                                    <LockOutlined
                                                        style={{
                                                            fontSize: 20,
                                                            color: token.colorPrimary,
                                                        }}
                                                    />
                                                </IconWrapper>
                                                <Text strong>Đổi mật khẩu</Text>
                                            </div>
                                            <Link href="/user/setting/password">
                                                <Button>Cập nhật</Button>
                                            </Link>
                                        </div>
                                    </Space>
                                </Col>
                            </Row>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </main>
    );
}

export default ClientUser;
