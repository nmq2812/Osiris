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
import JobLevelConfigs from "../../JobLevelConfigs";
import useJobLevelUpdateViewModel from "../../JobLevelUpdate.vm";

function JobLevelUpdate() {
    // Form instance của Ant Design
    const [form] = Form.useForm();

    const param = useParams();
    const id = typeof param.slug === "string" ? parseInt(param.slug) : 0;

    const {
        jobLevel,
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        isError,
        isSubmitDisabled,
    } = useJobLevelUpdateViewModel(Number(id));

    // Chuyển đổi dữ liệu cho Ant Design Select
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Cập nhật form khi jobLevel thay đổi
    useEffect(() => {
        if (jobLevel) {
            form.setFieldsValue({
                name: jobLevel.name,
                status: String(jobLevel.status),
            });
        }
    }, [form, jobLevel]);

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
                    <div>Đang tải dữ liệu cấp độ công việc...</div>
                </Space>
            </div>
        );
    }

    // Hiển thị lỗi
    if (isError || !jobLevel) {
        return (
            <Result
                status="error"
                title="Không thể tải thông tin cấp độ công việc"
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
                managerPath={JobLevelConfigs.managerPath}
                title={JobLevelConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={jobLevel.id}
                createdAt={jobLevel.createdAt}
                updatedAt={jobLevel.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: jobLevel.name,
                    status: String(jobLevel.status),
                }}
            >
                <Card>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="name"
                                label={JobLevelConfigs.properties.name.label}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập tên cấp độ công việc",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="status"
                                label={JobLevelConfigs.properties.status.label}
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

export default JobLevelUpdate;
