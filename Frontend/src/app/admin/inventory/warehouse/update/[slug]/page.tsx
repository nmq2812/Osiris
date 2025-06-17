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
import WarehouseConfigs from "@/app/admin/inventory/warehouse/WarehouseConfigs";
import useWarehouseUpdateViewModel from "@/app/admin/inventory/warehouse/WarehouseUpdate.vm";

function WarehouseUpdate() {
    const { slug } = useParams();
    const id = Number(slug);
    const [form] = Form.useForm();

    const {
        warehouse,
        form: mantineForm,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isLoading,
        updateStatus,
    } = useWarehouseUpdateViewModel(id);

    // Convert select options for Ant Design
    const mapToAntOptions = (options: any[]) => {
        return options.map((option: { value: any; label: any }) => ({
            value: option.value,
            label: option.label,
        }));
    };

    // Initialize form when warehouse data is loaded
    useEffect(() => {
        if (warehouse) {
            form.setFieldsValue({
                code: warehouse.code,
                name: warehouse.name,
                "address.line": warehouse.address?.line || "",
                "address.provinceId": warehouse.address?.province
                    ? String(warehouse.address.province.id)
                    : null,
                "address.districtId": warehouse.address?.district
                    ? String(warehouse.address.district.id)
                    : null,
                status: String(warehouse.status),
            });
        }
    }, [warehouse, form]);

    // Form submit handler
    const onFinish = (
        values: React.SetStateAction<{
            code: string;
            name: string;
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

    if (!warehouse) {
        return null;
    }

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={WarehouseConfigs.managerPath}
                title={WarehouseConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={warehouse.id}
                createdAt={warehouse.createdAt}
                updatedAt={warehouse.updatedAt}
                createdBy={warehouse.createdBy?.username || "1"}
                updatedBy={warehouse.updatedBy?.username || "1"}
            />

            <Card>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="code"
                                label={WarehouseConfigs.properties.code.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã kho",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="name"
                                label={WarehouseConfigs.properties.name.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên kho",
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
                                    WarehouseConfigs.properties["address.line"]
                                        .label
                                }
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="address.provinceId"
                                label={
                                    WarehouseConfigs.properties[
                                        "address.provinceId"
                                    ].label
                                }
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
                                    WarehouseConfigs.properties[
                                        "address.districtId"
                                    ].label
                                }
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
                                label={WarehouseConfigs.properties.status.label}
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

export default WarehouseUpdate;
