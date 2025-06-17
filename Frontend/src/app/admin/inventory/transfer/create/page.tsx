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
import TransferConfigs from "../TransferConfigs";
import useTransferCreateViewModel from "../TransferCreate.vm";

const { TextArea } = Input;

function TransferCreate() {
    const {
        form,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleQuantityInput,
        handleDeleteVariantButton,
        handleWarehouseSelectList,
        resetForm,
        warehouseSelectList,
        variants,
    } = useTransferCreateViewModel();

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        code: form.values.code,
        exportWarehouseId: form.values["exportDocket.warehouseId"],
        importWarehouseId: form.values["importDocket.warehouseId"],
        note: form.values.note,
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", paddingBottom: 50 }}
        >
            <CreateUpdateTitle
                managerPath={TransferConfigs.managerPath}
                title={TransferConfigs.createTitle}
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
                                errorSearchInput={form.errors.docketVariants}
                            />
                            {variants.length > 0 && (
                                <VariantTable
                                    type={EntityType.TRANSFER}
                                    variants={variants}
                                    variantRequests={form.values.docketVariants}
                                    handleQuantityInput={handleQuantityInput}
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
                                label={TransferConfigs.properties.code.label}
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã chuyển kho",
                                    },
                                ]}
                                validateStatus={form.errors.code ? "error" : ""}
                                help={form.errors.code}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Kho xuất"
                                name="exportWarehouseId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn kho xuất",
                                    },
                                ]}
                                validateStatus={
                                    form.errors["exportDocket.warehouseId"]
                                        ? "error"
                                        : ""
                                }
                                help={form.errors["exportDocket.warehouseId"]}
                            >
                                <Select
                                    placeholder="--"
                                    options={warehouseSelectList}
                                    onChange={(value) =>
                                        handleWarehouseSelectList(
                                            value,
                                            "export",
                                        )
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                label="Kho nhập"
                                name="importWarehouseId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn kho nhập",
                                    },
                                ]}
                                validateStatus={
                                    form.errors["importDocket.warehouseId"]
                                        ? "error"
                                        : ""
                                }
                                help={form.errors["importDocket.warehouseId"]}
                            >
                                <Select
                                    placeholder="--"
                                    options={warehouseSelectList}
                                    onChange={(value) =>
                                        handleWarehouseSelectList(
                                            value,
                                            "import",
                                        )
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                label={TransferConfigs.properties.note.label}
                                name="note"
                            >
                                <TextArea rows={4} />
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

export default TransferCreate;
