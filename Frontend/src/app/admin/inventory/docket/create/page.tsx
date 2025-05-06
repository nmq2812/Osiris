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
import PurchaseOrderConfigs from "../../purchase-order/PurchaseOrderConfigs";
import DocketConfigs from "../DocketConfigs";
import useDocketCreateViewModel from "../DocketCreate.vm";
import OrderConfigs from "@/app/admin/order/OrderConfigs";

const { TextArea } = Input;

function DocketCreate() {
    const {
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
    } = useDocketCreateViewModel();

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
            { size: 5, search: purchaseOrderSelectDebouncedKeyword },
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
            { size: 5, search: orderSelectDebouncedKeyword },
            (orderListResponse) => {
                const selectList: SelectOption[] =
                    orderListResponse.content.map((item) => ({
                        value: String(item.id),
                        label: item.code,
                    }));
                setOrderSelectList(selectList);
            },
        );

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
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <CreateUpdateTitle
                    managerPath={DocketConfigs.managerPath}
                    title={DocketConfigs.createTitle}
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
                                    errorSearchInput={
                                        form.errors.docketVariants
                                    }
                                />
                                {variants.length > 0 && (
                                    <VariantTable
                                        type={EntityType.DOCKET}
                                        variants={variants}
                                        variantRequests={
                                            form.values.docketVariants
                                        }
                                        handleQuantityInput={
                                            handleQuantityInput
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
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={
                                                DocketConfigs.properties.type
                                                    .label
                                            }
                                            name="type"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn loại phiếu",
                                                },
                                            ]}
                                            validateStatus={
                                                form.errors.type ? "error" : ""
                                            }
                                            help={form.errors.type}
                                        >
                                            <Select
                                                placeholder="--"
                                                options={typeSelectList}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            label={
                                                DocketConfigs.properties.code
                                                    .label
                                            }
                                            name="code"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập mã phiếu",
                                                },
                                            ]}
                                            validateStatus={
                                                form.errors.code ? "error" : ""
                                            }
                                            help={form.errors.code}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            label="Lý do phiếu NXK"
                                            name="reasonId"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn lý do",
                                                },
                                            ]}
                                            validateStatus={
                                                form.errors.reasonId
                                                    ? "error"
                                                    : ""
                                            }
                                            help={form.errors.reasonId}
                                        >
                                            <Select
                                                placeholder="--"
                                                options={reasonSelectList}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            label="Nhà kho"
                                            name="warehouseId"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn nhà kho",
                                                },
                                            ]}
                                            validateStatus={
                                                form.errors.warehouseId
                                                    ? "error"
                                                    : ""
                                            }
                                            help={form.errors.warehouseId}
                                        >
                                            <Select
                                                placeholder="--"
                                                options={warehouseSelectList}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            label="Đơn mua hàng"
                                            name="purchaseOrderId"
                                        >
                                            <Select
                                                placeholder="--"
                                                showSearch
                                                allowClear
                                                filterOption={false}
                                                onSearch={
                                                    setPurchaseOrderSelectKeyword
                                                }
                                                options={
                                                    purchaseOrderSelectList
                                                }
                                                loading={
                                                    isFetchingPurchaseOrderListResponse
                                                }
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            label="Đơn hàng"
                                            name="orderId"
                                        >
                                            <Select
                                                placeholder="--"
                                                showSearch
                                                allowClear
                                                filterOption={false}
                                                onSearch={setOrderSelectKeyword}
                                                options={orderSelectList}
                                                loading={
                                                    isFetchingOrderListResponse
                                                }
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            label={
                                                DocketConfigs.properties.note
                                                    .label
                                            }
                                            name="note"
                                        >
                                            <TextArea rows={4} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            label={
                                                DocketConfigs.properties.status
                                                    .label
                                            }
                                            name="status"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn trạng thái",
                                                },
                                            ]}
                                            validateStatus={
                                                form.errors.status
                                                    ? "error"
                                                    : ""
                                            }
                                            help={form.errors.status}
                                        >
                                            <Select
                                                placeholder="--"
                                                options={statusSelectList}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider />

                                <Space
                                    style={{
                                        width: "100%",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Button onClick={resetForm}>
                                        Mặc định
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Thêm
                                    </Button>
                                </Space>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
}

export default DocketCreate;
