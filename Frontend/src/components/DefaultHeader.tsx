"use client";
import React from "react";
import {
    Button,
    Layout,
    Space,
    Menu,
    Dropdown,
    Avatar,
    Typography,
    theme,
} from "antd";
import {
    BellOutlined,
    GlobalOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MessageOutlined,
    SearchOutlined,
    UserOutlined,
    MoonOutlined,
    SunOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import useAppStore from "@/stores/use-app-store";
import NotifyUtils from "@/utils/NotifyUtils";
import useAdminAuthStore from "@/stores/use-admin-auth-store";
import OsirisLogo from "./OsirisLogo";

const { Header } = Layout;
const { Text } = Typography;
const { useToken } = theme;

interface HeaderLink {
    link: string;
    label: string;
    icon: React.ReactNode;
    target?: string;
}

const headerLinks: HeaderLink[] = [
    {
        link: "/admin/account",
        label: "Tài khoản",
        icon: <UserOutlined />,
    },
    {
        link: "/admin/notification",
        label: "Thông báo",
        icon: <BellOutlined />,
    },
    {
        link: "/admin/chat",
        label: "Tin nhắn",
        icon: <MessageOutlined />,
    },
    {
        link: "/",
        label: "Website",
        icon: <GlobalOutlined />,
        target: "_blank",
    },
];

export function DefaultHeader() {
    const { token } = useToken();
    const { opened, toggleOpened } = useAppStore();

    const { user, resetAdminAuthState } = useAdminAuthStore();

    const handleSignoutButton = () => {
        if (user) {
            resetAdminAuthState();

            NotifyUtils.simpleSuccess("Đăng xuất thành công");
        }
    };

    // Tạo menu items từ headerLinks
    const menuItems = headerLinks.map((item) => ({
        key: item.link,
        icon: item.icon,
        label: item.target ? (
            <a href={item.link} target={item.target} rel="noopener noreferrer">
                {item.label}
            </a>
        ) : (
            <Link href={item.link}>{item.label}</Link>
        ),
    }));

    // Menu dropdown cho các thiết bị nhỏ
    const dropdownMenu = {
        items: menuItems,
    };

    return (
        <Header
            style={{
                background: token.colorBgContainer,
                padding: "0 16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                height: 64,
                position: "sticky",
                top: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <div
                className="header-left"
                style={{ display: "flex", alignItems: "center" }}
            >
                <Button
                    type="text"
                    icon={
                        opened ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />
                    }
                    onClick={toggleOpened}
                    style={{ marginRight: 12 }}
                    className="md:hidden" // Tailwind class - chỉ hiển thị trên mobile
                />
                <Link
                    href="/admin"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <OsirisLogo />
                </Link>
            </div>

            <div className="header-right">
                <Space size="middle" align="center">
                    {/* Hiển thị các links trên desktop */}
                    <Space size="small" className="hidden md:flex">
                        {headerLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.link}
                                target={link.target}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 12px",
                                    borderRadius: token.borderRadius,
                                    textDecoration: "none",
                                    color: token.colorText,
                                }}
                            >
                                <span style={{ marginRight: 7 }}>
                                    {link.icon}
                                </span>
                                <Text>{link.label}</Text>
                            </Link>
                        ))}
                    </Space>

                    {/* Dropdown menu cho mobile */}
                    <Dropdown menu={dropdownMenu} className="md:hidden">
                        <Avatar
                            style={{
                                backgroundColor: token.colorPrimary,
                                cursor: "pointer",
                            }}
                            icon={<UserOutlined />}
                        />
                    </Dropdown>

                    {/* Action buttons */}
                    <Space size="small">
                        <Button
                            type="text"
                            icon={<SearchOutlined />}
                            title="Tìm kiếm"
                            shape="circle"
                        />

                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleSignoutButton}
                            title="Đăng xuất"
                            shape="circle"
                        />
                    </Space>
                </Space>
            </div>
        </Header>
    );
}

export default DefaultHeader;
