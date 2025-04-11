"use client";
import React, { useMemo } from "react";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    UserOutlined,
    SettingOutlined,
    BellOutlined,
    FileOutlined,
    StarOutlined,
    HeartOutlined,
    TrophyOutlined,
    ClockCircleOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

// Định nghĩa các đường dẫn dưới dạng constants để dễ dàng bảo trì
const ROUTES = {
    USER: "/user",
    SETTINGS: "/user/setting",
    SETTINGS_PERSONAL: "/user/setting/personal",
    SETTINGS_PHONE: "/user/setting/phone",
    SETTINGS_EMAIL: "/user/setting/email",
    SETTINGS_PASSWORD: "/user/setting/password",
    NOTIFICATION: "/user/notification",
    ORDER: "/order",
    REVIEW: "/user/review",
    WISHLIST: "/user/wishlist",
    REWARD: "/user/reward",
    PREORDER: "/user/preorder",
    CHAT: "/user/chat",
};

function ClientUserNavbar() {
    const pathname = usePathname();

    // Tạo menu items một lần và chỉ tạo lại khi cần thiết
    const menuItems: MenuProps["items"] = useMemo(
        () => [
            {
                key: ROUTES.USER,
                icon: <UserOutlined />,
                label: <Link href={ROUTES.USER}>Tài khoản</Link>,
            },
            {
                key: ROUTES.SETTINGS,
                icon: <SettingOutlined />,
                label: <Link href={ROUTES.SETTINGS}>Thiết đặt</Link>,
                children: [
                    {
                        key: ROUTES.SETTINGS_PERSONAL,
                        label: (
                            <Link href={ROUTES.SETTINGS_PERSONAL}>
                                Thông tin cá nhân
                            </Link>
                        ),
                    },
                    {
                        key: ROUTES.SETTINGS_PHONE,
                        label: (
                            <Link href={ROUTES.SETTINGS_PHONE}>
                                Số điện thoại
                            </Link>
                        ),
                    },
                    {
                        key: ROUTES.SETTINGS_EMAIL,
                        label: <Link href={ROUTES.SETTINGS_EMAIL}>Email</Link>,
                    },
                    {
                        key: ROUTES.SETTINGS_PASSWORD,
                        label: (
                            <Link href={ROUTES.SETTINGS_PASSWORD}>
                                Mật khẩu
                            </Link>
                        ),
                    },
                ],
            },
            {
                key: ROUTES.NOTIFICATION,
                icon: <BellOutlined />,
                label: <Link href={ROUTES.NOTIFICATION}>Thông báo</Link>,
            },
            {
                key: ROUTES.ORDER,
                icon: <FileOutlined />,
                label: <Link href={ROUTES.ORDER}>Quản lý đơn hàng</Link>,
            },
            {
                key: ROUTES.REVIEW,
                icon: <StarOutlined />,
                label: <Link href={ROUTES.REVIEW}>Đánh giá sản phẩm</Link>,
            },
            {
                key: ROUTES.WISHLIST,
                icon: <HeartOutlined />,
                label: <Link href={ROUTES.WISHLIST}>Sản phẩm yêu thích</Link>,
            },
            {
                key: ROUTES.REWARD,
                icon: <TrophyOutlined />,
                label: <Link href={ROUTES.REWARD}>Điểm thưởng</Link>,
            },
            {
                key: ROUTES.PREORDER,
                icon: <ClockCircleOutlined />,
                label: <Link href={ROUTES.PREORDER}>Đặt trước sản phẩm</Link>,
            },
            {
                key: ROUTES.CHAT,
                icon: <MessageOutlined />,
                label: <Link href={ROUTES.CHAT}>Yêu cầu tư vấn</Link>,
            },
        ],
        [],
    );

    // Tính toán selectedKeys và openKeys trong cùng một useMemo để giảm lặp lại
    const { selectedKeys, openKeys } = useMemo(() => {
        const selected = [pathname];
        const opened: string[] = [];

        // Một lần duyệt qua menu items để tìm cả selected và open keys
        for (const item of menuItems || []) {
            // Kiểm tra item có tồn tại không
            if (!item) continue;

            // Kiểm tra có phải menu có children không
            if ("children" in item && item.children) {
                let isChildSelected = false;

                // Duyệt qua các child items
                for (const child of item.children) {
                    if (!child) continue;

                    const childKey = child.key as string;
                    if (pathname.startsWith(childKey)) {
                        isChildSelected = true;
                        if (!selected.includes(childKey)) {
                            selected.push(childKey);
                        }
                    }
                }

                // Nếu có child được chọn, thêm parent vào danh sách selected và opened
                if (isChildSelected) {
                    const parentKey = item.key as string;
                    if (!selected.includes(parentKey)) {
                        selected.push(parentKey);
                    }
                    if (!opened.includes(parentKey)) {
                        opened.push(parentKey);
                    }
                }
            }
            // Kiểm tra nếu item không có children nhưng đường dẫn hiện tại bắt đầu bằng key của item
            else if (
                pathname.startsWith(item.key as string) &&
                pathname !== item.key
            ) {
                if (!selected.includes(item.key as string)) {
                    selected.push(item.key as string);
                }
            }
        }

        return { selectedKeys: selected, openKeys: opened };
    }, [pathname, menuItems]);

    return (
        <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={openKeys}
            style={{ width: "100%" }}
            items={menuItems}
            className="user-navbar"
        />
    );
}

export default ClientUserNavbar;
