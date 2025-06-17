"use client";
import React from "react";
import { Avatar, Card, Divider, Space, Typography, Tag, Flex } from "antd";
import {
    HomeOutlined,
    MailOutlined,
    ManOutlined,
    PhoneOutlined,
    WomanOutlined,
} from "@ant-design/icons";
import useAdminAuthStore from "@/stores/use-admin-auth-store";

const { Title, Text } = Typography;

function AdminAccount() {
    const { user } = useAdminAuthStore();

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Space
                direction="vertical"
                size="large"
                style={{ display: "flex", width: "100%" }}
            >
                <Title level={3}>Thông tin tài khoản</Title>

                <Card>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{ display: "flex" }}
                    >
                        <Title level={5} type="secondary" style={{ margin: 0 }}>
                            Thông tin cá nhân
                        </Title>

                        <Flex align="center" gap="middle">
                            <Avatar
                                size={72}
                                style={{ backgroundColor: "#13c2c2" }}
                                src={user?.avatar}
                            >
                                {user?.avatar
                                    ? null
                                    : user?.fullname.charAt(0).toUpperCase()}
                            </Avatar>
                            <Space direction="vertical" size={2}>
                                <Text strong style={{ fontSize: 18 }}>
                                    {user?.fullname}
                                </Text>
                                <Text type="secondary">@{user?.username}</Text>
                            </Space>
                        </Flex>

                        <Divider style={{ margin: "16px 0" }} />

                        <Flex align="center" gap={16}>
                            <Avatar
                                icon={
                                    user?.gender === "M" ? (
                                        <ManOutlined />
                                    ) : (
                                        <WomanOutlined />
                                    )
                                }
                                style={{
                                    backgroundColor: "#f0f0f0",
                                    color: "#595959",
                                }}
                            />
                            <Space direction="vertical" size={2}>
                                <Text strong>Giới tính</Text>
                                <Text>
                                    {user?.gender === "M" ? "Nam" : "Nữ"}
                                </Text>
                            </Space>
                        </Flex>

                        <Flex align="flex-start" gap={16}>
                            <Avatar
                                icon={<HomeOutlined />}
                                style={{
                                    backgroundColor: "#f0f0f0",
                                    color: "#595959",
                                }}
                            />
                            <Space direction="vertical" size={2}>
                                <Text strong>Địa chỉ</Text>
                                <Text style={{ lineHeight: "1.5" }}>
                                    {[
                                        user?.address.line,
                                        user?.address.ward?.name,
                                        user?.address.district?.name,
                                        user?.address.province?.name,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </Text>
                            </Space>
                        </Flex>

                        <Title
                            level={5}
                            type="secondary"
                            style={{ margin: "24px 0 8px 0" }}
                        >
                            Số điện thoại và Email
                        </Title>

                        <Flex align="center" gap={16}>
                            <Avatar
                                icon={<PhoneOutlined />}
                                style={{
                                    backgroundColor: "#f0f0f0",
                                    color: "#595959",
                                }}
                            />
                            <Space direction="vertical" size={2}>
                                <Text strong>Số điện thoại</Text>
                                <Text>{user?.phone}</Text>
                            </Space>
                        </Flex>

                        <Flex align="center" gap={16}>
                            <Avatar
                                icon={<MailOutlined />}
                                style={{
                                    backgroundColor: "#f0f0f0",
                                    color: "#595959",
                                }}
                            />
                            <Space direction="vertical" size={2}>
                                <Text strong>Email</Text>
                                <Text>{user?.email}</Text>
                            </Space>
                        </Flex>

                        <Title
                            level={5}
                            type="secondary"
                            style={{ margin: "24px 0 8px 0" }}
                        >
                            Quyền người dùng
                        </Title>

                        <Space wrap>
                            {user?.roles.map((role) => (
                                <Tag key={role.id} color="blue">
                                    {role.name}
                                </Tag>
                            ))}
                        </Space>
                    </Space>
                </Card>
            </Space>
        </div>
    );
}

export default AdminAccount;
