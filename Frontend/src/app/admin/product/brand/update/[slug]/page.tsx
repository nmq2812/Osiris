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
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import { useParams } from "next/navigation";
import BrandConfigs from "../../BrandConfigs";
import useBrandUpdateViewModel from "../../BrandUpdate.vm";

const { TextArea } = Input;

function BrandUpdate() {
    const { slug } = useParams();
    const id = Number(slug);
    const formInitialized = useRef(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const {
        brand,
        form: mantineForm,
        handleFormSubmit,
        statusSelectList,
        isLoading,
        updateStatus,
    } = useBrandUpdateViewModel(id);

    // Chuyển đổi dữ liệu select cho Ant Design
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Đồng bộ dữ liệu từ brand xuống form chỉ một lần khi có data
    useEffect(() => {
        if (brand && !formInitialized.current) {
            form.setFieldsValue({
                name: brand.name,
                code: brand.code,
                description: brand.description || "",
                status: String(brand.status),
            });
            formInitialized.current = true;
        }
    }, [brand, form]);

    // Theo dõi trạng thái cập nhật
    useEffect(() => {
        if (updateStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Cập nhật thương hiệu thành công!",
            });
        } else if (updateStatus === "error") {
            api.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật thương hiệu.",
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

    return (
        <>
            {contextHolder}
            <Space
                direction="vertical"
                style={{ width: "100%", maxWidth: 800 }}
            >
                <CreateUpdateTitle
                    managerPath={BrandConfigs.managerPath}
                    title={BrandConfigs.updateTitle}
                />

                {brand && (
                    <DefaultPropertyPanel
                        id={brand.id}
                        createdAt={brand.createdAt}
                        updatedAt={brand.updatedAt}
                        createdBy={brand.createdBy?.username || "-"}
                        updatedBy={brand.updatedBy?.username || "-"}
                    />
                )}

                <Card>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
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
                                            message:
                                                "Vui lòng nhập mã thương hiệu",
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
                                        BrandConfigs.properties.description
                                            .label
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

export default BrandUpdate;
