"use client";
import React from "react";
import { useParams } from "next/navigation";
import {
    Badge,
    Button,
    Card,
    Divider,
    Row,
    Col,
    Image,
    Skeleton,
    Space,
    Table,
    Typography,
    Tooltip,
    Modal,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
    InfoCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import ApplicationConstants from "@/constants/ApplicationConstants";
import ResourceURL from "@/constants/ResourceURL";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import DateUtils from "@/utils/DateUtils";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import PageConfigs from "@/utils/PageConfigs";
import { useAuthStore } from "@/stores/authStore";
import useTitle from "@/hooks/use-title";
import {
    ClientOrderDetailResponse,
    ClientWaybillLogResponse,
    ClientOrderVariantResponse,
    ClientReviewRequest,
    ClientReviewResponse,
} from "@/datas/ClientUI";
import { Empty } from "@/datas/Utility";

const { Text, Title } = Typography;
const { confirm } = Modal;

function ClientOrderDetail() {
    useTitle();
    const { code } = useParams();

    const { orderResponse, isLoadingOrderResponse, isErrorOrderResponse } =
        useGetOrderApi(code as string);
    const cancelOrderApi = useCancelOrderApi(code as string);
    const order = orderResponse as ClientOrderDetailResponse;

    const handleCancelOrderButton = () => {
        confirm({
            title: "Xác nhận hủy",
            icon: <ExclamationCircleOutlined />,
            content: "Bạn có muốn hủy đơn hàng này, không thể hoàn tác?",
            okText: "Hủy",
            cancelText: "Không hủy",
            okButtonProps: { danger: true },
            onOk: () => cancelOrderApi.mutate(),
        });
    };

    const orderStatusBadgeFragment = (status: number) => {
        switch (status) {
            case 1:
                return <Badge color="gray" text="Đơn hàng mới" />;
            case 2:
                return <Badge color="blue" text="Đang xử lý" />;
            case 3:
                return <Badge color="purple" text="Đang giao hàng" />;
            case 4:
                return <Badge color="green" text="Đã giao hàng" />;
            case 5:
                return <Badge color="red" text="Hủy bỏ" />;
            default:
                return null;
        }
    };

    const orderPaymentStatusBadgeFragment = (paymentStatus: number) => {
        switch (paymentStatus) {
            case 1:
                return <Badge color="gray" text="Chưa thanh toán" />;
            case 2:
                return <Badge color="green" text="Đã thanh toán" />;
            default:
                return null;
        }
    };

    const getWaybillLogInfo = (waybillLog: ClientWaybillLogResponse) => {
        type WaybillLogInfo = {
            color: string;
            text: string;
            icon: React.ReactNode;
        };
        // Replace with whichever icons you prefer
        const waybillLogMap: Record<number, WaybillLogInfo> = {
            0: { color: "gray", text: "Trạng thái vận đơn không rõ", icon: "" },
            1: {
                color: "blue",
                text: "Đơn hàng được duyệt và vận đơn được tạo",
                icon: "",
            },
            2: { color: "orange", text: "Đang giao hàng", icon: "" },
            3: { color: "green", text: "Giao hàng thành công", icon: "" },
            4: { color: "pink", text: "Vận đơn bị hủy", icon: "" },
        };
        return waybillLogMap[waybillLog.waybillLogCurrentStatus || 0];
    };

    let orderContentFragment: React.ReactNode = null;

    if (isLoadingOrderResponse) {
        orderContentFragment = (
            <Space direction="vertical" style={{ width: "100%" }}>
                {Array.from({ length: 5 }, (_, index) => (
                    <Skeleton key={index} active />
                ))}
            </Space>
        );
    }

    if (isErrorOrderResponse) {
        orderContentFragment = (
            <Space
                direction="vertical"
                align="center"
                style={{ width: "100%", marginTop: 48, color: "#ffadd2" }}
            >
                <ExclamationCircleOutlined style={{ fontSize: 80 }} />
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                    Đã có lỗi xảy ra
                </Text>
            </Space>
        );
    }

    if (order) {
        const PaymentMethodIcon =
            PageConfigs.paymentMethodIconMap[order.orderPaymentMethodType];

        orderContentFragment = (
            <Space direction="vertical" style={{ width: "100%" }}>
                <Card>
                    <Row justify="space-between">
                        <Space>
                            <Text strong>Mã đơn hàng: {order.orderCode}</Text>
                            <Text type="secondary">
                                Ngày tạo:{" "}
                                {DateUtils.isoDateToString(
                                    order.orderCreatedAt,
                                )}
                            </Text>
                        </Space>
                        <Space>
                            {orderStatusBadgeFragment(order.orderStatus)}
                            {orderPaymentStatusBadgeFragment(
                                order.orderPaymentStatus,
                            )}
                        </Space>
                    </Row>
                </Card>

                <Row gutter={[16, 16]}>
                    <Col md={8}>
                        <Card>
                            <Space direction="vertical" size="small">
                                <Text type="secondary" strong>
                                    Thông tin người nhận
                                </Text>
                                <Space direction="vertical" size={0}>
                                    <Text strong>{order.orderToName}</Text>
                                    <Text>{order.orderToPhone}</Text>
                                    <Text>
                                        {[
                                            order.orderToAddress,
                                            order.orderToWardName,
                                            order.orderToDistrictName,
                                            order.orderToProvinceName,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </Text>
                                </Space>
                            </Space>
                        </Card>
                    </Col>

                    <Col md={8}>
                        <Card>
                            <Space direction="vertical" size="small">
                                <Text type="secondary" strong>
                                    Hình thức giao hàng
                                </Text>
                                <Image
                                    width={170}
                                    src={MiscUtils.ghnLogoPath}
                                    preview={false}
                                />
                            </Space>
                        </Card>
                    </Col>

                    <Col md={8}>
                        <Card>
                            <Space direction="vertical" size="small">
                                <Text type="secondary" strong>
                                    Hình thức thanh toán
                                </Text>
                                <Space>
                                    <PaymentMethodIcon
                                        style={{ color: "#999" }}
                                    />
                                    <Text>
                                        {
                                            PageConfigs.paymentMethodNameMap[
                                                order.orderPaymentMethodType
                                            ]
                                        }
                                    </Text>
                                </Space>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Card>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Text type="secondary" strong>
                            Theo dõi vận đơn
                        </Text>
                        {order.orderWaybill ? (
                            <Row gutter={[16, 16]}>
                                <Col sm={6}>
                                    <Space direction="vertical">
                                        <Space direction="vertical" size={0}>
                                            <Text strong>Mã vận đơn</Text>
                                            <Badge
                                                color="purple"
                                                text={
                                                    order.orderWaybill
                                                        .waybillCode
                                                }
                                            />
                                        </Space>
                                        <Space direction="vertical" size={0}>
                                            <Text strong>
                                                Dự kiến giao hàng
                                            </Text>
                                            <Text>
                                                {DateUtils.isoDateToString(
                                                    order.orderWaybill
                                                        .waybillExpectedDeliveryTime,
                                                    "DD/MM/YYYY",
                                                )}
                                            </Text>
                                        </Space>
                                    </Space>
                                </Col>
                                <Col sm={18}>
                                    <Space
                                        direction="vertical"
                                        style={{ width: "100%" }}
                                    >
                                        <Text strong>Lịch sử vận đơn</Text>
                                        <Space
                                            direction="vertical"
                                            size="small"
                                        >
                                            {[...order.orderWaybill.waybillLogs]
                                                .reverse()
                                                .map((waybillLog) => {
                                                    const waybillLogInfo =
                                                        getWaybillLogInfo(
                                                            waybillLog,
                                                        );
                                                    return (
                                                        <Space
                                                            key={
                                                                waybillLog.waybillLogId
                                                            }
                                                        >
                                                            <Text type="secondary">
                                                                {DateUtils.isoDateToString(
                                                                    waybillLog.waybillLogCreatedAt,
                                                                )}
                                                            </Text>
                                                            <Text>
                                                                {
                                                                    waybillLogInfo.text
                                                                }
                                                            </Text>
                                                        </Space>
                                                    );
                                                })}
                                        </Space>
                                    </Space>
                                </Col>
                            </Row>
                        ) : (
                            <Text>Hiện đơn hàng chưa có vận đơn</Text>
                        )}
                    </Space>
                </Card>

                <Card bodyStyle={{ padding: 0 }}>
                    <div style={{ overflowX: "auto" }}>
                        <Table
                            dataSource={order.orderItems}
                            rowKey={(item) => item.orderItemVariant.variantId}
                            pagination={false}
                        >
                            <Table.Column
                                title={<Text type="secondary">Mặt hàng</Text>}
                                render={(
                                    orderItem: ClientOrderVariantResponse,
                                ) => (
                                    <OrderItemTableRow
                                        orderItem={orderItem}
                                        canReview={
                                            order.orderStatus === 4 &&
                                            order.orderPaymentStatus === 2
                                        }
                                    />
                                )}
                            />
                            <Table.Column
                                title={<Text type="secondary">Đơn giá</Text>}
                                render={(
                                    orderItem: ClientOrderVariantResponse,
                                ) => (
                                    <Text>
                                        {MiscUtils.formatPrice(
                                            orderItem.orderItemPrice,
                                        )}{" "}
                                        ₫
                                    </Text>
                                )}
                            />
                            <Table.Column
                                title={<Text type="secondary">Số lượng</Text>}
                                render={(
                                    orderItem: ClientOrderVariantResponse,
                                ) => <Text>{orderItem.orderItemQuantity}</Text>}
                            />
                            <Table.Column
                                title={<Text type="secondary">Thành tiền</Text>}
                                render={(
                                    orderItem: ClientOrderVariantResponse,
                                ) => (
                                    <Text style={{ color: "blue" }} strong>
                                        {MiscUtils.formatPrice(
                                            orderItem.orderItemAmount,
                                        )}{" "}
                                        ₫
                                    </Text>
                                )}
                            />
                        </Table>
                    </div>
                </Card>

                <Row gutter={[16, 16]}>
                    <Col sm={7} md={8} lg={9}></Col>
                    <Col sm={5} md={4} lg={3}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Row justify="space-between">
                                <Text type="secondary">Tạm tính</Text>
                                <Text>
                                    {MiscUtils.formatPrice(
                                        order.orderTotalAmount,
                                    )}{" "}
                                    ₫
                                </Text>
                            </Row>
                            <Row justify="space-between">
                                <Text type="secondary">Thuế (10%)</Text>
                                <Text>
                                    {MiscUtils.formatPrice(
                                        Number(
                                            (
                                                order.orderTotalAmount *
                                                ApplicationConstants.DEFAULT_TAX
                                            ).toFixed(0),
                                        ),
                                    )}{" "}
                                    ₫
                                </Text>
                            </Row>
                            <Row justify="space-between">
                                <Space>
                                    <Text type="secondary">Phí vận chuyển</Text>
                                    {order.orderStatus === 1 && (
                                        <Tooltip title="Phí vận chuyển có thể chưa được tính và sẽ còn cập nhật">
                                            <InfoCircleOutlined
                                                style={{ color: "#1890ff" }}
                                            />
                                        </Tooltip>
                                    )}
                                </Space>
                                <Text>
                                    {MiscUtils.formatPrice(
                                        order.orderShippingCost,
                                    )}{" "}
                                    ₫
                                </Text>
                            </Row>
                            <Divider style={{ margin: "12px 0" }} />
                            <Row justify="space-between">
                                <Text strong>Tổng tiền</Text>
                                <Text
                                    strong
                                    style={{ color: "blue", fontSize: 16 }}
                                >
                                    {MiscUtils.formatPrice(order.orderTotalPay)}{" "}
                                    ₫
                                </Text>
                            </Row>
                        </Space>
                    </Col>
                </Row>

                <Divider />
                <Button
                    danger
                    onClick={handleCancelOrderButton}
                    disabled={![1, 2].includes(order.orderStatus)}
                >
                    Hủy đơn hàng
                </Button>
            </Space>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Row gutter={[24, 24]}>
                <Col md={3}>
                    <ClientUserNavbar />
                </Col>
                <Col md={9}>
                    <Card>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Title level={2}>Chi tiết đơn hàng</Title>
                            {orderContentFragment}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

// Row content below is adapted similarly, removing mantine logic.
function OrderItemTableRow({
    orderItem,
    canReview,
}: {
    orderItem: ClientOrderVariantResponse;
    canReview: boolean;
}) {
    const handleOpenReviewModalButton = () => {
        Modal.info({
            title: "Đánh giá sản phẩm",
            content: <ReviewProductModal orderItem={orderItem} />,
            okButtonProps: { style: { display: "none" } },
            maskClosable: true,
        });
    };

    return (
        <Space direction="vertical">
            <Space>
                <Image
                    width={65}
                    height={65}
                    src={
                        orderItem.orderItemVariant.variantProduct
                            .productThumbnail || ""
                    }
                    alt={
                        orderItem.orderItemVariant.variantProduct.productName ||
                        ""
                    }
                    preview={false}
                />
                <Space direction="vertical" size={0}>
                    <a
                        href={`/product/${orderItem.orderItemVariant.variantProduct.productSlug}`}
                    >
                        {orderItem.orderItemVariant.variantProduct.productName}
                    </a>
                    {orderItem.orderItemVariant.variantProperties && (
                        <Space direction="vertical" size="small">
                            {orderItem.orderItemVariant.variantProperties.content.map(
                                (prop) => (
                                    <Text
                                        key={prop.id}
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                    >
                                        {prop.name}: {prop.value}
                                    </Text>
                                ),
                            )}
                        </Space>
                    )}
                    {canReview && (
                        <Button
                            size="small"
                            onClick={handleOpenReviewModalButton}
                            disabled={
                                orderItem.orderItemVariant.variantProduct
                                    .productIsReviewed
                            }
                        >
                            Đánh giá
                        </Button>
                    )}
                </Space>
            </Space>
        </Space>
    );
}

const ratingNameMap: Record<number, string> = {
    1: "Rất không hài lòng",
    2: "Không hài lòng",
    3: "Bình thường",
    4: "Hài lòng",
    5: "Cực kỳ hài lòng",
};

function ReviewProductModal({
    orderItem,
}: {
    orderItem: ClientOrderVariantResponse;
}) {
    const { user } = useAuthStore();

    const form = useForm({
        initialValues: { rating: 5, review: "" },
        schema: zodResolver(
            z.object({
                rating: z.number().min(1).max(5),
                review: z
                    .string()
                    .min(3, { message: "Vui lòng nhập ít nhất 3 ký tự" }),
            }),
        ),
    });

    const createReviewApi = useCreateReviewApi();

    const handleFormSubmit = form.onSubmit((values) => {
        if (user) {
            const reviewRequest: ClientReviewRequest = {
                userId: user.id,
                productId: orderItem.orderItemVariant.variantProduct.productId,
                ratingScore: values.rating,
                content: values.review,
                status: 1,
            };
            createReviewApi.mutate(reviewRequest);
            Modal.destroyAll();
        }
    });

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
                <Image
                    width={40}
                    height={40}
                    src={
                        orderItem.orderItemVariant.variantProduct
                            .productThumbnail || ""
                    }
                    alt={orderItem.orderItemVariant.variantProduct.productName}
                    preview={false}
                    style={{ borderRadius: 8 }}
                />
                <Text>
                    {orderItem.orderItemVariant.variantProduct.productName}
                </Text>
            </Space>
            <Title level={5}>Vui lòng đánh giá</Title>
            <Space
                direction="vertical"
                style={{ alignItems: "center", marginBottom: 8 }}
            >
                <Text strong>Vui lòng đánh giá</Text>
                {/* Use Rate from antd if needed */}
                <Space>★ {form.values.rating}</Space>
                <Text type="secondary">
                    {ratingNameMap[form.values.rating]}
                </Text>
            </Space>
            <Space direction="vertical" style={{ width: "100%" }}>
                {/* Use Input.TextArea from antd */}
                <textarea
                    rows={4}
                    placeholder="Hãy chia sẻ cảm nhận, đánh giá của bạn..."
                    value={form.values.review}
                    onChange={(e) =>
                        form.setFieldValue("review", e.target.value)
                    }
                    style={{ width: "100%" }}
                />
            </Space>
            <Space style={{ justifyContent: "flex-end", width: "100%" }}>
                <Button onClick={() => Modal.destroyAll()}>Đóng</Button>
                <Button type="primary" onClick={handleFormSubmit}>
                    Gửi đánh giá
                </Button>
            </Space>
        </Space>
    );
}

function useGetOrderApi(orderCode: string) {
    const {
        data: orderResponse,
        isLoading: isLoadingOrderResponse,
        isError: isErrorOrderResponse,
    } = useQuery<ClientOrderDetailResponse, ErrorMessage>(
        ["client-api", "orders", "getOrder", orderCode],
        () =>
            FetchUtils.getWithToken(ResourceURL.CLIENT_ORDER + "/" + orderCode),
        {
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            keepPreviousData: true,
        },
    );

    return { orderResponse, isLoadingOrderResponse, isErrorOrderResponse };
}

function useCancelOrderApi(orderCode: string) {
    const queryClient = useQueryClient();
    return useMutation<Empty, ErrorMessage, void>(
        () =>
            FetchUtils.putWithToken(
                ResourceURL.CLIENT_ORDER_CANCEL + "/" + orderCode,
                {},
            ),
        {
            onSuccess: () => {
                NotifyUtils.simpleSuccess("Hủy đơn hàng thành công");
                void queryClient.invalidateQueries([
                    "client-api",
                    "orders",
                    "getOrder",
                    orderCode,
                ]);
            },
            onError: () =>
                NotifyUtils.simpleFailed("Hủy đơn hàng không thành công"),
        },
    );
}

function useCreateReviewApi() {
    const queryClient = useQueryClient();
    return useMutation<ClientReviewResponse, ErrorMessage, ClientReviewRequest>(
        (requestBody) =>
            FetchUtils.postWithToken(ResourceURL.CLIENT_REVIEW, requestBody),
        {
            onSuccess: (response) => {
                NotifyUtils.simpleSuccess(
                    <Text>
                        Đã thêm đánh giá cho sản phẩm{" "}
                        <a
                            href={
                                "/product/" + response.reviewProduct.productSlug
                            }
                        >
                            {response.reviewProduct.productName}
                        </a>
                        . Vui lòng đợi duyệt để hiển thị.
                    </Text>,
                );
                void queryClient.invalidateQueries([
                    "client-api",
                    "orders",
                    "getOrder",
                ]);
            },
            onError: () => {
                NotifyUtils.simpleFailed(
                    "Không thêm được đánh giá cho sản phẩm",
                );
            },
        },
    );
}

export default ClientOrderDetail;
