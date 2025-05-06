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
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import OrderCancellationReasonConfigs from "../OrderCancellationReasonConfigs";
import useOrderCancellationReasonCreateViewModel from "../OrderCancellationReasonCreate.vm";

const { TextArea } = Input;

function OrderCancellationReasonCreate() {
    const { form, handleFormSubmit, statusSelectList } =
        useOrderCancellationReasonCreateViewModel();

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        name: form.values.name,
        note: form.values.note,
        status: form.values.status,
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", maxWidth: 800 }}
        >
            <CreateUpdateTitle
                managerPath={OrderCancellationReasonConfigs.managerPath}
                title={OrderCancellationReasonConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={handleFormSubmit}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={
                                    OrderCancellationReasonConfigs.properties
                                        .name.label
                                }
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập tên lý do hủy đơn hàng",
                                    },
                                ]}
                                validateStatus={form.errors.name ? "error" : ""}
                                help={form.errors.name}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label={
                                    OrderCancellationReasonConfigs.properties
                                        .note.label
                                }
                                name="note"
                                validateStatus={form.errors.note ? "error" : ""}
                                help={form.errors.note}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={
                                    OrderCancellationReasonConfigs.properties
                                        .status.label
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

export default OrderCancellationReasonCreate;
