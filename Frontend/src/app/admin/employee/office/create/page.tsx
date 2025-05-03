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
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import OfficeConfigs from "../OfficeConfigs";
import useOfficeCreateViewModel from "../OfficeCreate.vm";

function OfficeCreate() {
    // Form instance của Ant Design
    const [form] = Form.useForm();

    const {
        form: mantineForm, // Giữ lại form của mantine để sử dụng logic
        handleFormSubmit,
        handleReset,
        handleProvinceChange,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isLoading,
        isError,
    } = useOfficeCreateViewModel();

    // Chuyển đổi dữ liệu cho Ant Design Select
    const provinceOptions = provinceSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    const districtOptions = districtSelectList.map((item) => ({
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
            "address.line": string;
            "address.provinceId": string | null;
            "address.districtId": string | null;
            status: string;
        }>,
    ) => {
        mantineForm.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    // Hiển thị loading nếu đang tải dữ liệu
    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <div>Đang tải dữ liệu...</div>
                </Space>
            </div>
        );
    }

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={OfficeConfigs.managerPath}
                title={OfficeConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: "",
                    "address.line": "",
                    "address.provinceId": undefined,
                    "address.districtId": undefined,
                    status: "1", // Mặc định là "Đang hoạt động"
                }}
            >
                <Card>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="name"
                                label={OfficeConfigs.properties.name.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên văn phòng",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên văn phòng" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="address.line"
                                label={
                                    OfficeConfigs.properties["address.line"]
                                        .label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập địa chỉ",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập địa chỉ chi tiết" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="address.provinceId"
                                label={
                                    OfficeConfigs.properties[
                                        "address.provinceId"
                                    ].label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn tỉnh/thành phố",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--Chọn tỉnh/thành phố--"
                                    options={provinceOptions}
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    onChange={(value) =>
                                        handleProvinceChange(value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="address.districtId"
                                label={
                                    OfficeConfigs.properties[
                                        "address.districtId"
                                    ].label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn quận/huyện",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--Chọn quận/huyện--"
                                    options={districtOptions}
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    disabled={
                                        !form.getFieldValue(
                                            "address.provinceId",
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="status"
                                label={OfficeConfigs.properties.status.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn trạng thái",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--Chọn trạng thái--"
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
                                handleReset();
                            }}
                        >
                            Mặc định
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </div>
                </Card>
            </Form>
        </Space>
    );
}

export default OfficeCreate;
