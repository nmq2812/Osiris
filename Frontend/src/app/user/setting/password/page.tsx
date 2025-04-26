"use client";
import React, { useState } from "react";
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
import { LockOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import useTitle from "@/hooks/use-title";
import MiscUtils from "@/utils/MiscUtils";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import ResourceURL from "@/constants/ResourceURL";
import NotifyUtils from "@/utils/NotifyUtils";
import MessageUtils from "@/utils/MessageUtils";

const { Title } = Typography;
const { useToken } = theme;
const { Password } = Input;

// Define the request interface
interface ClientPasswordSettingUserRequest {
    oldPassword: string;
    newPassword: string;
}

// Zod schema for validation
const formSchema = z.object({
    oldPassword: z
        .string({ invalid_type_error: "Vui lòng không bỏ trống" })
        .min(1, MessageUtils.min("Mật khẩu", 1)),
    newPassword: z
        .string({ invalid_type_error: "Vui lòng không bỏ trống" })
        .min(1, MessageUtils.min("Mật khẩu", 1)),
    newPasswordAgain: z
        .string({ invalid_type_error: "Vui lòng không bỏ trống" })
        .min(1, MessageUtils.min("Mật khẩu", 1)),
});

function ClientSettingPassword() {
    useTitle("Đổi mật khẩu");
    const { token } = useToken();
    const [form] = Form.useForm();
    const [formChanged, setFormChanged] = useState(false);

    // Initial form values
    const initialFormValues = {
        oldPassword: "",
        newPassword: "",
        newPasswordAgain: "",
    };

    // API mutation for updating password
    const updatePasswordSettingApi = useMutation<
        never,
        ErrorMessage,
        ClientPasswordSettingUserRequest
    >({
        mutationFn: (requestBody) =>
            FetchUtils.postWithToken(
                ResourceURL.CLIENT_USER_PASSWORD_SETTING,
                requestBody,
            ),

        onSuccess: () => {
            NotifyUtils.simpleSuccess("Cập nhật thành công");
            form.resetFields();
            setFormChanged(false);
        },
        onError: () => NotifyUtils.simpleFailed("Cập nhật không thành công"),
    });

    // Handle form field changes
    const handleFieldChange = () => {
        const currentValues = form.getFieldsValue();

        // Check if current form values are different from initial values
        const hasChanged = !MiscUtils.isEquals(
            initialFormValues,
            currentValues,
        );
        setFormChanged(hasChanged);
    };

    // Handle form submission
    const handleFormSubmit = (values: {
        oldPassword: string;
        newPassword: string;
        newPasswordAgain: string;
    }) => {
        try {
            // Validate form with Zod
            formSchema.parse(values);

            // Check if passwords match
            if (values.newPassword !== values.newPasswordAgain) {
                form.setFields([
                    {
                        name: ["newPasswordAgain"],
                        errors: ["Mật khẩu không trùng khớp"],
                    },
                ]);
                return;
            }

            // All validations passed, submit the form
            updatePasswordSettingApi.mutate({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
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
                                <Title level={2}>Đổi mật khẩu</Title>

                                <Row>
                                    <Col xs={24} lg={12}>
                                        <Form
                                            form={form}
                                            layout="vertical"
                                            onFinish={handleFormSubmit}
                                            onValuesChange={handleFieldChange}
                                            initialValues={initialFormValues}
                                            requiredMark
                                        >
                                            <Space
                                                direction="vertical"
                                                size="middle"
                                                style={{ width: "100%" }}
                                            >
                                                <Form.Item
                                                    label="Mật khẩu hiện tại"
                                                    name="oldPassword"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                        {
                                                            min: 1,
                                                            message:
                                                                MessageUtils.min(
                                                                    "Mật khẩu",
                                                                    1,
                                                                ),
                                                        },
                                                    ]}
                                                >
                                                    <Password
                                                        placeholder="Nhập mật khẩu hiện tại"
                                                        prefix={
                                                            <LockOutlined />
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Mật khẩu mới"
                                                    name="newPassword"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                        {
                                                            min: 1,
                                                            message:
                                                                MessageUtils.min(
                                                                    "Mật khẩu",
                                                                    1,
                                                                ),
                                                        },
                                                    ]}
                                                >
                                                    <Password
                                                        placeholder="Nhập mật khẩu mới"
                                                        prefix={
                                                            <LockOutlined />
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Nhập lại mật khẩu mới"
                                                    name="newPasswordAgain"
                                                    dependencies={[
                                                        "newPassword",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                        {
                                                            min: 1,
                                                            message:
                                                                MessageUtils.min(
                                                                    "Mật khẩu",
                                                                    1,
                                                                ),
                                                        },
                                                        ({
                                                            getFieldValue,
                                                        }) => ({
                                                            validator(
                                                                _,
                                                                value,
                                                            ) {
                                                                if (
                                                                    !value ||
                                                                    getFieldValue(
                                                                        "newPassword",
                                                                    ) === value
                                                                ) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(
                                                                    new Error(
                                                                        "Mật khẩu không trùng khớp",
                                                                    ),
                                                                );
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Password
                                                        placeholder="Nhập lại mật khẩu mới"
                                                        prefix={
                                                            <LockOutlined />
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        disabled={!formChanged}
                                                        loading={
                                                            updatePasswordSettingApi.isPending
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

export default ClientSettingPassword;
