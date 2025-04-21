"use client";
import React, { useEffect } from "react";

import { Space, Card, Typography, Input, Button } from "antd";
import { useMutation } from "@tanstack/react-query";

import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import ResourceURL from "@/constants/ResourceURL";
import { ResetPasswordRequest } from "@/datas/ClientUI";
import { Empty } from "@/datas/Utility";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import MessageUtils from "@/utils/MessageUtils";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useSearchParams } from "next/navigation";

const { Title, Text } = Typography;

function ClientChangePassword() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !email) {
            navigate("/");
        }
    }, [email, navigate, token]);

    const formSchema = z.object({
        newPassword: z
            .string({ invalid_type_error: "Vui lòng không bỏ trống" })
            .min(1, MessageUtils.min("Mật khẩu", 1)),
        newPasswordAgain: z
            .string({ invalid_type_error: "Vui lòng không bỏ trống" })
            .min(1, MessageUtils.min("Mật khẩu", 1)),
    });

    const initialFormValues = {
        newPassword: "",
        newPasswordAgain: "",
    };

    const form = useForm({
        initialValues: initialFormValues,
        schema: zodResolver(formSchema),
    });

    const resetPasswordApi = useMutation<
        Empty,
        ErrorMessage,
        ResetPasswordRequest
    >(
        (requestBody) =>
            FetchUtils.put(ResourceURL.CLIENT_RESET_PASSWORD, requestBody),
        {
            onSuccess: () => {
                NotifyUtils.simpleSuccess("Đổi mật khẩu mới thành công");
            },
            onError: () =>
                NotifyUtils.simpleFailed("Đổi mật khẩu không thành công"),
        },
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        if (formValues.newPassword !== formValues.newPasswordAgain) {
            form.setFieldError("newPasswordAgain", "Mật khẩu không trùng khớp");
        } else if (token && email) {
            const requestBody: ResetPasswordRequest = {
                token: token,
                email: email,
                password: formValues.newPassword,
            };

            resetPasswordApi.mutate(requestBody);
        }
    });

    return (
        <main>
            <div
                style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
            >
                <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%" }}
                >
                    <Title level={2}>Đổi mật khẩu</Title>

                    <Card
                        style={{
                            width: "100%",
                            maxWidth: 400,
                            marginTop: 20,
                            borderRadius: 8,
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        }}
                        bodyStyle={{ padding: 30 }}
                    >
                        <form onSubmit={handleFormSubmit}>
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                                size="middle"
                            >
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text strong>Mật khẩu mới</Text>
                                        <span style={{ color: "red" }}> *</span>
                                    </label>
                                    <Input.Password
                                        placeholder="Nhập mật khẩu mới"
                                        value={form.values.newPassword}
                                        onChange={(e) =>
                                            form.setFieldValue(
                                                "newPassword",
                                                e.target.value,
                                            )
                                        }
                                        status={
                                            form.errors.newPassword
                                                ? "error"
                                                : undefined
                                        }
                                        style={{ borderRadius: 6 }}
                                    />
                                    {form.errors.newPassword && (
                                        <Text
                                            type="danger"
                                            style={{
                                                fontSize: "12px",
                                                marginTop: 4,
                                            }}
                                        >
                                            {form.errors.newPassword}
                                        </Text>
                                    )}
                                </div>

                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text strong>
                                            Nhập lại mật khẩu mới
                                        </Text>
                                        <span style={{ color: "red" }}> *</span>
                                    </label>
                                    <Input.Password
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={form.values.newPasswordAgain}
                                        onChange={(e) =>
                                            form.setFieldValue(
                                                "newPasswordAgain",
                                                e.target.value,
                                            )
                                        }
                                        status={
                                            form.errors.newPasswordAgain
                                                ? "error"
                                                : undefined
                                        }
                                        style={{ borderRadius: 6 }}
                                    />
                                    {form.errors.newPasswordAgain && (
                                        <Text
                                            type="danger"
                                            style={{
                                                fontSize: "12px",
                                                marginTop: 4,
                                            }}
                                        >
                                            {form.errors.newPasswordAgain}
                                        </Text>
                                    )}
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ borderRadius: 6 }}
                                    block
                                    loading={resetPasswordApi.isLoading}
                                    disabled={
                                        MiscUtils.isEquals(
                                            initialFormValues,
                                            form.values,
                                        ) || resetPasswordApi.isLoading
                                    }
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Space>
                        </form>
                    </Card>
                </Space>
            </div>
        </main>
    );
}

export default ClientChangePassword;
