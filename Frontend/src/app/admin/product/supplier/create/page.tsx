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
    Typography,
} from "antd";

import SupplierConfigs from "@/app/admin/product/supplier/SupplierConfigs";
import useSupplierCreateViewModel from "@/app/admin/product/supplier/SupplierCreate.vm";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";

const { Title, Text } = Typography;
const { TextArea } = Input;

function SupplierCreate() {
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
    } = useSupplierCreateViewModel();

    // Chuyển đổi dữ liệu select cho Ant Design
    const mapToAntOptions = (selectList: any[]) => {
        return selectList.map((item: { value: any; label: any }) => ({
            value: item.value,
            label: item.label,
        }));
    };

    const provinceOptions = mapToAntOptions(provinceSelectList);
    const districtOptions = mapToAntOptions(districtSelectList);
    const statusOptions = mapToAntOptions(statusSelectList);

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{
            displayName: string;
            code: string;
            contactFullname: string;
            contactEmail: string;
            contactPhone: string;
            companyName: string;
            taxCode: string;
            email: string;
            phone: string;
            fax: string;
            website: string;
            "address.line": string;
            "address.provinceId": string | null;
            "address.districtId": string | null;
            description: string;
            note: string;
            status: string;
        }>,
    ) => {
        mantineForm.setValues(values);
        handleFormSubmit();
    };

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={SupplierConfigs.managerPath}
                title={SupplierConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        displayName: "",
                        code: "",
                        contactFullname: "",
                        contactEmail: "",
                        contactPhone: "",
                        companyName: "",
                        taxCode: "",
                        email: "",
                        phone: "",
                        fax: "",
                        website: "",
                        "address.line": "",
                        "address.provinceId": null,
                        "address.districtId": null,
                        description: "",
                        note: "",
                        status: "1",
                    }}
                >
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                    >
                        {/* Thông tin cơ bản */}
                        <div>
                            <Title level={4}>Thông tin cơ bản</Title>
                            <Text type="secondary">Một số thông tin chung</Text>

                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="displayName"
                                        label={
                                            SupplierConfigs.properties
                                                .displayName.label
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập tên hiển thị",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="code"
                                        label={
                                            SupplierConfigs.properties.code
                                                .label
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập mã nhà cung cấp",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        {/* Người liên hệ */}
                        <div>
                            <Title level={4}>Người liên hệ</Title>
                            <Text type="secondary">
                                Thông tin người liên hệ khi đặt hàng, mua hàng
                            </Text>

                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="contactFullname"
                                        label={
                                            SupplierConfigs.properties
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
                                            SupplierConfigs.properties
                                                .contactEmail.label
                                        }
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="contactPhone"
                                        label={
                                            SupplierConfigs.properties
                                                .contactPhone.label
                                        }
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        {/* Thông tin công ty */}
                        <div>
                            <Title level={4}>Thông tin công ty</Title>
                            <Text type="secondary">
                                Thông tin chi tiết nhà cung cấp
                            </Text>

                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="companyName"
                                        label={
                                            SupplierConfigs.properties
                                                .companyName.label
                                        }
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="taxCode"
                                        label={
                                            SupplierConfigs.properties.taxCode
                                                .label
                                        }
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="email"
                                        label={
                                            SupplierConfigs.properties.email
                                                .label
                                        }
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="phone"
                                        label={
                                            SupplierConfigs.properties.phone
                                                .label
                                        }
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="fax"
                                        label={
                                            SupplierConfigs.properties.fax.label
                                        }
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="website"
                                        label={
                                            SupplierConfigs.properties.website
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
                                            SupplierConfigs.properties[
                                                "address.line"
                                            ].label
                                        }
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="address.provinceId"
                                        label={
                                            SupplierConfigs.properties[
                                                "address.provinceId"
                                            ].label
                                        }
                                    >
                                        <Select
                                            placeholder="--"
                                            allowClear
                                            showSearch
                                            options={provinceOptions}
                                            filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase(),
                                                    )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="address.districtId"
                                        label={
                                            SupplierConfigs.properties[
                                                "address.districtId"
                                            ].label
                                        }
                                    >
                                        <Select
                                            placeholder="--"
                                            allowClear
                                            showSearch
                                            options={districtOptions}
                                            filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase(),
                                                    )
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="description"
                                        label={
                                            SupplierConfigs.properties
                                                .description.label
                                        }
                                    >
                                        <TextArea rows={4} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="note"
                                        label={
                                            SupplierConfigs.properties.note
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
                                            SupplierConfigs.properties.status
                                                .label
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng chọn trạng thái",
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
                        </div>
                    </Space>

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

export default SupplierCreate;
