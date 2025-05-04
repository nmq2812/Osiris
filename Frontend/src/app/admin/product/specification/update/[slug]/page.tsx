"use client";
import React, { useEffect, useRef } from "react";
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
    Spin,
    notification,
} from "antd";
import { useParams } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import SpecificationConfigs from "../../SpecificationConfigs";
import useSpecificationUpdateViewModel from "../../SpecificationUpdate.vm";

const { TextArea } = Input;

function SpecificationUpdate() {
    const { slug } = useParams();
    const id = Number(slug);
    const formInitialized = useRef(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const {
        specification,
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        updateStatus,
    } = useSpecificationUpdateViewModel(id);

    // Chuyển đổi dữ liệu select cho Ant Design
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Đồng bộ dữ liệu từ specification xuống form
    useEffect(() => {
        if (specification && !formInitialized.current) {
            form.setFieldsValue({
                name: specification.name,
                code: specification.code,
                description: specification.description || "",
                status: String(specification.status),
            });
            formInitialized.current = true;
        }
    }, [specification, form]);

    // Theo dõi trạng thái cập nhật
    useEffect(() => {
        if (updateStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Cập nhật thông số kỹ thuật thành công!",
            });
        } else if (updateStatus === "error") {
            api.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật thông số kỹ thuật.",
            });
        }
    }, [updateStatus, api]);

    // Xử lý submit form
    const onFinish = (values: {
        name: any;
        code: any;
        description: any;
        status: any;
    }) => {
        mantineForm.setValues({
            name: values.name,
            code: values.code,
            description: values.description,
            status: values.status,
        });
        handleFormSubmit();
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!specification) {
        return null;
    }

    return (
        <>
            {contextHolder}
            <Space
                direction="vertical"
                style={{ width: "100%", maxWidth: 800 }}
            >
                <CreateUpdateTitle
                    managerPath={SpecificationConfigs.managerPath}
                    title={SpecificationConfigs.updateTitle}
                />

                <DefaultPropertyPanel
                    id={specification.id}
                    createdAt={specification.createdAt}
                    updatedAt={specification.updatedAt}
                    createdBy={specification.createdBy?.username || "-"}
                    updatedBy={specification.updatedBy?.username || "-"}
                />

                <Card>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="name"
                                    label={
                                        SpecificationConfigs.properties.name
                                            .label
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
                                        SpecificationConfigs.properties.code
                                            .label
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
                                        SpecificationConfigs.properties
                                            .description.label
                                    }
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="status"
                                    label={
                                        SpecificationConfigs.properties.status
                                            .label
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
                                loading={updateStatus === "pending"}
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Space>
        </>
    );
}

export default SpecificationUpdate;
