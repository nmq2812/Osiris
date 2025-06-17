"use client";
import React from "react";
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
} from "antd";

import SpecificationConfigs from "@/app/admin/product/specification/SpecificationConfigs";
import useSpecificationCreateViewModel from "@/app/admin/product/specification/SpecificationCreate.vm";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";

const { TextArea } = Input;

function SpecificationCreate() {
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        statusSelectList,
    } = useSpecificationCreateViewModel();

    // Chuyển đổi dữ liệu select cho Ant Design
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{
            name: string;
            code: string;
            description: string;
            status: string;
        }>,
    ) => {
        mantineForm.setValues(values);
        handleFormSubmit();
    };

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={SpecificationConfigs.managerPath}
                title={SpecificationConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: "",
                        code: "",
                        description: "",
                        status: "1",
                    }}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="name"
                                label={
                                    SpecificationConfigs.properties.name.label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập tên thông số kỹ thuật",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="code"
                                label={
                                    SpecificationConfigs.properties.code.label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập mã thông số kỹ thuật",
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
                                    SpecificationConfigs.properties.description
                                        .label
                                }
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="status"
                                label={
                                    SpecificationConfigs.properties.status.label
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
                        <Button
                            type="primary"
                            htmlType="submit"
                            // loading={isSubmitting}
                        >
                            Thêm
                        </Button>
                    </div>
                </Form>
            </Card>
        </Space>
    );
}

export default SpecificationCreate;
