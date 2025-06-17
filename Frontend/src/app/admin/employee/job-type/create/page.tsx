"use client";
import React from "react";
import {
    Button,
    Divider,
    Row,
    Col,
    Card,
    Input,
    Form,
    Select,
    Space,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import JobTypeConfigs from "../JobTypeConfigs";
import useJobTypeCreateViewModel from "../JobTypeCreate.vm";

function JobTypeCreate() {
    // Form instance của Ant Design
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        isError,
    } = useJobTypeCreateViewModel();

    // Chuyển đổi dữ liệu cho Ant Design Select
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{ name: string; status: string }>,
    ) => {
        mantineForm.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={JobTypeConfigs.managerPath}
                title={JobTypeConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: "",
                    status: "1", // Mặc định là "Có hiệu lực"
                }}
            >
                <Card>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="name"
                                label={JobTypeConfigs.properties.name.label}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập tên loại công việc",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên loại công việc" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="status"
                                label={JobTypeConfigs.properties.status.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn trạng thái",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--Chọn trạng thái--"
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
                        <Button
                            onClick={() => {
                                form.resetFields();
                                handleReset && handleReset();
                            }}
                        >
                            Mặc định
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </div>
                </Card>
            </Form>
        </Space>
    );
}

export default JobTypeCreate;
