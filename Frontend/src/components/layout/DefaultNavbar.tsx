"use client";
import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography, theme } from "antd";
import {
    HomeOutlined,
    BookOutlined,
    UserOutlined,
    BankOutlined,
    TeamOutlined,
    AppstoreOutlined,
    ShopOutlined,
    ShoppingOutlined,
    CarOutlined,
    CommentOutlined,
    TrophyOutlined,
    DollarOutlined,
    KeyOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAdminAuthStore from "@/stores/use-admin-auth-store";
import useAppStore from "@/stores/use-app-store";

const { Sider } = Layout;
const { useToken } = theme;

interface NavbarChildLink {
    key: string;
    link: string;
    label: string;
}

interface NavbarLink {
    key: string;
    link: string;
    label: string;
    icon: React.ReactNode;
    children?: NavbarChildLink[];
    disableForEmployee?: boolean;
}

// Định nghĩa links với Ant Design icons
const navbarLinks: NavbarLink[] = [
    {
        key: "home",
        link: "/admin",
        label: "Trang chủ",
        icon: <HomeOutlined />,
    },
    {
        key: "address",
        link: "/admin/address",
        label: "Địa chỉ",
        icon: <BookOutlined />,
        children: [
            {
                key: "address-province",
                link: "/admin/address/province",
                label: "Tỉnh thành",
            },
            {
                key: "address-district",
                link: "/admin/address/district",
                label: "Quận huyện",
            },
            {
                key: "address-ward",
                link: "/admin/address/ward",
                label: "Phường xã",
            },
        ],
        disableForEmployee: true,
    },
    {
        key: "user",
        link: "/admin/user",
        label: "Người dùng",
        icon: <KeyOutlined />,
        children: [
            {
                key: "user-role",
                link: "/admin/user/role",
                label: "Quyền",
            },
        ],
        disableForEmployee: true,
    },
    {
        key: "employee",
        link: "/admin/employee",
        label: "Nhân viên",
        icon: <BankOutlined />,
        children: [
            {
                key: "employee-office",
                link: "/admin/employee/office",
                label: "Văn phòng",
            },
            {
                key: "employee-department",
                link: "/admin/employee/department",
                label: "Phòng ban",
            },
            {
                key: "employee-job-type",
                link: "/admin/employee/job-type",
                label: "Loại hình công việc",
            },
            {
                key: "employee-job-level",
                link: "/admin/employee/job-level",
                label: "Cấp bậc công việc",
            },
            {
                key: "employee-job-title",
                link: "/admin/employee/job-title",
                label: "Chức danh công việc",
            },
        ],
        disableForEmployee: true,
    },
    {
        key: "customer",
        link: "/admin/customer",
        label: "Khách hàng",
        icon: <TeamOutlined />,
        children: [
            {
                key: "customer-group",
                link: "/admin/customer/group",
                label: "Nhóm khách hàng",
            },
            {
                key: "customer-status",
                link: "/admin/customer/status",
                label: "Trạng thái khách hàng",
            },
            {
                key: "customer-resource",
                link: "/admin/customer/resource",
                label: "Nguồn khách hàng",
            },
        ],
        disableForEmployee: true,
    },
    {
        key: "product",
        link: "/admin/product",
        label: "Sản phẩm",
        icon: <AppstoreOutlined />,
        children: [
            {
                key: "category",
                link: "/admin/category",
                label: "Danh mục sản phẩm",
            },
            {
                key: "product-brand",
                link: "/admin/product/brand",
                label: "Nhãn hiệu",
            },
            {
                key: "product-supplier",
                link: "/admin/product/supplier",
                label: "Nhà cung cấp",
            },
            {
                key: "product-unit",
                link: "/admin/product/unit",
                label: "Đơn vị tính",
            },
            {
                key: "product-tag",
                link: "/admin/product/tag",
                label: "Tag",
            },
            {
                key: "product-guarantee",
                link: "/admin/product/guarantee",
                label: "Bảo hành",
            },
            {
                key: "product-property",
                link: "/admin/product/property",
                label: "Thuộc tính sản phẩm",
            },
            {
                key: "product-specification",
                link: "/admin/product/specification",
                label: "Thông số sản phẩm",
            },
        ],
        disableForEmployee: true,
    },
    {
        key: "inventory",
        link: "/admin/inventory",
        label: "Tồn kho",
        icon: <ShopOutlined />,
        children: [
            {
                key: "inventory-warehouse",
                link: "/admin/inventory/warehouse",
                label: "Nhà kho",
            },
            {
                key: "inventory-purchase-order",
                link: "/admin/inventory/purchase-order",
                label: "Đơn mua hàng",
            },
            {
                key: "inventory-destination",
                link: "/admin/inventory/destination",
                label: "Điểm nhập hàng",
            },
            {
                key: "inventory-docket",
                link: "/admin/inventory/docket",
                label: "Phiếu nhập xuất kho",
            },
            {
                key: "inventory-docket-reason",
                link: "/admin/inventory/docket-reason",
                label: "Lý do phiếu NXK",
            },
            {
                key: "inventory-count",
                link: "/admin/inventory/count",
                label: "Phiếu kiểm kho",
            },
            {
                key: "inventory-transfer",
                link: "/admin/inventory/transfer",
                label: "Phiếu chuyển kho",
            },
        ],
    },
    {
        key: "order",
        link: "/admin/order",
        label: "Đơn hàng",
        icon: <ShoppingOutlined />,
        children: [
            {
                key: "order-resource",
                link: "/admin/order/resource",
                label: "Nguồn đơn hàng",
            },
            {
                key: "order-cancellation-reason",
                link: "/admin/order/cancellation-reason",
                label: "Lý do hủy đơn hàng",
            },
        ],
    },
    {
        key: "waybill",
        link: "/admin/waybill",
        label: "Vận đơn",
        icon: <CarOutlined />,
    },
    {
        key: "review",
        link: "/admin/review",
        label: "Đánh giá",
        icon: <CommentOutlined />,
    },
    {
        key: "reward-strategy",
        link: "/admin/reward-strategy",
        label: "Điểm thưởng",
        icon: <TrophyOutlined />,
        disableForEmployee: true,
    },
    {
        key: "voucher",
        link: "/admin/voucher",
        label: "Sổ quỹ",
        icon: <DollarOutlined />,
        children: [
            {
                key: "payment-method",
                link: "/admin/payment-method",
                label: "Hình thức thanh toán",
            },
            {
                key: "promotion",
                link: "/admin/promotion",
                label: "Khuyến mãi",
            },
        ],
        disableForEmployee: true,
    },
];

export function DefaultNavbar() {
    const { token } = useToken();
    const pathname = usePathname();
    const { opened } = useAppStore();
    const { isOnlyEmployee } = useAdminAuthStore();

    // Tìm key đang active từ pathname
    const findActiveKeys = () => {
        // Tìm parent key
        const parentKey = navbarLinks.find(
            (link) =>
                pathname === link.link || pathname.startsWith(`${link.link}/`),
        )?.key;

        // Nếu không có parent key, return empty array
        if (!parentKey) return [];

        // Tìm child key nếu có
        const parentLink = navbarLinks.find((link) => link.key === parentKey);
        const childKey = parentLink?.children?.find(
            (child) => pathname === child.link,
        )?.key;

        return childKey ? [parentKey, childKey] : [parentKey];
    };

    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>(
        findActiveKeys(),
    );

    // Cập nhật selected keys khi pathname thay đổi
    useEffect(() => {
        setSelectedKeys(findActiveKeys());
    }, [pathname]);

    const onOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    };

    // Chuyển đổi navbarLinks thành items cho Menu của Ant Design
    const menuItems = navbarLinks
        .filter((link) => !(isOnlyEmployee() && link.disableForEmployee))
        .map((link) => {
            const item = {
                key: link.key,
                icon: link.icon,
                label: <Link href={link.link}>{link.label}</Link>,
            };

            // Nếu có children, thêm submenu
            if (link.children && link.children.length > 0) {
                return {
                    ...item,
                    children: link.children.map((child) => ({
                        key: child.key,
                        label: <Link href={child.link}>{child.label}</Link>,
                    })),
                };
            }

            return item;
        });

    return (
        <Sider
            width={250}
            theme="light"
            collapsed={!opened}
            collapsible
            trigger={null}
            style={{
                background: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 64, // Phù hợp với chiều cao của Header
                bottom: 0,
            }}
        >
            <Menu
                mode="inline"
                openKeys={openKeys}
                selectedKeys={selectedKeys}
                onOpenChange={onOpenChange}
                style={{
                    borderRight: "none",
                    paddingTop: 8,
                }}
                items={menuItems}
            />
        </Sider>
    );
}

export default DefaultNavbar;
