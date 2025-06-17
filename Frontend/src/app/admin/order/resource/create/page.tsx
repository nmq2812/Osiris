"use client";
import React from "react";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Space,
    ColorPicker,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import OrderResourceConfigs from "../OrderResourceConfigs";
import useOrderResourceCreateViewModel from "../OrderResourceCreate.vm";

function OrderResourceCreate() {
    const {
        form,
        handleFormSubmit,
        customerResourceSelectList,
        statusSelectList,
    } = useOrderResourceCreateViewModel();

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        code: form.values.code,
        name: form.values.name,
        color: form.values.color,
        customerResourceId: form.values.customerResourceId,
        status: form.values.status,
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", maxWidth: 800 }}
        >
            <CreateUpdateTitle
                managerPath={OrderResourceConfigs.managerPath}
                title={OrderResourceConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={handleFormSubmit}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={
                                    OrderResourceConfigs.properties.code.label
                                }
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập mã nguồn đơn hàng",
                                    },
                                ]}
                                validateStatus={form.errors.code ? "error" : ""}
                                help={form.errors.code}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={
                                    OrderResourceConfigs.properties.name.label
                                }
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập tên nguồn đơn hàng",
                                    },
                                ]}
                                validateStatus={form.errors.name ? "error" : ""}
                                help={form.errors.name}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={
                                    OrderResourceConfigs.properties.color.label
                                }
                                name="color"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn màu",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.color ? "error" : ""
                                }
                                help={form.errors.color}
                            >
                                <ColorPicker showText />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={
                                    OrderResourceConfigs.properties
                                        .customerResourceId.label
                                }
                                name="customerResourceId"
                                validateStatus={
                                    form.errors.customerResourceId
                                        ? "error"
                                        : ""
                                }
                                help={form.errors.customerResourceId}
                            >
                                <Select
                                    placeholder="--"
                                    allowClear
                                    options={customerResourceSelectList}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={
                                    OrderResourceConfigs.properties.status.label
                                }
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn trạng thái",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.status ? "error" : ""
                                }
                                help={form.errors.status}
                            >
                                <Select
                                    placeholder="--"
                                    options={statusSelectList}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Space
                        style={{
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button onClick={form.reset}>Mặc định</Button>
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </Space>
                </Form>
            </Card>
        </Space>
    );
}

export default OrderResourceCreate;
