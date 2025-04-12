"use client";
import React from "react";
import { Button, Card, Input, Space, Typography } from "antd";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "react-query";
import ResourceURL from "@/constants/ResourceURL";
import { Empty } from "@/datas/Utility";
import useTitle from "@/hooks/use-title";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";

const { Text, Title } = Typography;

function ClientForgotPassword() {
    useTitle();

    const initialFormValues = {
        email: "",
    };

    const formSchema = z.object({
        email: z
            .string({ invalid_type_error: "Vui lòng không bỏ trống" })
            .email({ message: "Nhập email đúng định dạng" }),
    });

    const form = useForm({
        initialValues: initialFormValues,
        schema: zodResolver(formSchema),
    });

    const forgotPasswordApi = useMutation<
        Empty,
        ErrorMessage,
        { email: string }
    >(
        (request) =>
            FetchUtils.get(ResourceURL.CLIENT_FORGOT_PASSWORD, {
                email: request.email,
            }),
        {
            onSuccess: () =>
                NotifyUtils.simpleSuccess(
                    "Đã gửi email đổi mật khẩu thành công",
                ),
            onError: () =>
                NotifyUtils.simpleFailed("Gửi email không thành công"),
        },
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        forgotPasswordApi.mutate({ email: formValues.email });
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
                    <Title level={2}>Yêu cầu cấp lại mật khẩu</Title>

                    <Text type="secondary">
                        Nhập email của bạn để nhận thư chứa đường dẫn thay đổi
                        mật khẩu
                    </Text>

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
                            >
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text strong>Email</Text>
                                        <span style={{ color: "red" }}> *</span>
                                    </label>
                                    <Input
                                        placeholder="Nhập email của bạn"
                                        value={form.values.email}
                                        onChange={(e) =>
                                            form.setFieldValue(
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        status={
                                            form.errors.email
                                                ? "error"
                                                : undefined
                                        }
                                        style={{ borderRadius: 6 }}
                                    />
                                    {form.errors.email && (
                                        <Text
                                            type="danger"
                                            style={{
                                                fontSize: "12px",
                                                marginTop: 4,
                                            }}
                                        >
                                            {form.errors.email}
                                        </Text>
                                    )}
                                </div>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ borderRadius: 6 }}
                                    block
                                    loading={forgotPasswordApi.isLoading}
                                    disabled={
                                        MiscUtils.isEquals(
                                            initialFormValues,
                                            form.values,
                                        ) || forgotPasswordApi.isLoading
                                    }
                                >
                                    Yêu cầu
                                </Button>
                            </Space>
                        </form>
                    </Card>
                </Space>
            </div>
        </main>
    );
}

export default ClientForgotPassword;
