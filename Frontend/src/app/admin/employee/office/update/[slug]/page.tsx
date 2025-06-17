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
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import { useParams } from "next/navigation";
import OfficeConfigs from "../../OfficeConfigs";
import useOfficeUpdateViewModel from "../../OfficeUpdate.vm";

function OfficeUpdate() {
    // Form instance của Ant Design
    const [form] = Form.useForm();

    const param = useParams();
    const id = typeof param.slug === "string" ? parseInt(param.slug) : 0;

    const {
        office,
        form: mantineForm,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isLoading,
        isError,
    } = useOfficeUpdateViewModel(Number(id));

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

    // Cập nhật form khi office thay đổi
    useEffect(() => {
        if (office) {
            form.setFieldsValue({
                name: office.name,
                "address.line": office.address?.line || "",
                "address.provinceId": office.address?.province
                    ? String(office.address.province.id)
                    : undefined,
                "address.districtId": office.address?.district
                    ? String(office.address.district.id)
                    : undefined,
                status: String(office.status),
            });
        }
    }, [form, office]);

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

    // Xử lý reset form
    const handleReset = () => {
        if (office) {
            form.setFieldsValue({
                name: office.name,
                "address.line": office.address?.line || "",
                "address.provinceId": office.address?.province
                    ? String(office.address.province.id)
                    : undefined,
                "address.districtId": office.address?.district
                    ? String(office.address.district.id)
                    : undefined,
                status: String(office.status),
            });
        } else {
            form.resetFields();
        }
    };

    // Xử lý khi thay đổi province
    const handleProvinceChange = (value: any) => {
        form.setFieldValue("address.provinceId", value);
        form.setFieldValue("address.districtId", undefined);
    };

    // Hiển thị loading state
    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <div>Đang tải dữ liệu văn phòng...</div>
                </Space>
            </div>
        );
    }

    // Hiển thị lỗi
    if (isError || !office) {
        return (
            <Result
                status="error"
                title="Không thể tải thông tin văn phòng"
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
                managerPath={OfficeConfigs.managerPath}
                title={OfficeConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={office.id}
                createdAt={office.createdAt}
                updatedAt={office.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: office.name,
                    "address.line": office.address?.line || "",
                    "address.provinceId": office.address?.province
                        ? String(office.address.province.id)
                        : undefined,
                    "address.districtId": office.address?.district
                        ? String(office.address.district.id)
                        : undefined,
                    status: String(office.status),
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
                                <Input />
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
                                <Input />
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
                                    placeholder="--"
                                    showSearch
                                    options={provinceOptions}
                                    onChange={handleProvinceChange}
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
                                    placeholder="--"
                                    showSearch
                                    options={districtOptions}
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

export default OfficeUpdate;
