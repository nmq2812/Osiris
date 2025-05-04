"use client";
import React, { useEffect } from "react";
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
} from "antd";
import { useParams } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import DestinationConfigs from "@/app/admin/inventory/destination/DestinationConfigs";
import useDestinationUpdateViewModel from "@/app/admin/inventory/destination/DestinationUpdate.vm";

function DestinationUpdate() {
    const { slug } = useParams();
    const id = Number(slug);
    const [form] = Form.useForm();

    const {
        destination,
        form: mantineForm,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isLoading,
        updateStatus,
    } = useDestinationUpdateViewModel(id);

    // Convert select options for Ant Design format
    const mapToAntOptions = (options: any[]) => {
        return options.map((option: { value: any; label: any }) => ({
            value: option.value,
            label: option.label,
        }));
    };

    // Initialize form when destination data is loaded
    useEffect(() => {
        if (destination) {
            form.setFieldsValue({
                contactFullname: destination.contactFullname || "",
                contactEmail: destination.contactEmail || "",
                contactPhone: destination.contactPhone || "",
                "address.line": destination.address?.line || "",
                "address.provinceId": destination.address?.province
                    ? String(destination.address.province.id)
                    : null,
                "address.districtId": destination.address?.district
                    ? String(destination.address.district.id)
                    : null,
                status: String(destination.status),
            });
        }
    }, [destination, form]);

    // Form submission handler
    const onFinish = (
        values: React.SetStateAction<{
            contactFullname: string;
            contactEmail: string;
            contactPhone: string;
            "address.line": string;
            "address.provinceId": string | null;
            "address.districtId": string | null;
            status: string;
        }>,
    ) => {
        mantineForm.setValues(values);
        handleFormSubmit();
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!destination) {
        return null;
    }

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={DestinationConfigs.managerPath}
                title={DestinationConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={destination.id}
                createdAt={destination.createdAt}
                updatedAt={destination.updatedAt}
                createdBy={destination.createdBy?.username || "1"}
                updatedBy={destination.updatedBy?.username || "1"}
            />

            <Card>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="contactFullname"
                                label={
                                    DestinationConfigs.properties
                                        .contactFullname.label
                                }
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="contactEmail"
                                label={
                                    DestinationConfigs.properties.contactEmail
                                        .label
                                }
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="contactPhone"
                                label={
                                    DestinationConfigs.properties.contactPhone
                                        .label
                                }
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="address.line"
                                label={
                                    DestinationConfigs.properties[
                                        "address.line"
                                    ].label
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
                                    DestinationConfigs.properties[
                                        "address.provinceId"
                                    ].label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn tỉnh/thành",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--"
                                    allowClear
                                    showSearch
                                    options={mapToAntOptions(
                                        provinceSelectList,
                                    )}
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
                                    DestinationConfigs.properties[
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
                                    allowClear
                                    showSearch
                                    options={mapToAntOptions(
                                        districtSelectList,
                                    )}
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
                                    DestinationConfigs.properties.status.label
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
                                    options={mapToAntOptions(statusSelectList)}
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
    );
}

export default DestinationUpdate;
