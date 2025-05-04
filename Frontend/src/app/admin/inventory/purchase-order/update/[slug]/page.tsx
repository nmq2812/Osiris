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
    Typography,
    Row,
    Col,
    Spin,
} from "antd";
import { useParams } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import VariantFinder from "@/components/VariantFinder";
import VariantTable, { EntityType } from "@/components/VariantTable";
import PurchaseOrderConfigs from "@/app/admin/inventory/purchase-order/PurchaseOrderConfigs";
import usePurchaseOrderUpdateViewModel from "@/app/admin/inventory/purchase-order/PurchaseOrderUpdate.vm";
import MiscUtils from "@/utils/MiscUtils";
import { PurchaseOrderVariantRequest } from "@/models/PurchaseOrderVariant";

const { TextArea } = Input;

function PurchaseOrderUpdate() {
    const { slug } = useParams();
    const id = Number(slug);
    const [form] = Form.useForm();

    const {
        purchaseOrder,
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
        isLoading,
        updateStatus,
    } = usePurchaseOrderUpdateViewModel(id);

    // Convert select options for Ant Design
    const mapToAntOptions = (options: any[]) => {
        return options.map((option: { value: any; label: any }) => ({
            value: option.value,
            label: option.label,
        }));
    };

    // THAY ĐỔI 1: Sửa useMemo để tránh phụ thuộc vào mantineForm.values
    const formInitialized = React.useRef(false);
    const totalAmountRef = React.useRef(0);

    // Thay thế cách memoize để tránh phụ thuộc vào mantineForm.values
    React.useEffect(() => {
        // Chỉ cập nhật ref khi có giá trị mới thực sự
        if (
            mantineForm.values &&
            mantineForm.values.totalAmount !== totalAmountRef.current
        ) {
            totalAmountRef.current = mantineForm.values.totalAmount || 0;
        }
    }, [mantineForm.values?.totalAmount]);

    // Memoize format price sử dụng ref thay vì state
    const formattedPrice = React.useMemo(() => {
        return MiscUtils.formatPrice(totalAmountRef.current) + " ₫";
    }, [totalAmountRef.current]);

    // THAY ĐỔI 2: Tách và cải thiện effect khởi tạo form
    useEffect(() => {
        if (purchaseOrder && !formInitialized.current) {
            form.setFieldsValue({
                code: purchaseOrder.code,
                supplierId: String(purchaseOrder.supplier.id),
                destinationId: String(purchaseOrder.destination.id),
                note: purchaseOrder.note || "",
                status: String(purchaseOrder.status),
                // Hidden fields - don't reference mantineForm.values
                purchaseOrderVariants: purchaseOrder.purchaseOrderVariants.map(
                    (item) => ({
                        variantId: item.variant.id,
                        cost: item.cost,
                        quantity: item.quantity,
                        amount: item.amount,
                    }),
                ),
                totalAmount: purchaseOrder.totalAmount,
            });

            // Set value cho totalAmountRef
            totalAmountRef.current = purchaseOrder.totalAmount;

            // Đánh dấu đã khởi tạo
            formInitialized.current = true;
        }
    }, [purchaseOrder, form]);

    // Handle form submission
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

    // Handle form reset
    const handleReset = () => {
        form.resetFields();
        resetForm();
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!purchaseOrder) {
        return null;
    }

    return (
        <Space
            direction="vertical"
            style={{ width: "100%", paddingBottom: 50 }}
        >
            <CreateUpdateTitle
                managerPath={PurchaseOrderConfigs.managerPath}
                title={PurchaseOrderConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={purchaseOrder.id}
                createdAt={purchaseOrder.createdAt}
                updatedAt={purchaseOrder.updatedAt}
                createdBy={purchaseOrder.createdBy?.username || "1"}
                updatedBy={purchaseOrder.updatedBy?.username || "1"}
            />

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

                        {/* THAY ĐỔI 3: Thay thế cách hiển thị total amount trong JSX */}
                        <div style={{ textAlign: "right", padding: "8px" }}>
                            <div style={{ fontSize: "14px", fontWeight: 500 }}>
                                Tổng thành tiền:{" "}
                                <span
                                    style={{
                                        fontSize: "16px",
                                        color: "#1890ff",
                                    }}
                                >
                                    {MiscUtils.formatPrice(
                                        totalAmountRef.current,
                                    ) + " ₫"}
                                </span>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={8} lg={8}>
                    <Card>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                name="code"
                                label={
                                    PurchaseOrderConfigs.properties.code.label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập mã đơn nhập hàng",
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

                            {/* Hidden fields to store values managed by the view model */}
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
                                    loading={updateStatus === "pending"}
                                >
                                    Cập nhật
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
}

export default PurchaseOrderUpdate;
