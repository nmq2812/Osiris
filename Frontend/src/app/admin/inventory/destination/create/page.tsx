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
import DestinationConfigs from "@/app/admin/inventory/destination/DestinationConfigs";
import useDestinationCreateViewModel from "@/app/admin/inventory/destination/DestinationCreate.vm";

function DestinationCreate() {
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isSubmitting,
    } = useDestinationCreateViewModel();

    // Convert select options for Ant Design
    const mapToAntOptions = (options: any[]) => {
        return options.map((option: { value: any; label: any }) => ({
            value: option.value,
            label: option.label,
        }));
    };

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

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={DestinationConfigs.managerPath}
                title={DestinationConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        contactFullname: "",
                        contactEmail: "",
                        contactPhone: "",
                        "address.line": "",
                        status: "1",
                    }}
                >
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

export default DestinationCreate;
