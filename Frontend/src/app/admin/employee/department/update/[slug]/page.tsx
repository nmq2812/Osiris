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
    Spin,
    Result,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import { useParams } from "next/navigation";
import DepartmentConfigs from "../../DepartmentConfigs";
import useDepartmentUpdateViewModel from "../../DepartmentUpdate.vm";

function DepartmentUpdate() {
    // Form instance của Ant Design
    const [form] = Form.useForm();

    const param = useParams();
    const id = typeof param.slug === "string" ? parseInt(param.slug) : 0;

    const {
        department,
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        isError,
        isSubmitDisabled,
    } = useDepartmentUpdateViewModel(Number(id));

    // Chuyển đổi dữ liệu cho Ant Design Select
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Cập nhật form khi department thay đổi
    useEffect(() => {
        if (department) {
            form.setFieldsValue({
                name: department.name,
                status: String(department.status),
            });
        }
    }, [form, department]);

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{ name: string; status: string }>,
    ) => {
        // Cập nhật vào Mantine form để sử dụng logic ViewModel
        mantineForm.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    // Hiển thị loading state
    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <div>Đang tải dữ liệu phòng ban...</div>
                </Space>
            </div>
        );
    }

    // Hiển thị lỗi
    if (isError || !department) {
        return (
            <Result
                status="error"
                title="Không thể tải thông tin phòng ban"
                subTitle="Có thể do ID không hợp lệ hoặc đã xảy ra lỗi khi truy vấn dữ liệu."
                extra={[
                    <Button key="back" onClick={() => window.history.back()}>
                        Quay lại
                    </Button>,
                    <Button
                        key="reload"
                        type="primary"
                        onClick={() => window.location.reload()}
                    >
                        Tải lại trang
                    </Button>,
                ]}
            />
        );
    }

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={DepartmentConfigs.managerPath}
                title={DepartmentConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={department.id}
                createdAt={department.createdAt}
                updatedAt={department.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: department.name,
                    status: String(department.status),
                }}
            >
                <Card>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="name"
                                label={DepartmentConfigs.properties.name.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên phòng ban",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="status"
                                label={
                                    DepartmentConfigs.properties.status.label
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
                        <Button
                            onClick={() => {
                                form.resetFields();
                                handleReset && handleReset();
                            }}
                        >
                            Mặc định
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={isSubmitDisabled}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </Card>
            </Form>
        </Space>
    );
}

export default DepartmentUpdate;
