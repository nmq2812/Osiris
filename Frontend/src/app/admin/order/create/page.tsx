"use client";
import React, { useState } from "react";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
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
import OrderConfigs from "../OrderConfigs";
import useOrderCreateViewModel from "../OrderCreate.vm";
import MiscUtils from "@/utils/MiscUtils";
import { useDebouncedValue } from "@mantine/hooks";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import { UserResponse } from "@/models/User";
import UserConfigs from "@/app/admin/user/UserConfigs";

const { Text } = Typography;
const { TextArea } = Input;

function OrderCreate() {
    const {
        form,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleQuantityInput,
        handleDeleteVariantButton,
        handleShippingCostInput,
        resetForm,
        orderResourceSelectList,
        orderCancellationReasonSelectList,
        paymentMethodSelectList,
        statusSelectList,
        paymentStatusSelectList,
        variants,
    } = useOrderCreateViewModel();

    const [userSelectKeyword, setUserSelectKeyword] = useState("");
    const [userSelectDebouncedKeyword] = useDebouncedValue(
        userSelectKeyword,
        400,
    );
    const [userSelectList, setUserSelectList] = useState<SelectOption[]>([]);

    const { isFetching: isFetchingUserListResponse } =
        useGetAllApi<UserResponse>(
            UserConfigs.resourceUrl,
            UserConfigs.resourceKey,
            { size: 5, search: userSelectDebouncedKeyword },
            (userListResponse) => {
                const selectList: SelectOption[] = userListResponse.content.map(
                    (item) => ({
                        value: String(item.id),
                        label: item.fullname,
                    }),
                );
                setUserSelectList(selectList);
            },
        );

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        userId: form.values.userId,
        code: form.values.code,
        status: form.values.status,
        toName: form.values.toName,
        toPhone: form.values.toPhone,
        toProvinceName: form.values.toProvinceName,
        toDistrictName: form.values.toDistrictName,
        toWardName: form.values.toWardName,
        toAddress: form.values.toAddress,
        orderResourceId: form.values.orderResourceId,
        orderCancellationReasonId: form.values.orderCancellationReasonId,
        note: form.values.note,
        paymentMethodType: form.values.paymentMethodType,
        paymentStatus: form.values.paymentStatus,
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", paddingBottom: 50 }}
        >
            <CreateUpdateTitle
                managerPath={OrderConfigs.managerPath}
                title={OrderConfigs.createTitle}
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
                                errorSearchInput={form.errors.orderVariants}
                            />
                            {variants.length > 0 && (
                                <VariantTable
                                    type={EntityType.ORDER}
                                    variants={variants}
                                    variantRequests={form.values.orderVariants}
                                    handleQuantityInput={handleQuantityInput}
                                    handleDeleteVariantButton={
                                        handleDeleteVariantButton
                                    }
                                />
                            )}
                        </Space>

                        <Divider style={{ marginTop: 8 }} />

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Row
                                gutter={[8, 8]}
                                style={{ width: "45%", padding: "16px" }}
                            >
                                <Col span={12}>
                                    <Text strong>Tổng thành tiền:</Text>
                                </Col>
                                <Col span={12}>
                                    <Text
                                        strong
                                        style={{
                                            color: "#1890ff",
                                            textAlign: "right",
                                            display: "block",
                                        }}
                                    >
                                        {MiscUtils.formatPrice(
                                            form.values.totalAmount,
                                        ) + " ₫"}
                                    </Text>
                                </Col>

                                <Col span={12}>
                                    <Text strong>
                                        Thuế ({form.values.tax * 100 + "%"}):
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text
                                        strong
                                        style={{
                                            color: "#1890ff",
                                            textAlign: "right",
                                            display: "block",
                                        }}
                                    >
                                        {MiscUtils.formatPrice(
                                            Number(
                                                (
                                                    form.values.totalAmount *
                                                    form.values.tax
                                                ).toFixed(0),
                                            ),
                                        ) + " ₫"}
                                    </Text>
                                </Col>

                                <Col span={12}>
                                    <Text strong>Phí vận chuyển:</Text>
                                </Col>
                                <Col span={12}>
                                    <InputNumber
                                        size="small"
                                        placeholder="--"
                                        value={form.values.shippingCost.toString()}
                                        onChange={(value) =>
                                            handleShippingCostInput(
                                                Number(value) || 0,
                                            )
                                        }
                                        status={
                                            form.errors.shippingCost
                                                ? "error"
                                                : ""
                                        }
                                        min={"0"}
                                        step={100}
                                        prefix="₫"
                                        formatter={MiscUtils.formatterPrice}
                                        parser={MiscUtils.parserPrice}
                                        disabled
                                        style={{ width: "100%" }}
                                    />
                                </Col>

                                <Col span={12}>
                                    <Text strong>Tổng tiền trả:</Text>
                                </Col>
                                <Col span={12}>
                                    <Space
                                        direction="vertical"
                                        size={2}
                                        style={{
                                            textAlign: "right",
                                            width: "100%",
                                        }}
                                    >
                                        <Text
                                            strong
                                            style={{ color: "#1890ff" }}
                                        >
                                            {MiscUtils.formatPrice(
                                                form.values.totalPay,
                                            ) + " ₫"}
                                        </Text>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: "12px" }}
                                        >
                                            (chưa tính phí vận chuyển)
                                        </Text>
                                    </Space>
                                </Col>
                            </Row>
                        </div>
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
                                label="Người đặt hàng"
                                name="userId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn người đặt hàng",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.userId ? "error" : ""
                                }
                                help={form.errors.userId}
                            >
                                <Select
                                    placeholder="--"
                                    showSearch
                                    filterOption={false}
                                    onSearch={setUserSelectKeyword}
                                    options={userSelectList}
                                    loading={isFetchingUserListResponse}
                                />
                            </Form.Item>

                            <Form.Item
                                label={OrderConfigs.properties.code.label}
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã đơn hàng",
                                    },
                                ]}
                                validateStatus={form.errors.code ? "error" : ""}
                                help={form.errors.code}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label={OrderConfigs.properties.status.label}
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

                            <Form.Item
                                label="Tên người nhận"
                                name="toName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên người nhận",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.toName ? "error" : ""
                                }
                                help={form.errors.toName}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại người nhận"
                                name="toPhone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số điện thoại",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.toPhone ? "error" : ""
                                }
                                help={form.errors.toPhone}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Tỉnh thành người nhận"
                                name="toProvinceName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tỉnh thành",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.toProvinceName ? "error" : ""
                                }
                                help={form.errors.toProvinceName}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Quận huyện người nhận"
                                name="toDistrictName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập quận huyện",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.toDistrictName ? "error" : ""
                                }
                                help={form.errors.toDistrictName}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Phường xã người nhận"
                                name="toWardName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập phường xã",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.toWardName ? "error" : ""
                                }
                                help={form.errors.toWardName}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ người nhận"
                                name="toAddress"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập địa chỉ",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.toAddress ? "error" : ""
                                }
                                help={form.errors.toAddress}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Nguồn đơn hàng"
                                name="orderResourceId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn nguồn đơn hàng",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.orderResourceId ? "error" : ""
                                }
                                help={form.errors.orderResourceId}
                            >
                                <Select
                                    placeholder="--"
                                    options={orderResourceSelectList}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Lý do hủy đơn hàng"
                                name="orderCancellationReasonId"
                                validateStatus={
                                    form.errors.orderCancellationReasonId
                                        ? "error"
                                        : ""
                                }
                                help={form.errors.orderCancellationReasonId}
                            >
                                <Select
                                    placeholder="--"
                                    allowClear
                                    options={orderCancellationReasonSelectList}
                                    disabled={form.values.status !== "5"}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú đơn hàng"
                                name="note"
                                validateStatus={form.errors.note ? "error" : ""}
                                help={form.errors.note}
                            >
                                <TextArea rows={4} />
                            </Form.Item>

                            <Form.Item
                                label="Hình thức thanh toán"
                                name="paymentMethodType"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng chọn hình thức thanh toán",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.paymentMethodType ? "error" : ""
                                }
                                help={form.errors.paymentMethodType}
                            >
                                <Select
                                    placeholder="--"
                                    options={paymentMethodSelectList}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Trạng thái thanh toán"
                                name="paymentStatus"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng chọn trạng thái thanh toán",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.paymentStatus ? "error" : ""
                                }
                                help={form.errors.paymentStatus}
                            >
                                <Select
                                    placeholder="--"
                                    options={paymentStatusSelectList}
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

export default OrderCreate;
