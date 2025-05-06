"use client";
import React, { useState } from "react";
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
    Spin,
    Typography,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import VariantFinder from "@/components/VariantFinder";
import VariantTable, { EntityType } from "@/components/VariantTable";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import { OrderResponse } from "@/models/Order";
import { PurchaseOrderResponse } from "@/models/PurchaseOrder";
import { useDebouncedValue } from "@mantine/hooks";
import { useParams } from "next/navigation";
import PurchaseOrderConfigs from "../../purchase-order/PurchaseOrderConfigs";
import DocketConfigs from "../DocketConfigs";
import useDocketUpdateViewModel from "../DocketUpdate.vm";
import OrderConfigs from "@/app/admin/order/OrderConfigs";

const { TextArea } = Input;

function DocketUpdate() {
    const param = useParams();
    const id = param?.slug;
    const {
        docket,
        form,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleQuantityInput,
        handleDeleteVariantButton,
        resetForm,
        reasonSelectList,
        warehouseSelectList,
        typeSelectList,
        statusSelectList,
        variants,
    } = useDocketUpdateViewModel(Number(id));

    const [purchaseOrderSelectKeyword, setPurchaseOrderSelectKeyword] =
        useState("");
    const [orderSelectKeyword, setOrderSelectKeyword] = useState("");

    const [purchaseOrderSelectDebouncedKeyword] = useDebouncedValue(
        purchaseOrderSelectKeyword,
        400,
    );
    const [orderSelectDebouncedKeyword] = useDebouncedValue(
        orderSelectKeyword,
        400,
    );

    const [purchaseOrderSelectList, setPurchaseOrderSelectList] = useState<
        SelectOption[]
    >([]);
    const [orderSelectList, setOrderSelectList] = useState<SelectOption[]>([]);

    const { isFetching: isFetchingPurchaseOrderListResponse } =
        useGetAllApi<PurchaseOrderResponse>(
            PurchaseOrderConfigs.resourceUrl,
            PurchaseOrderConfigs.resourceKey,
            {
                filter:
                    form.values.purchaseOrderId &&
                    purchaseOrderSelectDebouncedKeyword === ""
                        ? `id==${form.values.purchaseOrderId}`
                        : "",
                size: 5,
                search: purchaseOrderSelectDebouncedKeyword,
            },
            (purchaseOrderListResponse) => {
                const selectList: SelectOption[] =
                    purchaseOrderListResponse.content.map((item) => ({
                        value: String(item.id),
                        label: item.code,
                    }));
                setPurchaseOrderSelectList(selectList);
            },
        );

    const { isFetching: isFetchingOrderListResponse } =
        useGetAllApi<OrderResponse>(
            OrderConfigs.resourceUrl,
            OrderConfigs.resourceKey,
            {
                filter:
                    form.values.orderId && orderSelectDebouncedKeyword === ""
                        ? `id==${form.values.orderId}`
                        : "",
                size: 5,
                search: orderSelectDebouncedKeyword,
            },
            (orderListResponse) => {
                const selectList: SelectOption[] =
                    orderListResponse.content.map((item) => ({
                        value: String(item.id),
                        label: item.code,
                    }));
                setOrderSelectList(selectList);
            },
        );

    if (!docket) {
        return <Spin size="large" tip="Đang tải..." />;
    }

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        type: form.values.type,
        code: form.values.code,
        reasonId: form.values.reasonId,
        warehouseId: form.values.warehouseId,
        purchaseOrderId: form.values.purchaseOrderId,
        orderId: form.values.orderId,
        note: form.values.note,
        status: form.values.status,
    };

    return (
        <div style={{ paddingBottom: 50 }}>
            <CreateUpdateTitle
                managerPath={DocketConfigs.managerPath}
                title={DocketConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={docket.id}
                createdAt={docket.createdAt}
                updatedAt={docket.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

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
                                    type={EntityType.DOCKET}
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
                                label={DocketConfigs.properties.type.label}
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn loại phiếu",
                                    },
                                ]}
                                validateStatus={form.errors.type ? "error" : ""}
                                help={form.errors.type}
                            >
                                <Select
                                    placeholder="--"
                                    options={typeSelectList}
                                />
                            </Form.Item>

                            <Form.Item
                                label={DocketConfigs.properties.code.label}
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã phiếu",
                                    },
                                ]}
                                validateStatus={form.errors.code ? "error" : ""}
                                help={form.errors.code}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Lý do phiếu NXK"
                                name="reasonId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn lý do",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.reasonId ? "error" : ""
                                }
                                help={form.errors.reasonId}
                            >
                                <Select
                                    placeholder="--"
                                    options={reasonSelectList}
                                />
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
                                label="Đơn mua hàng"
                                name="purchaseOrderId"
                            >
                                <Select
                                    placeholder="--"
                                    showSearch
                                    allowClear
                                    filterOption={false}
                                    onSearch={setPurchaseOrderSelectKeyword}
                                    options={purchaseOrderSelectList}
                                    loading={
                                        isFetchingPurchaseOrderListResponse
                                    }
                                />
                            </Form.Item>

                            <Form.Item label="Đơn hàng" name="orderId">
                                <Select
                                    placeholder="--"
                                    showSearch
                                    allowClear
                                    filterOption={false}
                                    onSearch={setOrderSelectKeyword}
                                    options={orderSelectList}
                                    loading={isFetchingOrderListResponse}
                                />
                            </Form.Item>

                            <Form.Item
                                label={DocketConfigs.properties.note.label}
                                name="note"
                            >
                                <TextArea rows={4} />
                            </Form.Item>

                            <Form.Item
                                label={DocketConfigs.properties.status.label}
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
                                    Cập nhật
                                </Button>
                            </Space>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DocketUpdate;
