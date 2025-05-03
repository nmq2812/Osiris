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
    notification,
} from "antd";
import { useRouter } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import CustomerResourceConfigs from "../CustomerResourceConfigs";
import useCustomerResourceCreateViewModel from "../CustomerResourceCreate.vm";

function CustomerResourceCreate() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();

    const {
        form: mantineForm,
        handleFormSubmit,
        statusSelectList,
    } = useCustomerResourceCreateViewModel();

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
        mantineForm.setValues(values);
        // Sử dụng setTimeout để tránh vòng lặp vô hạn
        setTimeout(() => {
            handleFormSubmit(new Event("submit") as any);
        }, 0);
    };

    return (
        <>
            {contextHolder}
            <Space
                direction="vertical"
                style={{ width: "100%", maxWidth: 800 }}
            >
                <CreateUpdateTitle
                    managerPath={CustomerResourceConfigs.managerPath}
                    title={CustomerResourceConfigs.createTitle}
                />

                <DefaultPropertyPanel />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        code: "",
                        name: "",
                        description: "",
                        color: "#1890ff",
                        status: "1",
                    }}
                >
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
                            <Button onClick={() => form.resetFields()}>
                                Mặc định
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </div>
                    </Card>
                </Form>
            </Space>
        </>
    );
}

export default CustomerResourceCreate;
