"use client";
import React from "react";
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
    DatePicker,
} from "antd";
import { useParams } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";

import { ProductResponse } from "@/models/Product";
import ProductConfigs from "@/app/admin/product/ProductConfigs";
import dayjs from "dayjs";
import MiscUtils from "@/utils/MiscUtils";
import PromotionConfigs from "../../PromotionConfigs";
import usePromotionUpdateViewModel from "../../PromotionUpdate.vm";
import EntityFinder from "@/components/EntityFinder";

const { Text } = Typography;
const { RangePicker } = DatePicker;

function PromotionUpdate() {
    // Cập nhật cách lấy param theo cấu trúc Next.js
    const params = useParams();
    const slug = params?.slug;

    const {
        promotion,
        form,
        handleFormSubmit,
        statusSelectList,
        products,
        setProducts,
        handleAddProductFinder,
        handleDeleteProductFinder,
    } = usePromotionUpdateViewModel(Number(slug));

    if (!promotion) {
        return <Spin size="large" tip="Đang tải..." />;
    }

    const resetForm = () => {
        form.reset();
        setProducts([]);
    };

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        name: form.values.name,
        range: form.values.range
            ? [dayjs(form.values.range[0]), dayjs(form.values.range[1])]
            : null,
        percent: form.values.percent,
        status: form.values.status,
    };

    // Điều chỉnh onFinish để phù hợp với Ant Design Form
    const onFinish = (values: any) => {
        // Đồng bộ giá trị từ Ant Design form sang Mantine form
        form.setValues({
            ...form.values,
            name: values.name,
            range: values.range
                ? [values.range[0].toDate(), values.range[1].toDate()]
                : form.values.range,
            percent: values.percent,
            status: values.status,
        });

        // Gọi submit sau khi đồng bộ
        setTimeout(() => {
            handleFormSubmit();
        }, 0);
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", paddingBottom: 50 }}
        >
            <CreateUpdateTitle
                managerPath={PromotionConfigs.managerPath}
                title={PromotionConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={promotion.id}
                createdAt={promotion.createdAt}
                updatedAt={promotion.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Row gutter={16}>
                <Col xs={24} md={16}>
                    <Card>
                        <EntityFinder<ProductResponse>
                            selections={products}
                            onClickItem={handleAddProductFinder}
                            onDeleteItem={handleDeleteProductFinder}
                            options={{
                                resourceUrl: ProductConfigs.resourceUrl,
                                resourceKey: ProductConfigs.resourceKey,
                                resultListSize: 5,
                                resultFragment: (
                                    productResponse: ProductResponse,
                                ) => (
                                    <Space direction="vertical" size={2}>
                                        <Text>{productResponse.name}</Text>
                                        <Space size="small">
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 12 }}
                                            >
                                                Mã: {productResponse.code}
                                            </Text>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 12 }}
                                            >
                                                Danh mục:{" "}
                                                {productResponse.category?.name}
                                            </Text>
                                        </Space>
                                    </Space>
                                ),
                                inputLabel: "Thêm sản phẩm",
                                inputPlaceholder: "Nhập tên sản phẩm",
                                selectedFragment: (productResponse) => (
                                    <Space direction="vertical" size={2}>
                                        <Text>{productResponse.name}</Text>
                                        <Space size="small">
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 12 }}
                                            >
                                                Mã: {productResponse.code}
                                            </Text>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 12 }}
                                            >
                                                Danh mục:{" "}
                                                {productResponse.category?.name}
                                            </Text>
                                        </Space>
                                    </Space>
                                ),
                                deleteButtonTitle: "Xóa sản phẩm này",
                            }}
                            errorSearchInput={form.errors.productIds}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card>
                        <Form
                            layout="vertical"
                            initialValues={initialValues}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label={PromotionConfigs.properties.name.label}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên khuyến mãi",
                                    },
                                ]}
                                validateStatus={form.errors.name ? "error" : ""}
                                help={form.errors.name}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Khoảng thời gian"
                                name="range"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn thời gian",
                                    },
                                ]}
                                validateStatus={
                                    form.errors["range.0"] ? "error" : ""
                                }
                                help={form.errors["range.0"]}
                            >
                                <RangePicker
                                    format="DD/MM/YYYY"
                                    disabledDate={(current) =>
                                        current &&
                                        current < dayjs().startOf("day")
                                    }
                                    disabled
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    PromotionConfigs.properties.percent.label
                                }
                                name="percent"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập phần trăm giảm giá",
                                    },
                                ]}
                                validateStatus={
                                    form.errors.percent ? "error" : ""
                                }
                                help={form.errors.percent}
                            >
                                <InputNumber
                                    min={1}
                                    max={100}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={PromotionConfigs.properties.status.label}
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
        </Space>
    );
}

export default PromotionUpdate;
