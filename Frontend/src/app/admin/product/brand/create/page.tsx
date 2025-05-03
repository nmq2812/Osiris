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

import BrandConfigs from "@/app/admin/product/brand/BrandConfigs";
import useBrandCreateViewModel from "@/app/admin/product/brand/BrandCreate.vm";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";

const { TextArea } = Input;

function BrandCreate() {
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        statusSelectList,
    } = useBrandCreateViewModel();

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
        setTimeout(() => {
            handleFormSubmit();
        }, 0);
    };

    // Reset form
    const handleReset = () => {
        form.resetFields();
    };

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={BrandConfigs.managerPath}
                title={BrandConfigs.createTitle}
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
                                label={BrandConfigs.properties.name.label}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập tên thương hiệu",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="code"
                                label={BrandConfigs.properties.code.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã thương hiệu",
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
                                    BrandConfigs.properties.description.label
                                }
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="status"
                                label={BrandConfigs.properties.status.label}
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
                        <Button onClick={handleReset}>Mặc định</Button>
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

export default BrandCreate;
