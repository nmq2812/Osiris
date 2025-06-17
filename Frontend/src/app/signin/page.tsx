"use client";

import React, { useEffect, useState } from "react";
import {
    Alert,
    Typography,
    Button,
    Card,
    Form,
    Input,
    Row,
    Col,
    Space,
    Spin,
} from "antd";
import useTitle from "@/hooks/use-title";
import { z } from "zod";
import MessageUtils from "@/utils/MessageUtils";
import { useForm } from "antd/es/form/Form";
import { JwtResponse, LoginRequest } from "@/models/Authentication";
import { useMutation } from "@tanstack/react-query";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import ResourceURL from "@/constants/ResourceURL";
import NotifyUtils from "@/utils/NotifyUtils";
import useAuthStore from "@/stores/authStore";
import { UserResponse } from "@/models/User";
import { AlertCircle } from "tabler-icons-react";
import { ClientCartResponse } from "@/datas/ClientUI";
import { useRouter } from "next/navigation";
import { Empty } from "@/datas/Utility";
import Link from "next/link";

const { Title, Text, Link: TextLink } = Typography;

const formSchema = z.object({
    username: z
        .string({ invalid_type_error: "Vui lòng không bỏ trống" })
        .min(2, MessageUtils.min("Tên tài khoản", 2)),
    password: z
        .string({ invalid_type_error: "Vui lòng không bỏ trống" })
        .min(1, MessageUtils.min("Mật khẩu", 1)),
});

const LoginPage = () => {
    useTitle();

    const {
        user,
        updateJwtToken,
        updateUser,
        resetAuthState,
        updateCurrentCartId,
        updateCurrentTotalCartItems,
    } = useAuthStore();

    const [counter, setCounter] = useState(3);
    const [openedAlert, setOpenedAlert] = useState(false);

    const router = useRouter();
    const [form] = useForm();

    const loginApi = useMutation<JwtResponse, ErrorMessage, LoginRequest>({
        mutationFn: (requestBody) =>
            FetchUtils.post(ResourceURL.LOGIN, requestBody),
    });

    const userInfoApi = useMutation<UserResponse, ErrorMessage>({
        mutationFn: (_) =>
            FetchUtils.getWithToken(ResourceURL.CLIENT_USER_INFO),
    });

    const cartApi = useMutation<ClientCartResponse | Empty, ErrorMessage>({
        mutationFn: (_) => FetchUtils.getWithToken(ResourceURL.CLIENT_CART),
    });

    useEffect(() => {
        if (openedAlert && user && counter > 0) {
            setTimeout(() => setCounter(counter - 1), 1000);
        }

        if (counter === 0) {
            router.replace("/");
        }
    }, [counter, router, openedAlert, user]);

    const handleFormSubmit = async (values: any) => {
        if (!user) {
            const loginRequest: LoginRequest = {
                username: values.username,
                password: values.password,
            };

            try {
                const jwtResponse = await loginApi.mutateAsync(loginRequest);
                updateJwtToken(jwtResponse.token);

                const userResponse = await userInfoApi.mutateAsync();
                updateUser(userResponse);

                const cartResponse = await cartApi.mutateAsync();
                if (Object.hasOwn(cartResponse, "cartId")) {
                    updateCurrentCartId(cartResponse.cartId);
                    updateCurrentTotalCartItems(cartResponse.cartItems.length);
                } else {
                    updateCurrentCartId(null);
                    updateCurrentTotalCartItems(0);
                }

                NotifyUtils.simpleSuccess("Đăng nhập thành công");
                setOpenedAlert(true);
            } catch (e) {
                resetAuthState();
                NotifyUtils.simpleFailed("Đăng nhập thất bại");
            }
        }
    };

    return (
        <main>
            <div
                className="container"
                style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
            >
                {openedAlert && (
                    <Alert
                        message="Bạn đã đăng nhập thành công!"
                        description={`Trở về trang chủ trong vòng ${counter} giây...`}
                        type="success"
                        showIcon
                        icon={<AlertCircle size={16} />}
                        style={{ marginBottom: 24 }}
                    />
                )}

                <Row>
                    <Col xs={24} sm={24} md={12} lg={10}>
                        <Card
                            style={{
                                minHeight: 600,
                                borderRight: "1px solid #f0f0f0",
                                padding: "30px",
                            }}
                        >
                            <Title
                                level={2}
                                style={{
                                    textAlign: "center",
                                    marginTop: 50,
                                    marginBottom: 50,
                                }}
                            >
                                Đăng nhập
                            </Title>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleFormSubmit}
                                disabled={!!user}
                            >
                                <Form.Item
                                    label="Tên tài khoản"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng không bỏ trống",
                                        },
                                        {
                                            min: 2,
                                            message: MessageUtils.min(
                                                "Tên tài khoản",
                                                2,
                                            ),
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nhập tên tài khoản của bạn"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng không bỏ trống",
                                        },
                                        {
                                            min: 1,
                                            message: MessageUtils.min(
                                                "Mật khẩu",
                                                1,
                                            ),
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        placeholder="Nhập mật khẩu của bạn"
                                        size="large"
                                    />
                                </Form.Item>

                                <div style={{ marginTop: 5 }}>
                                    <Link href="/forgot">Quên mật khẩu?</Link>
                                </div>

                                <Form.Item style={{ marginTop: 24 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        block
                                        loading={loginApi.isPending}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Text
                                style={{
                                    textAlign: "center",
                                    display: "block",
                                    marginTop: 16,
                                }}
                            >
                                Không có tài khoản?{" "}
                                <Link
                                    href="/signup"
                                    style={{ fontWeight: 700 }}
                                >
                                    Đăng ký ngay
                                </Link>
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={0} sm={0} md={12} lg={14}>
                        <div
                            style={{
                                minHeight: 600,
                                backgroundSize: "cover",
                                backgroundImage:
                                    "url(https://images.unsplash.com/photo-1487875961445-47a00398c267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80)",
                                backgroundPosition: "bottom",
                            }}
                        />
                    </Col>
                </Row>
            </div>
        </main>
    );
};

export default LoginPage;
