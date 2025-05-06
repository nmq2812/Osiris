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
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import { useParams } from "next/navigation";
import DocketReasonConfigs from "../../DocketReasonConfigs";
import useDocketReasonUpdateViewModel from "../../DocketReasonUpdate.vm";

function DocketReasonUpdate() {
    // Cập nhật cách lấy param theo cấu trúc Next.js App Router
    const params = useParams();
    const slug = params?.slug;

    const {
        docketReason,
        form: mantineForm, // Đổi tên để tránh xung đột
        handleFormSubmit,
        statusSelectList,
    } = useDocketReasonUpdateViewModel(Number(slug));

    if (!docketReason) {
        return <Spin size="large" />;
    }

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        name: mantineForm.values.name,
        status: mantineForm.values.status,
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", maxWidth: 800 }}
        >
            <CreateUpdateTitle
                managerPath={DocketReasonConfigs.managerPath}
                title={DocketReasonConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={docketReason.id}
                createdAt={docketReason.createdAt}
                updatedAt={docketReason.updatedAt}
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
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={
                                    DocketReasonConfigs.properties.name.label
                                }
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên lý do",
                                    },
                                ]}
                                validateStatus={
                                    mantineForm.errors.name ? "error" : ""
                                }
                                help={mantineForm.errors.name}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={
                                    DocketReasonConfigs.properties.status.label
                                }
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn trạng thái",
                                    },
                                ]}
                                validateStatus={
                                    mantineForm.errors.status ? "error" : ""
                                }
                                help={mantineForm.errors.status}
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
                        <Button
                            onClick={() => mantineForm.reset()} // Sử dụng reset từ mantineForm
                        >
                            Mặc định
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Space>
                </Form>
            </Card>
        </Space>
    );
}

export default DocketReasonUpdate;
