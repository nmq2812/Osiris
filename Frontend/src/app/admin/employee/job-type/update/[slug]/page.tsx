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
import { useParams } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import JobTypeConfigs from "../../JobTypeConfigs";
import useJobTypeUpdateViewModel from "../../JobTypeUpdate.vm";

function JobTypeUpdate() {
    // Form instance của Ant Design
    const [form] = Form.useForm();

    const param = useParams();
    const id = typeof param.slug === "string" ? parseInt(param.slug) : 0;

    const {
        jobType,
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        isError,
    } = useJobTypeUpdateViewModel(Number(id));

    // Chuyển đổi dữ liệu cho Ant Design Select
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Cập nhật form khi jobType thay đổi
    useEffect(() => {
        if (jobType) {
            form.setFieldsValue({
                name: jobType.name,
                status: String(jobType.status),
            });
        }
    }, [form, jobType]);

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{ name: string; status: string }>,
    ) => {
        mantineForm.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    // Hiển thị loading state
    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <div>Đang tải dữ liệu loại công việc...</div>
                </Space>
            </div>
        );
    }

    // Hiển thị lỗi
    if (isError || !jobType) {
        return (
            <Result
                status="error"
                title="Không thể tải thông tin loại công việc"
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
                managerPath={JobTypeConfigs.managerPath}
                title={JobTypeConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={jobType.id}
                createdAt={jobType.createdAt}
                updatedAt={jobType.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: jobType.name,
                    status: String(jobType.status),
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
                                <Input />
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
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </div>
                </Card>
            </Form>
        </Space>
    );
}

export default JobTypeUpdate;
