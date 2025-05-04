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
import GuaranteeConfigs from "../../GuaranteeConfigs";
import useGuaranteeUpdateViewModel from "../../GuaranteeUpdate.vm";

const { TextArea } = Input;

function GuaranteeUpdate() {
    const { slug } = useParams();
    const id = Number(slug);
    const formInitialized = useRef(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const {
        guarantee,
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        updateStatus,
    } = useGuaranteeUpdateViewModel(id);

    // Chuyển đổi dữ liệu select cho Ant Design
    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Đồng bộ dữ liệu từ guarantee xuống form
    useEffect(() => {
        if (guarantee && !formInitialized.current) {
            form.setFieldsValue({
                name: guarantee.name,
                description: guarantee.description || "",
                status: String(guarantee.status),
            });
            formInitialized.current = true;
        }
    }, [guarantee, form]);

    // Theo dõi trạng thái cập nhật
    useEffect(() => {
        if (updateStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Cập nhật bảo hành thành công!",
            });
        } else if (updateStatus === "error") {
            api.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật bảo hành.",
            });
        }
    }, [updateStatus, api]);

    // Xử lý submit form
    const onFinish = (values: { name: any; description: any; status: any }) => {
        mantineForm.setValues({
            name: values.name,
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

    if (!guarantee) {
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
                    managerPath={GuaranteeConfigs.managerPath}
                    title={GuaranteeConfigs.updateTitle}
                />

                <DefaultPropertyPanel
                    id={guarantee.id}
                    createdAt={guarantee.createdAt}
                    updatedAt={guarantee.updatedAt}
                    createdBy={guarantee.createdBy?.username || "-"}
                    updatedBy={guarantee.updatedBy?.username || "-"}
                />

                <Card>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="name"
                                    label={
                                        GuaranteeConfigs.properties.name.label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập tên bảo hành",
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
                                        GuaranteeConfigs.properties.description
                                            .label
                                    }
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="status"
                                    label={
                                        GuaranteeConfigs.properties.status.label
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

export default GuaranteeUpdate;
