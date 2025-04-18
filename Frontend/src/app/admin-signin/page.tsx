"use client";

import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    Card,
    Space,
    Typography,
    Spin,
    theme,
} from "antd";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { z } from "zod";
import ResourceURL from "@/constants/ResourceURL";
import useTitle from "@/hooks/use-title";
import { JwtResponse, LoginRequest } from "@/models/Authentication";
import { UserResponse } from "@/models/User";
import useAdminAuthStore from "@/stores/use-admin-auth-store";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import MessageUtils from "@/utils/MessageUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import OsirisLogo from "@/components/OsirisLogo";

const { useToken } = theme;
const { Title } = Typography;

// Sử dụng zod để xác thực
const formSchema = z.object({
    username: z
        .string({ invalid_type_error: "Vui lòng không bỏ trống" })
        .min(2, MessageUtils.min("Tên tài khoản", 2)),
    password: z
        .string({ invalid_type_error: "Vui lòng không bỏ trống" })
        .min(1, MessageUtils.min("Mật khẩu", 1)),
});

function AdminSignin() {
    useTitle("Đăng nhập Admin");
    const router = useRouter();
    const { token } = useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const { user, updateJwtToken, updateUser, resetAdminAuthState } =
        useAdminAuthStore();

    const loginApi = useMutation<JwtResponse, ErrorMessage, LoginRequest>(
        (requestBody) => FetchUtils.post(ResourceURL.LOGIN, requestBody),
    );

    const userInfoApi = useMutation<UserResponse, ErrorMessage>((_) =>
        FetchUtils.getWithToken(ResourceURL.ADMIN_USER_INFO, undefined, true),
    );

    // Xử lý đăng nhập
    const handleFormSubmit = async (values: {
        username: string;
        password: string;
    }) => {
        if (user) return;

        try {
            setLoading(true);
            // Xác thực dữ liệu với zod
            formSchema.parse(values);

            const loginRequest: LoginRequest = {
                username: values.username,
                password: values.password,
            };

            const jwtResponse = await loginApi.mutateAsync(loginRequest);
            updateJwtToken(jwtResponse.token);


            const userResponse = await userInfoApi.mutateAsync();
            updateUser(userResponse);


            router.replace("/admin");

            NotifyUtils.simpleSuccess("Đăng nhập thành công");
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    form.setFields([
                        {
                            name: err.path[0] as string,
                            errors: [err.message],
                        },
                    ]);
                });
            } else {
                resetAdminAuthState();
                NotifyUtils.simpleFailed("Đăng nhập thất bại");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundColor: token.colorBgLayout,
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ width: "100%", maxWidth: 375, padding: "40px 16px" }}>
                <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%" }}
                >
                    <OsirisLogo />
                    <Card
                        bordered
                        style={{
                            width: "100%",
                            marginTop: 30,
                            borderRadius: 8,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Title
                            level={4}
                            style={{ textAlign: "center", marginBottom: 24 }}
                        >
                            Đăng nhập quản trị
                        </Title>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFormSubmit}
                            disabled={!!user}
                            initialValues={{ username: "", password: "" }}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên tài khoản",
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
                                    prefix={<UserOutlined />}
                                    placeholder="Tên tài khoản"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mật khẩu",
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
                                    prefix={<LockOutlined />}
                                    placeholder="Mật khẩu"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item style={{ marginTop: 24 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    loading={loading}
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Space>
            </div>
        </div>
    );
}

export default AdminSignin;
