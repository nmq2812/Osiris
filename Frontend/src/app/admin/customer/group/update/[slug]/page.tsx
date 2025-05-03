"use client";
import React, { useEffect } from "react";
import {
    Button,
    Card,
    Divider,
    Row,
    Col,
    Input,
    Form,
    Select,
    Space,
    Spin,
    notification,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import CustomerGroupConfigs from "../../CustomerGroupConfigs";
import useCustomerGroupUpdateViewModel from "../../CustomerGroupUpdate.vm";

function CustomerGroupUpdate() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();

    const params = useParams();
    const id = typeof params.slug === "string" ? parseInt(params.slug) : 0;

    const {
        customerGroup,
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isSubmitDisabled,
        updateStatus,
    } = useCustomerGroupUpdateViewModel(Number(id));

    // Chuyển đổi dữ liệu cho Ant Design Select
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{
            code: string;
            name: string;
            description: string;
            color: string;
            status: string;
        }>,
    ) => {
        // Đặt giá trị rồi đợi render xong mới xử lý submit
        mantineForm.setValues(values);
        // Sử dụng setTimeout để đảm bảo state đã được cập nhật
        setTimeout(() => {
            handleFormSubmit(new Event("submit") as any);
        }, 0);
    };

    // Theo dõi status để hiển thị thông báo
    useEffect(() => {
        if (updateStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Cập nhật nhóm khách hàng thành công!",
                onClose: () => router.push(CustomerGroupConfigs.managerPath),
            });
        } else if (updateStatus === "error") {
            api.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật nhóm khách hàng.",
            });
        }
    }, [updateStatus, api, router]);

    // Đồng bộ giữa mantineForm và form của Ant Design
    useEffect(() => {
        if (mantineForm.values && Object.keys(mantineForm.values).length > 0) {
            // So sánh giá trị hiện tại trước khi cập nhật
            const currentValues = form.getFieldsValue();
            const hasChanges =
                JSON.stringify(currentValues) !==
                JSON.stringify(mantineForm.values);

            if (hasChanges) {
                form.setFieldsValue(mantineForm.values);
            }
        }
    }, [mantineForm.values, form]);

    // Hiển thị loading khi không có dữ liệu
    if (!customerGroup) {
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
                    managerPath={CustomerGroupConfigs.managerPath}
                    title={CustomerGroupConfigs.updateTitle}
                />

                <DefaultPropertyPanel
                    id={customerGroup.id}
                    createdAt={customerGroup.createdAt}
                    updatedAt={customerGroup.updatedAt}
                    createdBy="1"
                    updatedBy="1"
                />

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Card>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="code"
                                    label={
                                        CustomerGroupConfigs.properties.code
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mã nhóm",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="name"
                                    label={
                                        CustomerGroupConfigs.properties.name
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập tên nhóm",
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
                                        CustomerGroupConfigs.properties
                                            .description.label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mô tả",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="color"
                                    label={
                                        CustomerGroupConfigs.properties.color
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn màu sắc",
                                        },
                                    ]}
                                >
                                    <Input
                                        type="color"
                                        style={{ width: "100%", height: 32 }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="status"
                                    label={
                                        CustomerGroupConfigs.properties.status
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn trạng thái",
                                        },
                                    ]}
                                >
                                    <Select options={statusOptions} />
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
                            <Button onClick={() => handleReset()}>
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
        </>
    );
}

export default CustomerGroupUpdate;
