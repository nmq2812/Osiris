"use client";
import React from "react";
import {
    Badge,
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
import { useParams } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";

import dayjs from "dayjs";
import MiscUtils from "@/utils/MiscUtils";
import WaybillConfigs from "../../WaybillConfigs";
import useWaybillUpdateViewModel from "../../WaybillUpdate.vm";

const { Title, Text } = Typography;
const { TextArea } = Input;

function WaybillUpdate() {
    // Cập nhật cách lấy param theo cấu trúc Next.js
    const params = useParams();
    const slug = params?.slug;

    const { waybill, form, handleFormSubmit, ghnRequiredNoteSelectList } =
        useWaybillUpdateViewModel(Number(slug));

    const waybillStatusBadgeFragment = (status: number) => {
        switch (status) {
            case 1:
                return <Badge color="default" text="Đợi lấy hàng" />;
            case 2:
                return <Badge color="blue" text="Đang giao" />;
            case 3:
                return <Badge color="green" text="Đã giao" />;
            case 4:
                return <Badge color="red" text="Hủy" />;
            default:
                return null;
        }
    };

    if (!waybill) {
        return <Spin size="large" tip="Đang tải..." />;
    }

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
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
                title={WaybillConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={waybill.id}
                createdAt={waybill.createdAt}
                updatedAt={waybill.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Card>
                <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                        <Title level={4}>Thông tin vận đơn</Title>
                        <Text type="secondary">Một số thông tin chung</Text>
                    </div>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Mã vận đơn</Text>
                                <div>
                                    <Text style={{ fontFamily: "monospace" }}>
                                        {waybill.code}
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Mã đơn hàng</Text>
                                <div>
                                    <Text style={{ fontFamily: "monospace" }}>
                                        {waybill.order.code}
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Ngày gửi hàng</Text>
                                <div>
                                    <Text>
                                        {dayjs(waybill.shippingDate).format(
                                            "DD/MM/YYYY",
                                        )}
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Thời gian giao dự kiến</Text>
                                <div>
                                    <Text>
                                        {dayjs(
                                            waybill.expectedDeliveryTime,
                                        ).format("DD/MM/YYYY")}
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Trạng thái</Text>
                                <div>
                                    {waybillStatusBadgeFragment(waybill.status)}
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Người trả phí dịch vụ GHN</Text>
                                <div>
                                    <Text>
                                        {
                                            WaybillConfigs.ghnPaymentTypeIdMap[
                                                waybill.ghnPaymentTypeId
                                            ]
                                        }
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Tiền thu hộ</Text>
                                <div>
                                    <Text>
                                        {MiscUtils.formatPrice(
                                            waybill.codAmount,
                                        )}{" "}
                                        ₫
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Phí vận chuyển</Text>
                                <div>
                                    <Text>
                                        {MiscUtils.formatPrice(
                                            waybill.shippingFee,
                                        )}{" "}
                                        ₫
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Khối lượng kiện hàng</Text>
                                <div>
                                    <Text>
                                        {MiscUtils.formatPrice(waybill.weight)}{" "}
                                        gram
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Chiều dài kiện hàng</Text>
                                <div>
                                    <Text>
                                        {MiscUtils.formatPrice(waybill.length)}{" "}
                                        cm
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Chiều rộng kiện hàng</Text>
                                <div>
                                    <Text>
                                        {MiscUtils.formatPrice(waybill.width)}{" "}
                                        cm
                                    </Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={12}>
                            <div>
                                <Text strong>Chiều cao kiện hàng</Text>
                                <div>
                                    <Text>
                                        {MiscUtils.formatPrice(waybill.height)}{" "}
                                        cm
                                    </Text>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 16 }}>
                        <Title level={4}>Thay đổi thông tin vận đơn</Title>
                        <Text type="secondary">
                            Thay đổi một số thông tin cho phép
                        </Text>
                    </div>

                    <Form
                        layout="vertical"
                        initialValues={initialValues}
                        onFinish={handleFormSubmit}
                        style={{ width: "100%" }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Ghi chú vận đơn"
                                    name="note"
                                    validateStatus={
                                        form.errors.note ? "error" : ""
                                    }
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
                                        form.errors.ghnRequiredNote
                                            ? "error"
                                            : ""
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

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </div>
                    </Form>
                </Space>
            </Card>
        </Space>
    );
}

export default WaybillUpdate;
