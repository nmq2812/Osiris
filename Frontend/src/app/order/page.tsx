"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Flex,
    Image,
    Pagination,
    Row,
    Skeleton,
    Space,
    Typography,
    theme,
} from "antd";
import {
    ExclamationCircleOutlined,
    OrderedListOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import ApplicationConstants from "@/constants/ApplicationConstants";
import FetchUtils, { ErrorMessage, ListResponse } from "@/utils/FetchUtils";

import ResourceURL from "@/constants/ResourceURL";
import NotifyUtils from "@/utils/NotifyUtils";
import useTitle from "@/hooks/use-title";
import DateUtils from "@/utils/DateUtils";
import MiscUtils from "@/utils/MiscUtils";
import { ClientSimpleOrderResponse } from "@/datas/ClientUI";

const { Title, Text, Link: AntLink } = Typography;
const { useToken } = theme;

function ClientOrder() {
    useTitle("Đơn hàng của tôi");
    const { token } = useToken();
    const [activePage, setActivePage] = useState(1);

    const { orderResponses, isLoadingOrderResponses, isErrorOrderResponses } =
        useGetAllOrdersApi(activePage);
    const orders = orderResponses as ListResponse<ClientSimpleOrderResponse>;

    let ordersContentFragment;

    if (isLoadingOrderResponses) {
        ordersContentFragment = (
            <Space direction="vertical" style={{ width: "100%" }}>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} active paragraph={{ rows: 1 }} />
                    ))}
            </Space>
        );
    } else if (isErrorOrderResponses) {
        ordersContentFragment = (
            <Flex
                vertical
                align="center"
                style={{
                    margin: `${token.marginXL}px 0`,
                    color: token.colorError,
                }}
            >
                <ExclamationCircleOutlined style={{ fontSize: 80 }} />
                <Text style={{ fontSize: 18, fontWeight: 500, marginTop: 16 }}>
                    Đã có lỗi xảy ra
                </Text>
            </Flex>
        );
    } else if (orders && orders.totalElements === 0) {
        ordersContentFragment = (
            <Flex
                vertical
                align="center"
                style={{
                    margin: `${token.marginXL}px 0`,
                    color: token.colorPrimary,
                }}
            >
                <OrderedListOutlined style={{ fontSize: 80 }} />
                <Text style={{ fontSize: 18, fontWeight: 500, marginTop: 16 }}>
                    Chưa có đơn hàng nào
                </Text>
            </Flex>
        );
    } else if (orders && orders.totalElements > 0) {
        ordersContentFragment = (
            <>
                <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                >
                    {orders.content.map((order) => (
                        <ClientOrderCard key={order.orderId} order={order} />
                    ))}
                </Space>

                <Flex
                    justify="space-between"
                    align="center"
                    style={{ marginTop: 24 }}
                >
                    <Pagination
                        current={activePage}
                        total={orders.totalElements}
                        pageSize={
                            ApplicationConstants.DEFAULT_CLIENT_ORDER_PAGE_SIZE
                        }
                        onChange={(page) =>
                            page !== activePage && setActivePage(page)
                        }
                        showSizeChanger={false}
                    />
                    <Text>
                        <Text strong>Trang {activePage}</Text>
                        <span> / {orders.totalPages}</span>
                    </Text>
                </Flex>
            </>
        );
    }

    return (
        <main>
            <div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <ClientUserNavbar />
                    </Col>

                    <Col xs={24} md={18}>
                        <Card
                            bordered={false}
                            style={{ borderRadius: token.borderRadiusLG }}
                        >
                            <Space
                                direction="vertical"
                                size="large"
                                style={{ width: "100%" }}
                            >
                                <Title level={2}>Đơn hàng của tôi</Title>
                                {ordersContentFragment}
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </main>
    );
}

