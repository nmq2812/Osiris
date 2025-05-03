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
import TagConfigs from "../../TagConfigs";
import useTagUpdateViewModel from "../../TagUpdate.vm";

function TagUpdate() {
    const { slug } = useParams();
    const id = Number(slug);
    const formInitialized = useRef(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const {
        tag,
        form: mantineForm,
        handleFormSubmit,
        statusSelectList,
        isLoading,
        updateStatus,
    } = useTagUpdateViewModel(id);

    // Chuyển đổi dữ liệu select cho Ant Design
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Đồng bộ dữ liệu từ tag xuống form
    useEffect(() => {
        if (tag && !formInitialized.current) {
            form.setFieldsValue({
                name: tag.name,
                slug: tag.slug,
                status: String(tag.status),
            });
            formInitialized.current = true;
        }
    }, [tag, form]);

    // Theo dõi trạng thái cập nhật
    useEffect(() => {
        if (updateStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Cập nhật thẻ thành công!",
            });
        } else if (updateStatus === "error") {
            api.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật thẻ.",
            });
        }
    }, [updateStatus, api]);

    // Xử lý submit form
    const onFinish = (values: { name: any; slug: any; status: any }) => {
        mantineForm.setValues({
            name: values.name,
            slug: values.slug,
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

    if (!tag) {
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
                    managerPath={TagConfigs.managerPath}
                    title={TagConfigs.updateTitle}
                />

                <DefaultPropertyPanel
                    id={tag.id}
                    createdAt={tag.createdAt}
                    updatedAt={tag.updatedAt}
                    createdBy={tag.createdBy?.username || "-"}
                    updatedBy={tag.updatedBy?.username || "-"}
                />

                <Card>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="name"
                                    label={TagConfigs.properties.name.label}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập tên thẻ",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="slug"
                                    label={TagConfigs.properties.slug.label}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập slug",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="status"
                                    label={TagConfigs.properties.status.label}
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

export default TagUpdate;
