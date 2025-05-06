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
    Spin,
} from "antd";
import { useParams } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import OrderCancellationReasonConfigs from "../../OrderCancellationReasonConfigs";
import useOrderCancellationReasonUpdateViewModel from "../../OrderCancellationReasonUpdate.vm";

const { TextArea } = Input;

function OrderCancellationReasonUpdate() {
    // Cập nhật cách lấy param theo cấu trúc Next.js
    const params = useParams();
    const slug = params?.slug;

    const {
        orderCancellationReason,
        form,
        handleFormSubmit,
        statusSelectList,
    } = useOrderCancellationReasonUpdateViewModel(Number(slug));

    if (!orderCancellationReason) {
        return <Spin size="large" tip="Đang tải..." />;
    }

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
                title={OrderCancellationReasonConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={orderCancellationReason.id}
                createdAt={orderCancellationReason.createdAt}
                updatedAt={orderCancellationReason.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

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
                            Cập nhật
                        </Button>
                    </Space>
                </Form>
            </Card>
        </Space>
    );
}

export default OrderCancellationReasonUpdate;
