"use client";
import React, { useEffect } from "react";
import {
    Button,
    Card,
    Divider,
    Row,
    Col,
    Form,
    Input,
    Select,
    Space,
    Spin,
    notification,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import CustomerResourceConfigs from "../../CustomerResourceConfigs";
import useCustomerResourceUpdateViewModel from "../../CustomerResourceUpdate.vm";

function CustomerResourceUpdate() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();

    const params = useParams();
    const id = typeof params.slug === "string" ? parseInt(params.slug) : 0;

    const {
        customerResource,
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isSubmitDisabled,
        updateStatus,
    } = useCustomerResourceUpdateViewModel(Number(id));

    // Chuyển đổi dữ liệu cho Ant Design Select
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{
            code: string;
            name: string;
            description: string;
            color: string;
            status: string;
        }>,
    ) => {
        // Sử dụng setTimeout để tránh lỗi update depth exceeded
        setTimeout(() => {
            mantineForm.setValues(values);
            handleFormSubmit(new Event("submit") as any);
        }, 0);
    };

    // Hiển thị thông báo khi cập nhật thành công hoặc thất bại
    useEffect(() => {
        if (updateStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Cập nhật nguồn khách hàng thành công!",
                onClose: () => router.push(CustomerResourceConfigs.managerPath),
            });
        } else if (updateStatus === "error") {
            api.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật nguồn khách hàng.",
            });
        }
    }, [updateStatus, api, router]);

    // Đồng bộ giữa mantineForm và form của Ant Design
    useEffect(() => {
        if (mantineForm.values && Object.keys(mantineForm.values).length > 0) {
            // So sánh giá trị hiện tại trước khi cập nhật để tránh vòng lặp vô hạn
            const currentValues = form.getFieldsValue();
            const hasChanges =
                JSON.stringify(currentValues) !==
                JSON.stringify(mantineForm.values);

            if (hasChanges) {
                form.setFieldsValue(mantineForm.values);
            }
        }
    }, [mantineForm.values, form]);

    // Hiển thị loading khi chưa có dữ liệu
    if (!customerResource) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <div>Đang tải dữ liệu...</div>
                </Space>
            </div>
        );
    }

    return (
        <>
            {contextHolder}
            <Space
                direction="vertical"
                style={{ width: "100%", maxWidth: 800 }}
            >
                <CreateUpdateTitle
                    managerPath={CustomerResourceConfigs.managerPath}
                    title={CustomerResourceConfigs.updateTitle}
                />

                <DefaultPropertyPanel
                    id={customerResource.id}
                    createdAt={customerResource.createdAt}
                    updatedAt={customerResource.updatedAt}
                    createdBy="1"
                    updatedBy="1"
                />

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Card>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="code"
                                    label={
                                        CustomerResourceConfigs.properties.code
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mã nguồn",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="name"
                                    label={
                                        CustomerResourceConfigs.properties.name
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập tên nguồn",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label={
                                        CustomerResourceConfigs.properties
                                            .description.label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mô tả",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="color"
                                    label={
                                        CustomerResourceConfigs.properties.color
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn màu sắc",
                                        },
                                    ]}
                                >
                                    <Input
                                        type="color"
                                        style={{ width: "100%", height: 32 }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="status"
                                    label={
                                        CustomerResourceConfigs.properties
                                            .status.label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn trạng thái",
                                        },
                                    ]}
                                >
                                    <Select options={statusOptions} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button onClick={() => handleReset()}>
                                Mặc định
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isSubmitDisabled}
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </Card>
                </Form>
            </Space>
        </>
    );
}

export default CustomerResourceUpdate;
