"use client";
import React from "react";
import {
    Button,
    Divider,
    Form,
    Input,
    Space,
    Card,
    Row,
    Col,
    Typography,
    Spin,
    Result,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import { useParams } from "next/navigation";
import ProvinceConfigs from "../../ProvinceConfigs";
import useProvinceUpdateViewModel from "../../ProvinceUpdate.vm";

const { Title } = Typography;

function ProvinceUpdate() {
    // Lấy slug từ dynamic route của Next.js
    const params = useParams();
    const id = typeof params.slug === "string" ? parseInt(params.slug) : 0;

    // Cập nhật để nhận thêm isLoading và isError
    const { province, form, handleFormSubmit, isLoading, isError } =
        useProvinceUpdateViewModel(id);

    // Tạo Form instance để sử dụng với Ant Design
    const [antForm] = Form.useForm();

    // Kiểm tra trạng thái loading
    if (isLoading) {
        return (
            <div style={{ padding: 24, textAlign: "center" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
            </div>
        );
    }

    // Kiểm tra lỗi
    if (isError || !province) {
        return (
            <Result
                status="error"
                title="Không thể tải dữ liệu"
                subTitle="Đã xảy ra lỗi khi tải thông tin tỉnh/thành phố. Vui lòng thử lại sau."
                extra={[
                    <Button
                        type="primary"
                        key="reload"
                        onClick={() => window.location.reload()}
                    >
                        Tải lại trang
                    </Button>,
                    <Button key="back" onClick={() => window.history.back()}>
                        Quay lại
                    </Button>,
                ]}
            />
        );
    }

    // Logic khi có dữ liệu
    const initialValues = {
        name: form.values.name,
        code: form.values.code,
    };

    // Hàm submit cho Ant Design Form
    const onFinish = (values: any) => {
        form.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    // Hàm reset form
    const handleReset = () => {
        antForm.resetFields();
        form.reset();
    };

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={ProvinceConfigs.managerPath}
                title={ProvinceConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={province?.id}
                createdAt={province?.createdAt}
                updatedAt={province?.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Form
                form={antForm}
                layout="vertical"
                initialValues={initialValues}
                onFinish={onFinish}
            >
                <Card>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={ProvinceConfigs.properties.name.label}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên tỉnh/thành",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={ProvinceConfigs.properties.code.label}
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã tỉnh/thành",
                                    },
                                ]}
                            >
                                <Input />
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
                        <Button onClick={handleReset}>Mặc định</Button>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </div>
                </Card>
            </Form>
        </Space>
    );
}

export default ProvinceUpdate;
