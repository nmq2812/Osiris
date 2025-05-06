"use client";
import React from "react";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Space,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import VariantFinder from "@/components/VariantFinder";
import VariantTable, { EntityType } from "@/components/VariantTable";
import CountConfigs from "../CountConfigs";
import useCountCreateViewModel from "../CountCreate.vm";

const { TextArea } = Input;

function CountCreate() {
    const {
        form,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleActualInventoryInput,
        handleDeleteVariantButton,
        resetForm,
        warehouseSelectList,
        statusSelectList,
        variants,
    } = useCountCreateViewModel();

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        code: form.values.code,
        warehouseId: form.values.warehouseId,
        note: form.values.note,
        status: form.values.status,
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", paddingBottom: 50 }}
        >
            <CreateUpdateTitle
                managerPath={CountConfigs.managerPath}
                title={CountConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Row gutter={16}>
                <Col xs={24} md={16}>
                    <Card>
                        <Space
                            direction="vertical"
                            style={{ width: "100%" }}
                            size="small"
                        >
                            <VariantFinder
                                selectedVariants={variants}
                                onClickItem={handleClickVariantResultItem}
                                errorSearchInput={form.errors.countVariants}
                            />
                            {variants.length > 0 && (
                                <VariantTable
                                    type={EntityType.COUNT}
                                    variants={variants}
                                    variantRequests={form.values.countVariants}
                                    handleActualInventoryInput={
                                        handleActualInventoryInput
                                    }
                                    handleDeleteVariantButton={
                                        handleDeleteVariantButton
                                    }
                                />
                            )}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card>
                        <Form
                            layout="vertical"
                            initialValues={initialValues}
                            onFinish={handleFormSubmit}
                        >
                            <Form.Item
                                label={CountConfigs.properties.code.label}
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập mã phiếu kiểm kho",
                                    },
                                ]}
                                validateStatus={form.errors.code ? "error" : ""}
                                help={form.errors.code}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Nhà kho"
                                name="warehouseId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn nhà kho",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.warehouseId ? "error" : ""
                                }
                                help={form.errors.warehouseId}
                            >
                                <Select
                                    placeholder="--"
                                    options={warehouseSelectList}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú phiếu kiểm kho"
                                name="note"
                            >
                                <TextArea rows={4} />
                            </Form.Item>

                            <Form.Item
                                label={CountConfigs.properties.status.label}
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn trạng thái",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.status ? "error" : ""
                                }
                                help={form.errors.status}
                            >
                                <Select
                                    placeholder="--"
                                    options={statusSelectList}
                                />
                            </Form.Item>

                            <Divider />

                            <Space
                                style={{
                                    width: "100%",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Button onClick={resetForm}>Mặc định</Button>
                                <Button type="primary" htmlType="submit">
                                    Thêm
                                </Button>
                            </Space>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
}

export default CountCreate;
