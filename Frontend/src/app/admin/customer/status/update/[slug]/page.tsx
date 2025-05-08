"use client";
import React, { useEffect } from "react";
import {
    Button,
    Card,
    Divider,
    Form,
    Input,
    Select,
    Space,
    Row,
    Col,
    Spin,
} from "antd";
import { ColorPicker } from "antd";
import { useParams } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import CustomerStatusConfigs from "../../CustomerStatusConfigs";
import useCustomerStatusUpdateViewModel from "../../CustomerStatusUpdate.vm";

function CustomerStatusUpdate() {
    const { slug } = useParams();
    const id = Number(slug);
    const [form] = Form.useForm();

    const {
        customerStatus,
        form: mantineForm,
        handleFormSubmit,
        statusSelectList,
        isLoading,
    } = useCustomerStatusUpdateViewModel(id);

    // Chuyển đổi statusSelectList cho Ant Design format
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Cập nhật form khi dữ liệu sẵn sàng
    useEffect(() => {
        if (customerStatus) {
            form.setFieldsValue({
                code: customerStatus.code,
                name: customerStatus.name,
                description: customerStatus.description,
                color: customerStatus.color,
                status: String(customerStatus.status),
            });
        }
    }, [customerStatus, form]);

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!customerStatus) {
        return null;
    }

    // Xử lý form submit
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
        handleFormSubmit();
    };

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={CustomerStatusConfigs.managerPath}
                title={CustomerStatusConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={customerStatus.id}
                createdAt={customerStatus.createdAt}
                updatedAt={customerStatus.updatedAt}
                createdBy={customerStatus.createdBy?.username || "1"}
                updatedBy={customerStatus.updatedBy?.username || "1"}
            />

            <Card>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="code"
                                label={
                                    CustomerStatusConfigs.properties.code.label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã trạng thái",
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
                                    CustomerStatusConfigs.properties.name.label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên trạng thái",
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
                                    CustomerStatusConfigs.properties.description
                                        .label
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
                                    CustomerStatusConfigs.properties.color.label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn màu",
                                    },
                                ]}
                            >
                                <ColorPicker allowClear format="hex" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="status"
                                label={
                                    CustomerStatusConfigs.properties.status
                                        .label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn trạng thái",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--"
                                    options={statusOptions}
                                />
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
                            Cập nhật
                        </Button>
                    </div>
                </Form>
            </Card>
        </Space>
    );
}

export default CustomerStatusUpdate;
