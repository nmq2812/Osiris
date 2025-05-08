"use client";
import React, { useEffect } from "react";
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
import RoleConfigs from "../RoleConfigs";
import useRoleCreateViewModel from "../RoleCreate.vm";

function RoleCreate() {
    // Form instance của Ant Design
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        statusSelectList,
    } = useRoleCreateViewModel();

    // Chuyển đổi dữ liệu statusSelectList cho Ant Design Select
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{
            code: string;
            name: string;
            status: string;
        }>,
    ) => {
        // Cập nhật vào Mantine form và gọi handleFormSubmit
        mantineForm.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    // Reset form về giá trị mặc định
    const handleReset = () => {
        form.resetFields();
    };

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={RoleConfigs.managerPath}
                title={RoleConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    code: "",
                    name: "",
                    status: "1", // Mặc định là "Có hiệu lực"
                }}
            >
                <Card>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="code"
                                label={RoleConfigs.properties.code.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã vai trò",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập mã vai trò" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="name"
                                label={RoleConfigs.properties.name.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên vai trò",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên vai trò" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="status"
                                label={RoleConfigs.properties.status.label}
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
                        <Button onClick={handleReset}>Mặc định</Button>
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </div>
                </Card>
            </Form>
        </Space>
    );
}

export default RoleCreate;
