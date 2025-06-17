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

import CategoryConfigs from "@/app/admin/product/category/CategoryConfigs";
import useCategoryCreateViewModel from "@/app/admin/product/category/CategoryCreate.vm";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";

const { TextArea } = Input;

function CategoryCreate() {
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        categorySelectList,
        statusSelectList,
    } = useCategoryCreateViewModel();

    // Chuyển đổi dữ liệu select cho Ant Design
    const categoryOptions = categorySelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{
            name: string;
            slug: string;
            description: string;
            thumbnail: string;
            parentCategoryId: string | null;
            status: string;
        }>,
    ) => {
        mantineForm.setValues(values);
        setTimeout(() => {
            handleFormSubmit();
        }, 0);
    };

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={CategoryConfigs.managerPath}
                title={CategoryConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: "",
                        slug: "",
                        description: "",
                        thumbnail: "",
                        parentCategoryId: null,
                        status: "1",
                    }}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="name"
                                label={CategoryConfigs.properties.name.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên danh mục",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="slug"
                                label={CategoryConfigs.properties.slug.label}
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
                                    CategoryConfigs.properties.description.label
                                }
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="thumbnail"
                                label={
                                    CategoryConfigs.properties.thumbnail.label
                                }
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="parentCategoryId"
                                label={
                                    CategoryConfigs.properties.parentCategoryId
                                        .label
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
                                label={CategoryConfigs.properties.status.label}
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
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </div>
                </Form>
            </Card>
        </Space>
    );
}

export default CategoryCreate;
