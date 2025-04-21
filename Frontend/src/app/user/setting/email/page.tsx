"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Row,
    Col,
    Space,
    Input,
    Typography,
    Form,
    theme,
} from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import useTitle from "@/hooks/use-title";
import { UserResponse } from "@/models/User";

import MiscUtils from "@/utils/MiscUtils";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import ResourceURL from "@/constants/ResourceURL";
import NotifyUtils from "@/utils/NotifyUtils";
import { useAuthStore } from "@/stores/authStore";

const { Title } = Typography;
const { useToken } = theme;

// Define the request interface
interface ClientEmailSettingUserRequest {
    email: string;
}

// Zod schema for validation
const formSchema = z.object({
    email: z
        .string({ invalid_type_error: "Vui lòng không bỏ trống" })
        .email({ message: "Nhập email đúng định dạng" }),
});

function ClientSettingEmail() {
    useTitle("Cập nhật email");
    const { token } = useToken();
    const { user, updateUser } = useAuthStore();
    const [form] = Form.useForm();
    const [formChanged, setFormChanged] = useState(false);

    // Set initial values
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email,
            });
        }
    }, [user, form]);

    // API mutation for updating email
    const updateEmailSettingApi = useMutation<
        UserResponse,
        ErrorMessage,
        ClientEmailSettingUserRequest
    >(
        (requestBody) =>
            FetchUtils.postWithToken(
                ResourceURL.CLIENT_USER_EMAIL_SETTING,
                requestBody,
            ),
        {
            onSuccess: (userResponse) => {
                updateUser(userResponse);
                NotifyUtils.simpleSuccess("Cập nhật thành công");
                setFormChanged(false);
            },
            onError: () =>
                NotifyUtils.simpleFailed("Cập nhật không thành công"),
        },
    );

    // Handle form field changes
    const handleFieldChange = () => {
        const currentValues = form.getFieldsValue();
        const initialValues = { email: user?.email || "" };

        // Check if current form values are different from initial values
        setFormChanged(!MiscUtils.isEquals(initialValues, currentValues));
    };

    // Handle form submission
    const handleFormSubmit = async (values: { email: string }) => {
        try {
            // Validate form with Zod
            formSchema.parse(values);

            updateEmailSettingApi.mutate({
                email: values.email,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    form.setFields([
                        {
                            name: err.path as string[],
                            errors: [err.message],
                        },
                    ]);
                });
            }
        }
    };

    return (
        <main>
            <div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <ClientUserNavbar />
                    </Col>

                    <Col xs={24} md={18}>
                        <Card
                            bordered={false}
                            style={{
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                borderRadius: token.borderRadiusLG,
                            }}
                        >
                            <Space
                                direction="vertical"
                                size="large"
                                style={{ width: "100%" }}
                            >
                                <Title level={2}>Cập nhật email</Title>

                                <Row>
                                    <Col xs={24} lg={12}>
                                        <Form
                                            form={form}
                                            layout="vertical"
                                            onFinish={handleFormSubmit}
                                            onValuesChange={handleFieldChange}
                                            requiredMark
                                        >
                                            <Space
                                                direction="vertical"
                                                size="middle"
                                                style={{ width: "100%" }}
                                            >
                                                <Form.Item
                                                    label="Email"
                                                    name="email"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                        {
                                                            type: "email",
                                                            message:
                                                                "Nhập email đúng định dạng",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Nhập email của bạn"
                                                        prefix={
                                                            <MailOutlined />
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        disabled={!formChanged}
                                                        loading={
                                                            updateEmailSettingApi.isLoading
                                                        }
                                                    >
                                                        Cập nhật
                                                    </Button>
                                                </Form.Item>
                                            </Space>
                                        </Form>
                                    </Col>
                                </Row>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </main>
    );
}

export default ClientSettingEmail;