function ClientOrderCard({ order }: { order: ClientSimpleOrderResponse }) {
    const { token } = useToken();

    const orderStatusBadgeFragment = (status: number) => {
        switch (status) {
            case 1:
                return <Badge color="default" text="Đơn hàng mới" />;
            case 2:
                return <Badge color="processing" text="Đang xử lý" />;
            case 3:
                return <Badge color="purple" text="Đang giao hàng" />;
            case 4:
                return <Badge color="success" text="Đã giao hàng" />;
            case 5:
                return <Badge color="error" text="Hủy bỏ" />;
            default:
                return null;
        }
    };

    const orderPaymentStatusBadgeFragment = (paymentStatus: number) => {
        switch (paymentStatus) {
            case 1:
                return <Badge color="default" text="Chưa thanh toán" />;
            case 2:
                return <Badge color="success" text="Đã thanh toán" />;
            default:
                return null;
        }
    };

    return (
        <Card
            style={{
                borderRadius: token.borderRadiusLG,
                backgroundColor: token.colorBgContainerDisabled,
            }}
            bodyStyle={{ padding: 16 }}
        >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Flex justify="space-between" align="center" wrap="wrap">
                    <Space>
                        <Text strong>Mã đơn hàng: {order.orderCode}</Text>
                        <Text type="secondary">
                            Ngày tạo:{" "}
                            {DateUtils.isoDateToString(
                                order.orderCreatedAt,
                                "DD/MM/YYYY",
                            )}
                        </Text>
                    </Space>
                    <Space size="small">
                        {orderStatusBadgeFragment(order.orderStatus)}
                        {orderPaymentStatusBadgeFragment(
                            order.orderPaymentStatus,
                        )}
                    </Space>
                </Flex>

                <Divider style={{ margin: "12px 0" }} />

                <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                >
                    {order.orderItems.map((orderItem) => (
                        <Flex
                            key={orderItem.orderItemVariant.variantId}
                            justify="space-between"
                            align="center"
                            wrap="wrap"
                            gap={16}
                        >
                            <Flex align="center" gap={12}>
                                <Image
                                    style={{ borderRadius: token.borderRadius }}
                                    width={55}
                                    height={55}
                                    src={
                                        orderItem.orderItemVariant
                                            .variantProduct.productThumbnail ||
                                        undefined
                                    }
                                    alt={
                                        orderItem.orderItemVariant
                                            .variantProduct.productName
                                    }
                                    preview={false}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz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CjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                />
                                <Space direction="vertical" size={4}>
                                    <Link
                                        href={
                                            "/product/" +
                                            orderItem.orderItemVariant
                                                .variantProduct.productSlug
                                        }
                                        passHref
                                        legacyBehavior
                                    >
                                        <AntLink
                                            strong
                                            style={{ fontSize: 14 }}
                                        >
                                            {
                                                orderItem.orderItemVariant
                                                    .variantProduct.productName
                                            }
                                        </AntLink>
                                    </Link>
                                    {orderItem.orderItemVariant
                                        .variantProperties && (
                                        <Space direction="vertical" size={2}>
                                            {orderItem.orderItemVariant.variantProperties.content.map(
                                                (variantProperty) => (
                                                    <Text
                                                        key={variantProperty.id}
                                                        type="secondary"
                                                        style={{ fontSize: 12 }}
                                                    >
                                                        {variantProperty.name}:{" "}
                                                        {variantProperty.value}
                                                    </Text>
                                                ),
                                            )}
                                        </Space>
                                    )}
                                </Space>
                            </Flex>

                            <Space size="small">
                                <Text>
                                    {MiscUtils.formatPrice(
                                        orderItem.orderItemPrice,
                                    ) + "\u00A0₫"}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: token.colorPrimary,
                                        fontFamily: "monospace",
                                    }}
                                >
                                    ×{orderItem.orderItemQuantity}
                                </Text>
                            </Space>
                        </Flex>
                    ))}
                </Space>

                <Divider style={{ margin: "12px 0" }} />

                <Flex justify="space-between" align="center" wrap="wrap">
                    <Link href={`/order/detail/${order.orderCode}`} passHref>
                        <Button shape="round">Xem chi tiết</Button>
                    </Link>
                    <Space size={5}>
                        <Text>Tổng tiền: </Text>
                        <Text strong style={{ fontSize: 18 }}>
                            {MiscUtils.formatPrice(order.orderTotalPay) +
                                "\u00A0₫"}
                        </Text>
                    </Space>
                </Flex>
            </Space>
        </Card>
    );
}

function useGetAllOrdersApi(activePage: number) {
    const requestParams = {
        page: activePage,
        size: ApplicationConstants.DEFAULT_CLIENT_ORDER_PAGE_SIZE,
    };

    const {
        data: orderResponses,
        isLoading: isLoadingOrderResponses,
        isError: isErrorOrderResponses,
    } = useQuery<ListResponse<ClientSimpleOrderResponse>, ErrorMessage>({
        queryKey: ["client-api", "orders", "getAllOrders", requestParams],
        queryFn: () =>
            FetchUtils.getWithToken(ResourceURL.CLIENT_ORDER, requestParams),
        placeholderData: (previousData) => previousData,

        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isErrorOrderResponses) {
            NotifyUtils.simpleFailed("Lấy dữ liệu không thành công");
        }
    }, [isErrorOrderResponses]);

    return { orderResponses, isLoadingOrderResponses, isErrorOrderResponses };
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
        },
    },
});

export default function OrderPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense
                fallback={
                    <div
                        className="container mx-auto px-4"
                        style={{ maxWidth: 1200 }}
                    >
                        <Space direction="vertical" style={{ width: "100%" }}>
                            {Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        active
                                        paragraph={{ rows: 3 }}
                                    />
                                ))}
                        </Space>
                    </div>
                }
            >
                <ClientOrder />
            </Suspense>
        </QueryClientProvider>
    );
}
