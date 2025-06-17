"use client";
import React, { useEffect } from "react";
import {
    Button,
    Card,
    Divider,
    Row,
    Col,
    Input,
    Form,
    Select,
    Space,
    notification,
} from "antd";
import { useRouter } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import CustomerGroupConfigs from "../CustomerGroupConfigs";
import useCustomerGroupCreateViewModel from "../CustomerGroupCreate.vm";

function CustomerGroupCreate() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();

    const {
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        createStatus,
    } = useCustomerGroupCreateViewModel();

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
        handleFormSubmit(new Event("submit") as any);
    };

    // Theo dõi createStatus để hiển thị thông báo
    useEffect(() => {
        if (createStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Thêm nhóm khách hàng mới thành công!",
                onClose: () => router.push(CustomerGroupConfigs.managerPath),
            });
        } else if (createStatus === "error") {
            api.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi thêm nhóm khách hàng mới.",
            });
        }
    }, [createStatus, api, router]);

    return (
        <>
            {contextHolder}
            <Space
                direction="vertical"
                style={{ width: "100%", maxWidth: 800 }}
            >
                <CreateUpdateTitle
                    managerPath={CustomerGroupConfigs.managerPath}
                    title={CustomerGroupConfigs.createTitle}
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
                                        CustomerGroupConfigs.properties.code
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mã nhóm",
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
                                        CustomerGroupConfigs.properties.name
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập tên nhóm",
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
                                        CustomerGroupConfigs.properties
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
                                        CustomerGroupConfigs.properties.color
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
                                        CustomerGroupConfigs.properties.status
                                            .label
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

export default CustomerGroupCreate;
