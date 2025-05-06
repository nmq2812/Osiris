"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    Spin,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import WaybillConfigs from "../WaybillConfigs";
import useWaybillCreateViewModel from "../WaybillCreate.vm";
import { useDebouncedValue } from "@mantine/hooks";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import { OrderResponse } from "@/models/Order";
import OrderConfigs from "@/app/admin/order/OrderConfigs";
import dayjs from "dayjs";

const { TextArea } = Input;

function WaybillCreate() {
    const { form, handleFormSubmit, ghnRequiredNoteSelectList } =
        useWaybillCreateViewModel();

    const [orderSelectKeyword, setOrderSelectKeyword] = useState("");
    const [orderSelectDebouncedKeyword] = useDebouncedValue(
        orderSelectKeyword,
        400,
    );
    const [orderSelectList, setOrderSelectList] = useState<SelectOption[]>([]);

    // Lấy dữ liệu trực tiếp thay vì qua callback
    const { data: orderListResponse, isFetching: isFetchingOrderListResponse } =
        useGetAllApi<OrderResponse>(
            OrderConfigs.resourceUrl,
            OrderConfigs.resourceKey,
            {
                size: 5,
                filter: "status==1",
                search: orderSelectDebouncedKeyword,
            },
        );

    // Sử dụng useEffect để xử lý dữ liệu khi có phản hồi
    useEffect(() => {
        if (orderListResponse?.content) {
            const selectList: SelectOption[] = orderListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.code,
                }),
            );
            setOrderSelectList(selectList);
        }
    }, [orderListResponse]);

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        orderId: form.values.orderId,
        shippingDate: form.values.shippingDate
            ? dayjs(form.values.shippingDate)
            : null,
        weight: form.values.weight,
        length: form.values.length,
        width: form.values.width,
        height: form.values.height,
        note: form.values.note,
        ghnRequiredNote: form.values.ghnRequiredNote,
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", maxWidth: 800 }}
        >
            <CreateUpdateTitle
                managerPath={WaybillConfigs.managerPath}
                title={WaybillConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={handleFormSubmit}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Đơn hàng"
                                name="orderId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn đơn hàng",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.orderId ? "error" : ""
                                }
                                help={form.errors.orderId}
                            >
                                <Select
                                    placeholder="Nhập mã đơn hàng và chọn đơn hàng"
                                    showSearch
                                    allowClear
                                    filterOption={false}
                                    onSearch={setOrderSelectKeyword}
                                    options={orderSelectList}
                                    loading={isFetchingOrderListResponse}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Ngày gửi hàng"
                                name="shippingDate"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn ngày gửi hàng",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.shippingDate ? "error" : ""
                                }
                                help={form.errors.shippingDate}
                            >
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    style={{ width: "100%" }}
                                    disabledDate={(current) =>
                                        current &&
                                        current < dayjs().startOf("day")
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Khối lượng kiện hàng"
                                name="weight"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập khối lượng",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.weight ? "error" : ""
                                }
                                help={form.errors.weight}
                                extra="Tính theo gram. Tối đa 30.000 gram."
                            >
                                <InputNumber
                                    min={1}
                                    max={30000}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Chiều dài kiện hàng"
                                name="length"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập chiều dài",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.length ? "error" : ""
                                }
                                help={form.errors.length}
                                extra="Tính theo cm. Tối đa 150 cm."
                            >
                                <InputNumber
                                    min={1}
                                    max={150}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Chiều rộng kiện hàng"
                                name="width"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập chiều rộng",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.width ? "error" : ""
                                }
                                help={form.errors.width}
                                extra="Tính theo cm. Tối đa 150 cm."
                            >
                                <InputNumber
                                    min={1}
                                    max={150}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Chiều cao kiện hàng"
                                name="height"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập chiều cao",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.height ? "error" : ""
                                }
                                help={form.errors.height}
                                extra="Tính theo cm. Tối đa 150 cm."
                            >
                                <InputNumber
                                    min={1}
                                    max={150}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Ghi chú vận đơn"
                                name="note"
                                validateStatus={form.errors.note ? "error" : ""}
                                help={form.errors.note}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Ghi chú cho dịch vụ GHN"
                                name="ghnRequiredNote"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn ghi chú",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.ghnRequiredNote ? "error" : ""
                                }
                                help={form.errors.ghnRequiredNote}
                            >
                                <Select
                                    placeholder="--"
                                    options={ghnRequiredNoteSelectList}
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
                        <Button onClick={form.reset}>Mặc định</Button>
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </Space>
                </Form>
            </Card>
        </Space>
    );
}

export default WaybillCreate;
