"use client";
import React from "react";
import {
    Button,
    Divider,
    Form,
    Input,
    Select,
    Space,
    Typography,
    Card,
    Row,
    Col,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import { useParams } from "next/navigation";
import AddressConfigs from "../../AddressConfigs";
import useAddressUpdateViewModel from "../../AddressUpdate.vm";

const { Text, Title } = Typography;

function AddressUpdate() {
    // Đúng cách lấy tham số trong Next.js App Router
    const params = useParams();
    const id = typeof params.slug === "string" ? parseInt(params.slug) : 0;

    const {
        address,
        form,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
    } = useAddressUpdateViewModel(id);

    if (!address) {
        return null;
    }

    // Chuyển đổi từ mảng Mantine sang định dạng options cho Ant Design Select
    const provinceOptions = provinceSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    const districtOptions = districtSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={AddressConfigs.managerPath}
                title={AddressConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={address.id}
                createdAt={address.createdAt}
                updatedAt={address.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Form
                layout="vertical"
                initialValues={form.values}
                onFinish={handleFormSubmit}
            >
                <Card>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={AddressConfigs.properties.line.label}
                                name="line"
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
                                label={
                                    AddressConfigs.properties.provinceId.label
                                }
                                name="provinceId"
                            >
                                <Select
                                    placeholder="--"
                                    allowClear
                                    showSearch
                                    options={provinceOptions}
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={
                                    AddressConfigs.properties.districtId.label
                                }
                                name="districtId"
                            >
                                <Select
                                    placeholder="--"
                                    allowClear
                                    showSearch
                                    options={districtOptions}
                                    optionFilterProp="label"
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
                        <Button onClick={() => form.reset()}>Mặc định</Button>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </div>
                </Card>
            </Form>
        </Space>
    );
}

export default AddressUpdate;
