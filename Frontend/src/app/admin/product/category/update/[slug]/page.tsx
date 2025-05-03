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
import CategoryConfigs from "../../CategoryConfigs";
import useCategoryUpdateViewModel from "../../CategoryUpdate.vm";

const { TextArea } = Input;

function CategoryUpdate() {
    const { slug } = useParams();
    const id = Number(slug);
    const formInitialized = useRef(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const {
        category,
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        categorySelectList,
        statusSelectList,
        isLoading,
        updateStatus,
    } = useCategoryUpdateViewModel(id);

    // Chuyển đổi dữ liệu select cho Ant Design
    const categoryOptions = [
        { value: null, label: "-- Không chọn --" },
        ...categorySelectList.map((item) => ({
            value: item.value,
            label: item.label,
            disabled: item.disabled,
        })),
    ];

    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Đồng bộ dữ liệu từ category xuống form chỉ một lần khi có data
    useEffect(() => {
        if (category && !formInitialized.current) {
            form.setFieldsValue({
                name: category.name,
                slug: category.slug,
                description: category.description || "",
                thumbnail: category.thumbnail || "",
                parentCategoryId: category.parentCategory
                    ? String(category.parentCategory.id)
                    : null,
                status: String(category.status),
            });
            formInitialized.current = true;
        }
    }, [category, form]);

    // Theo dõi trạng thái cập nhật
    useEffect(() => {
        if (updateStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Cập nhật danh mục thành công!",
            });
        } else if (updateStatus === "error") {
            api.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật danh mục.",
            });
        }
    }, [updateStatus, api]);

    // Xử lý submit form
    const onFinish = (values: {
        name: any;
        slug: any;
        description: any;
        thumbnail: any;
        parentCategoryId: any;
        status: any;
    }) => {
        mantineForm.setValues({
            name: values.name,
            slug: values.slug,
            description: values.description,
            thumbnail: values.thumbnail,
            parentCategoryId: values.parentCategoryId,
            status: values.status,
        });
        // Create a properly typed mock event
        const mockEvent = {
            preventDefault: () => {},
        } as React.FormEvent<HTMLFormElement>;
        handleFormSubmit(mockEvent);
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!category) {
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
                    managerPath={CategoryConfigs.managerPath}
                    title={CategoryConfigs.updateTitle}
                />

                <DefaultPropertyPanel
                    id={category.id}
                    createdAt={category.createdAt}
                    updatedAt={category.updatedAt}
                    createdBy={category.createdBy?.username || "-"}
                    updatedBy={category.updatedBy?.username || "-"}
                />

                <Card>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="name"
                                    label={
                                        CategoryConfigs.properties.name.label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập tên danh mục",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="slug"
                                    label={
                                        CategoryConfigs.properties.slug.label
                                    }
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
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label={
                                        CategoryConfigs.properties.description
                                            .label
                                    }
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="thumbnail"
                                    label={
                                        CategoryConfigs.properties.thumbnail
                                            .label
                                    }
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="parentCategoryId"
                                    label={
                                        CategoryConfigs.properties
                                            .parentCategoryId.label
                                    }
                                >
                                    <Select
                                        placeholder="--"
                                        options={categoryOptions}
                                        allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="status"
                                    label={
                                        CategoryConfigs.properties.status.label
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

export default CategoryUpdate;
