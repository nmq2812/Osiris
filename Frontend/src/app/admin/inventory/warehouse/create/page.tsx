"use client";
import React from "react";
import {
    Button,
    Divider,
    Row,
    Col,
    Card,
    Select,
    Space,
    Form,
    Input,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import WarehouseConfigs from "@/app/admin/inventory/warehouse/WarehouseConfigs";
import useWarehouseCreateViewModel from "@/app/admin/inventory/warehouse/WarehouseCreate.vm";

function WarehouseCreate() {
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isSubmitting,
    } = useWarehouseCreateViewModel();

    // Convert select options for Ant Design format
    const mapToAntOptions = (options: any[]) => {
        return options.map((option: { value: any; label: any }) => ({
            value: option.value,
            label: option.label,
        }));
    };

    // Form submission handler
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

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={WarehouseConfigs.managerPath}
                title={WarehouseConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        code: "",
                        name: "",
                        "address.line": "",
                        status: "1",
                    }}
                >
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
                            loading={isSubmitting}
                        >
                            Thêm
                        </Button>
                    </div>
                </Form>
            </Card>
        </Space>
    );
}

export default WarehouseCreate;
