"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Layout, Row, Col, Typography, Space, Button, Divider } from "antd";
import {
    FacebookOutlined,
    YoutubeOutlined,
    InstagramOutlined,
    CustomerServiceOutlined,
} from "@ant-design/icons";
import useAdminAuthStore from "@/stores/use-admin-auth-store";

const { Footer } = Layout;
const { Text, Title } = Typography;

function ClientFooter() {
    const { user } = useAdminAuthStore();

    if (user) {
        return null; // Không hiển thị footer nếu đã đăng nhập
    }
    return (
        <Footer className="bg-gray-100 pt-16 pb-8 mt-16 border-t border-gray-200">
            <div className="container mx-auto max-w-7xl px-4">
                <Row gutter={[32, 48]}>
                    <Col xs={24} md={12}>
                        <Space
                            direction="vertical"
                            size="large"
                            className="w-full"
                        >
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center">
                                    <Image
                                        src="/logo.png"
                                        alt="Osiris Logo"
                                        width={40}
                                        height={40}
                                        className="mr-2"
                                    />
                                    <span className="text-2xl font-bold text-blue-600">
                                        OSIRIS
                                    </span>
                                </Link>
                            </div>

                            <Space size="middle" align="start">
                                <div className="flex items-center justify-center rounded-full bg-blue-50 p-3">
                                    <CustomerServiceOutlined
                                        style={{
                                            fontSize: "28px",
                                            color: "#1890ff",
                                        }}
                                    />
                                </div>
                                <Space direction="vertical" size={0}>
                                    <Text type="secondary">
                                        Tổng đài hỗ trợ
                                    </Text>
                                    <Text strong style={{ fontSize: "18px" }}>
                                        (024) 3535 7272, (028) 35 111 222
                                    </Text>
                                </Space>
                            </Space>

                            <Space direction="vertical" size={4}>
                                <Text strong>Địa chỉ liên hệ</Text>
                                <Text>
                                    Tòa nhà Bitexco, Quận 1, Thành phố Hồ Chí
                                    Minh
                                </Text>
                            </Space>

                            <Space>
                                <Button
                                    type="default"
                                    shape="circle"
                                    icon={
                                        <FacebookOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    }
                                    size="large"
                                    className="flex items-center justify-center"
                                />
                                <Button
                                    type="default"
                                    shape="circle"
                                    icon={
                                        <YoutubeOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    }
                                    size="large"
                                    className="flex items-center justify-center"
                                />
                                <Button
                                    type="default"
                                    shape="circle"
                                    icon={
                                        <InstagramOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    }
                                    size="large"
                                    className="flex items-center justify-center"
                                />
                            </Space>
                        </Space>
                    </Col>

                    <Col xs={24} md={12}>
                        <Row gutter={[16, 32]}>
                            <Col xs={12}>
                                <Space
                                    direction="vertical"
                                    size="small"
                                    className="w-full"
                                >
                                    <Text strong>Hỗ trợ khách hàng</Text>
                                    <Space
                                        direction="vertical"
                                        size={8}
                                        className="w-full"
                                    >
                                        <Link
                                            href="/"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Câu hỏi thường gặp
                                        </Link>
                                        <Link
                                            href="/"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Hướng dẫn đặt hàng
                                        </Link>
                                        <Link
                                            href="/"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Phương thức vận chuyển
                                        </Link>
                                        <Link
                                            href="/"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Chính sách đổi trả
                                        </Link>
                                        <Link
                                            href="/"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Chính sách thanh toán
                                        </Link>
                                        <Link
                                            href="/"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Giải quyết khiếu nại
                                        </Link>
                                        <Link
                                            href="/"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            Chính sách bảo mật
                                        </Link>
                                    </Space>
                                </Space>
                            </Col>

                            <Col xs={12}>
                                <Space
                                    direction="vertical"
                                    size="small"
                                    className="w-full h-full flex flex-col justify-between"
                                >
                                    <div>
                                        <Text strong>Giới thiệu</Text>
                                        <Space
                                            direction="vertical"
                                            size={8}
                                            className="w-full mt-2"
                                        >
                                            <Link
                                                href="/"
                                                className="text-gray-600 hover:text-blue-600"
                                            >
                                                Về Công ty
                                            </Link>
                                            <Link
                                                href="/"
                                                className="text-gray-600 hover:text-blue-600"
                                            >
                                                Tuyển dụng
                                            </Link>
                                            <Link
                                                href="/"
                                                className="text-gray-600 hover:text-blue-600"
                                            >
                                                Hợp tác
                                            </Link>
                                            <Link
                                                href="/"
                                                className="text-gray-600 hover:text-blue-600"
                                            >
                                                Liên hệ mua hàng
                                            </Link>
                                        </Space>
                                    </div>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Divider className="my-8" />

                <Row justify="space-between" align="middle">
                    <Col>
                        <Text type="secondary">
                            © 2025 Osiris Corporation. Bảo lưu mọi quyền.
                        </Text>
                    </Col>
                    <Col>
                        <Space size="small">
                            <div className="border border-gray-300 rounded px-3 py-1">
                                <img
                                    src="/visa.svg"
                                    alt="Visa"
                                    width={30}
                                    height={20}
                                />
                            </div>
                            <div className="border border-gray-300 rounded px-3 py-1">
                                <img
                                    src="/mastercard.svg"
                                    alt="Mastercard"
                                    width={30}
                                    height={20}
                                />
                            </div>
                            <div className="border border-gray-300 rounded px-3 py-1">
                                <img
                                    src="/bank.svg"
                                    alt="Bank Transfer"
                                    width={30}
                                    height={20}
                                />
                            </div>
                            <div className="border border-gray-300 rounded px-3 py-1">
                                <img
                                    src="/cash.svg"
                                    alt="Cash"
                                    width={30}
                                    height={20}
                                />
                            </div>
                        </Space>
                    </Col>
                </Row>
            </div>
        </Footer>
    );
}

export default React.memo(ClientFooter);
