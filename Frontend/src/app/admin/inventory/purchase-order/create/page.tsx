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
    Typography,
    Input,
    Form,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";

import PurchaseOrderConfigs from "@/app/admin/inventory/purchase-order/PurchaseOrderConfigs";
import usePurchaseOrderCreateViewModel from "@/app/admin/inventory/purchase-order/PurchaseOrderCreate.vm";
import MiscUtils from "@/utils/MiscUtils";
import { PurchaseOrderVariantRequest } from "@/models/PurchaseOrderVariant";
import VariantFinder from "@/components/VariantFinder";
import VariantTable, { EntityType } from "@/components/VariantTable";

const { TextArea } = Input;
const { Text } = Typography;

function PurchaseOrderCreate() {
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleQuantityInput,
        handleDeleteVariantButton,
        resetForm,
        supplierSelectList,
        destinationSelectList,
        statusSelectList,
        variants,
        isSubmitting,
    } = usePurchaseOrderCreateViewModel();

    // Convert select lists to Ant Design format
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
            supplierId: string | null;
            purchaseOrderVariants: PurchaseOrderVariantRequest[];
            destinationId: string | null;
            totalAmount: number;
            note: string;
            status: string;
        }>,
    ) => {
        mantineForm.setValues(values);
        handleFormSubmit();
    };

    // Reset form handler
    const handleReset = () => {
        form.resetFields();
        resetForm();
    };

    return (
        <Space
            direction="vertical"
            style={{ width: "100%", paddingBottom: 50 }}
        >
            <CreateUpdateTitle
                managerPath={PurchaseOrderConfigs.managerPath}
                title={PurchaseOrderConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Row gutter={16}>
                <Col xs={24} md={16} lg={16}>
                    <Card>
                        <Space
                            direction="vertical"
                            style={{ width: "100%" }}
                            size="small"
                        >
                            <VariantFinder
                                selectedVariants={variants}
                                onClickItem={handleClickVariantResultItem}
                                errorSearchInput={
                                    mantineForm.errors.purchaseOrderVariants
                                }
                            />
                            {variants.length > 0 && (
                                <VariantTable
                                    type={EntityType.PURCHASE_ORDER}
                                    variants={variants}
                                    variantRequests={
                                        mantineForm.values.purchaseOrderVariants
                                    }
                                    handleQuantityInput={handleQuantityInput}
                                    handleDeleteVariantButton={
                                        handleDeleteVariantButton
                                    }
                                />
                            )}
                        </Space>

                        <Divider />

                        <div style={{ textAlign: "right", padding: "8px" }}>
                            <Text style={{ fontSize: "14px", fontWeight: 500 }}>
                                Tổng thành tiền:{" "}
                                <Text
                                    style={{
                                        fontSize: "16px",
                                        color: "#1890ff",
                                    }}
                                >
                                    {MiscUtils.formatPrice(
                                        mantineForm.values.totalAmount,
                                    ) + " ₫"}
                                </Text>
                            </Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={8} lg={8}>
                    <Card>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                                code: mantineForm.values.code,
                                supplierId: mantineForm.values.supplierId,
                                destinationId: mantineForm.values.destinationId,
                                note: mantineForm.values.note,
                                status: mantineForm.values.status,
                                totalAmount: mantineForm.values.totalAmount,
                                purchaseOrderVariants:
                                    mantineForm.values.purchaseOrderVariants,
                            }}
                        >
                            <Form.Item
                                name="code"
                                label={
                                    PurchaseOrderConfigs.properties.code.label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã đơn hàng",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="supplierId"
                                label="Nhà cung cấp"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn nhà cung cấp",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--"
                                    showSearch
                                    options={mapToAntOptions(
                                        supplierSelectList,
                                    )}
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                name="destinationId"
                                label="Điểm nhập hàng"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn điểm nhập hàng",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--"
                                    showSearch
                                    options={mapToAntOptions(
                                        destinationSelectList,
                                    )}
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                name="note"
                                label={
                                    PurchaseOrderConfigs.properties.note.label
                                }
                            >
                                <TextArea rows={4} />
                            </Form.Item>

                            <Form.Item
                                name="status"
                                label={
                                    PurchaseOrderConfigs.properties.status.label
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

                            <Form.Item name="purchaseOrderVariants" hidden>
                                <Input />
                            </Form.Item>

                            <Form.Item name="totalAmount" hidden>
                                <Input />
                            </Form.Item>

                            <Divider />

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Button onClick={handleReset}>Mặc định</Button>
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
                </Col>
            </Row>
        </Space>
    );
}

export default PurchaseOrderCreate;
