"use client";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Empty as AntEmpty,
    Flex,
    Image,
    InputNumber,
    Modal,
    Radio,
    Row,
    Skeleton,
    Space,
    Spin,
    Table,
    Typography,
    Tooltip,
    theme,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
    AlertTriangle,
    Check,
    Home,
    InfoCircle,
    Marquee,
    ShoppingCart,
    Trash,
    X,
} from "tabler-icons-react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Link from "next/link";

import useAuthStore from "@/stores/authStore";

import ApplicationConstants from "@/constants/ApplicationConstants";
import ResourceURL from "@/constants/ResourceURL";
import {
    ClientCartResponse,
    ClientCartVariantResponse,
    ClientCartRequest,
    UpdateQuantityType,
    ClientSimpleOrderRequest,
    ClientPaymentMethodResponse,
    ClientCartVariantKeyRequest,
    ClientConfirmedOrderResponse,
} from "@/datas/ClientUI";
import { CollectionWrapper } from "@/datas/CollectionWrapper";
import { Empty } from "@/datas/Utility";
import useSaveCartApi from "@/hooks/use-save-cart-api";
import useTitle from "@/hooks/use-title";
import useClientSiteStore from "@/stores/use-client-site-store";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import PageConfigs from "@/utils/PageConfigs";
import { NotificationType } from "../../models/Notification";
import { PaymentMethodType } from "../../models/PaymentMethod";

const { Title, Text, Link: AntLink } = Typography;
const { useToken } = theme;

function ClientCart() {
    useTitle();

    const { token } = useToken();
    const [modal, contextHolder] = Modal.useModal();

    const { user, currentPaymentMethod, updateCurrentPaymentMethod } =
        useAuthStore();

    const { cartResponse, isLoadingCartResponse, isErrorCartResponse } =
        useGetCartApi();
    const {
        paymentMethodResponses,
        isLoadingPaymentMethodResponses,
        isErrorPaymentMethodResponses,
    } = useGetAllPaymentMethodsApi();

    const isLoading = isLoadingCartResponse || isLoadingPaymentMethodResponses;
    const isError = isErrorCartResponse || isErrorPaymentMethodResponses;

    const handleOrderButton = () => {
        const PaymentMethodIcon =
            PageConfigs.paymentMethodIconMap[currentPaymentMethod];

        modal.confirm({
            title: "Thông báo xác nhận đặt mua",
            width: 600,
            content: (
                <Flex vertical gap="small">
                    <Text>
                        Bạn có muốn đặt mua những sản phẩm đã chọn với hình thức
                        thanh toán sau?
                    </Text>
                    <Space align="center" size="small">
                        <PaymentMethodIcon color={token.colorTextSecondary} />
                        <Text>
                            {
                                PageConfigs.paymentMethodNameMap[
                                    currentPaymentMethod
                                ]
                            }
                        </Text>
                    </Space>
                </Flex>
            ),
            cancelText: "Hủy",
            okText: "Xác nhận đặt mua",
            onOk: () => {
                modal.info({
                    title: "Thông báo xác nhận đặt mua",
                    width: 600,
                    icon: null,
                    closable: false,
                    maskClosable: false,
                    footer: null,
                    content: (
                        <ConfirmedOrder closeModal={() => Modal.destroyAll()} />
                    ),
                });
            },
        });
    };

    let cartContentFragment;

    if (isLoading) {
        cartContentFragment = (
            <Flex vertical gap="middle">
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} active paragraph={{ rows: 1 }} />
                    ))}
            </Flex>
        );
    }

    if (isError) {
        cartContentFragment = (
            <Flex
                vertical
                align="center"
                justify="center"
                style={{
                    margin: `${token.marginXL}px 0`,
                    color: token.colorError,
                }}
            >
                <AlertTriangle size={125} strokeWidth={1} />
                <Text style={{ fontSize: token.fontSizeXL, fontWeight: 500 }}>
                    Đã có lỗi xảy ra
                </Text>
            </Flex>
        );
    }

    if (cartResponse && paymentMethodResponses) {
        let cart: ClientCartResponse;

        if (Object.hasOwn(cartResponse, "cartId")) {
            cart = cartResponse as ClientCartResponse;
        } else {
            cart = { cartId: 0, cartItems: [] };
        }

        const totalAmount = cart.cartItems
            .map(
                (cartItem) =>
                    cartItem.cartItemQuantity *
                    MiscUtils.calculateDiscountedPrice(
                        cartItem.cartItemVariant.variantPrice,
                        cartItem.cartItemVariant.variantProduct.productPromotion
                            ? cartItem.cartItemVariant.variantProduct
                                  .productPromotion.promotionPercent
                            : 0,
                    ),
            )
            .reduce((partialSum, a) => partialSum + a, 0);

        const taxCost = Number(
            (totalAmount * ApplicationConstants.DEFAULT_TAX).toFixed(0),
        );

        const shippingCost = ApplicationConstants.DEFAULT_SHIPPING_COST;

        const totalPay = totalAmount + taxCost + shippingCost;

        cartContentFragment = (
            <Row gutter={24}>
                <Col md={18} xs={24}>
                    <Card
                        variant="outlined"
                        style={{ borderRadius: token.borderRadiusLG }}
                    >
                        <div style={{ overflowX: "auto" }}>
                            <Table
                                dataSource={cart.cartItems}
                                rowKey={(record) =>
                                    record.cartItemVariant.variantId
                                }
                                pagination={false}
                                locale={{
                                    emptyText: (
                                        <Flex
                                            vertical
                                            align="center"
                                            justify="center"
                                            style={{
                                                margin: `${token.marginXL}px 0`,
                                                color: token.colorPrimary,
                                            }}
                                        >
                                            <Marquee
                                                size={125}
                                                strokeWidth={1}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: token.fontSizeXL,
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Chưa thêm mặt hàng nào
                                            </Text>
                                        </Flex>
                                    ),
                                }}
                                columns={[
                                    {
                                        title: (
                                            <Text type="secondary">
                                                Mặt hàng
                                            </Text>
                                        ),
                                        key: "item",
                                        width: 325,
                                        render: (_, cartItem) => (
                                            <Space>
                                                <Image
                                                    width={65}
                                                    height={65}
                                                    src={
                                                        cartItem.cartItemVariant
                                                            .variantProduct
                                                            .productThumbnail ||
                                                        undefined
                                                    }
                                                    alt={
                                                        cartItem.cartItemVariant
                                                            .variantProduct
                                                            .productName
                                                    }
                                                    style={{
                                                        borderRadius:
                                                            token.borderRadiusLG,
                                                    }}
                                                    preview={false}
                                                />
                                                <Flex vertical>
                                                    <AntLink>
                                                        <Link
                                                            href={
                                                                "/product/" +
                                                                cartItem
                                                                    .cartItemVariant
                                                                    .variantProduct
                                                                    .productSlug
                                                            }
                                                        >
                                                            {
                                                                cartItem
                                                                    .cartItemVariant
                                                                    .variantProduct
                                                                    .productName
                                                            }
                                                        </Link>
                                                    </AntLink>
                                                    {cartItem.cartItemVariant
                                                        .variantProperties && (
                                                        <Flex vertical>
                                                            {cartItem.cartItemVariant.variantProperties.content.map(
                                                                (
                                                                    variantProperty,
                                                                ) => (
                                                                    <Text
                                                                        key={
                                                                            variantProperty.id
                                                                        }
                                                                        type="secondary"
                                                                        style={{
                                                                            fontSize:
                                                                                token.fontSizeSM,
                                                                        }}
                                                                    >
                                                                        {
                                                                            variantProperty.name
                                                                        }
                                                                        :{" "}
                                                                        {
                                                                            variantProperty.value
                                                                        }
                                                                    </Text>
                                                                ),
                                                            )}
                                                        </Flex>
                                                    )}
                                                </Flex>
                                            </Space>
                                        ),
                                    },
                                    {
                                        title: (
                                            <Text type="secondary">
                                                Đơn giá
                                            </Text>
                                        ),
                                        key: "price",
                                        width: 125,
                                        render: (_, cartItem) => (
                                            <Flex vertical>
                                                <Text strong>
                                                    {MiscUtils.formatPrice(
                                                        MiscUtils.calculateDiscountedPrice(
                                                            cartItem
                                                                .cartItemVariant
                                                                .variantPrice,
                                                            cartItem
                                                                .cartItemVariant
                                                                .variantProduct
                                                                .productPromotion
                                                                ? cartItem
                                                                      .cartItemVariant
                                                                      .variantProduct
                                                                      .productPromotion
                                                                      .promotionPercent
                                                                : 0,
                                                        ),
                                                    )}{" "}
                                                    ₫
                                                </Text>
                                                {cartItem.cartItemVariant
                                                    .variantProduct
                                                    .productPromotion && (
                                                    <Space size="small">
                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                fontSize:
                                                                    token.fontSizeSM,
                                                                textDecoration:
                                                                    "line-through",
                                                            }}
                                                        >
                                                            {MiscUtils.formatPrice(
                                                                cartItem
                                                                    .cartItemVariant
                                                                    .variantPrice,
                                                            )}{" "}
                                                            ₫
                                                        </Text>
                                                        <Badge
                                                            count={`-${cartItem.cartItemVariant.variantProduct.productPromotion.promotionPercent}%`}
                                                            color="pink"
                                                        />
                                                    </Space>
                                                )}
                                            </Flex>
                                        ),
                                    },
                                    {
                                        title: (
                                            <Text type="secondary">
                                                Số lượng
                                            </Text>
                                        ),
                                        key: "quantity",
                                        width: 150,
                                        render: (_, cartItem) => (
                                            <CartItemQuantity
                                                cartItem={cartItem}
                                            />
                                        ),
                                    },
                                    {
                                        title: (
                                            <Text type="secondary">
                                                Thành tiền
                                            </Text>
                                        ),
                                        key: "total",
                                        width: 125,
                                        render: (_, cartItem) => (
                                            <Text
                                                strong
                                                style={{
                                                    color: token.colorPrimary,
                                                }}
                                            >
                                                {MiscUtils.formatPrice(
                                                    cartItem.cartItemQuantity *
                                                        MiscUtils.calculateDiscountedPrice(
                                                            cartItem
                                                                .cartItemVariant
                                                                .variantPrice,
                                                            cartItem
                                                                .cartItemVariant
                                                                .variantProduct
                                                                .productPromotion
                                                                ? cartItem
                                                                      .cartItemVariant
                                                                      .variantProduct
                                                                      .productPromotion
                                                                      .promotionPercent
                                                                : 0,
                                                        ),
                                                ) + " ₫"}
                                            </Text>
                                        ),
                                    },
                                    {
                                        title: (
                                            <Text type="secondary">
                                                Thao tác
                                            </Text>
                                        ),
                                        key: "actions",
                                        width: 80,
                                        render: (_, cartItem) => (
                                            <Button
                                                type="primary"
                                                danger
                                                shape="circle"
                                                icon={<Trash size={16} />}
                                                onClick={() =>
                                                    handleDeleteCartItem(
                                                        cartItem,
                                                    )
                                                }
                                                size="small"
                                                style={{ margin: "auto" }}
                                            />
                                        ),
                                        align: "center",
                                    },
                                ]}
                            />
                        </div>
                    </Card>
                </Col>

                <Col md={6} xs={24}>
                    <Flex vertical gap="middle">
                        <Card
                            variant="outlined"
                            style={{ borderRadius: token.borderRadiusLG }}
                        >
                            <Flex vertical gap="small">
                                <Flex justify="space-between" align="center">
                                    <Text strong type="secondary">
                                        Giao tới
                                    </Text>
                                    <Button type="link" size="small">
                                        <Link href="/user/setting/personal">
                                            Thay đổi
                                        </Link>
                                    </Button>
                                </Flex>
                                <Flex vertical>
                                    <Flex align="center">
                                        <Text
                                            strong
                                            style={{
                                                fontSize: token.fontSizeSM,
                                            }}
                                        >
                                            {user?.fullname}
                                        </Text>
                                        <Tooltip title="Địa chỉ của người dùng đặt mua">
                                            <Avatar
                                                size="small"
                                                style={{
                                                    backgroundColor:
                                                        token.colorSuccess,
                                                    marginLeft: token.marginXS,
                                                }}
                                                icon={<Home size={12} />}
                                            />
                                        </Tooltip>
                                    </Flex>
                                    <Text
                                        strong
                                        style={{ fontSize: token.fontSizeSM }}
                                    >
                                        {user?.phone}
                                    </Text>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: token.fontSizeSM }}
                                    >
                                        {[
                                            user?.address.line,
                                            user?.address.ward?.name,
                                            user?.address.district?.name,
                                            user?.address.province?.name,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card>

                        <Card
                            variant="outlined"
                            style={{ borderRadius: token.borderRadiusLG }}
                        >
                            <Flex vertical gap="small">
                                <Text strong type="secondary">
                                    Hình thức giao hàng
                                </Text>
                                <Radio.Group value="ghn">
                                    <Radio value="ghn">
                                        <Image
                                            src={MiscUtils.ghnLogoPath}
                                            preview={false}
                                            style={{ maxWidth: 170 }}
                                        />
                                    </Radio>
                                </Radio.Group>
                            </Flex>
                        </Card>

                        <Card
                            variant="outlined"
                            style={{ borderRadius: token.borderRadiusLG }}
                        >
                            <Flex vertical gap="small">
                                <Text strong type="secondary">
                                    Hình thức thanh toán
                                </Text>
                                <Radio.Group
                                    value={currentPaymentMethod}
                                    onChange={(e) =>
                                        updateCurrentPaymentMethod(
                                            e.target.value,
                                        )
                                    }
                                >
                                    <Flex vertical>
                                        {paymentMethodResponses.content.map(
                                            (paymentMethod) => {
                                                const PaymentMethodIcon =
                                                    PageConfigs
                                                        .paymentMethodIconMap[
                                                        paymentMethod
                                                            .paymentMethodCode
                                                    ];

                                                return (
                                                    <Radio
                                                        key={
                                                            paymentMethod.paymentMethodId
                                                        }
                                                        value={
                                                            paymentMethod.paymentMethodCode
                                                        }
                                                    >
                                                        <Space size="small">
                                                            <PaymentMethodIcon
                                                                size={24}
                                                            />
                                                            <Text
                                                                style={{
                                                                    fontSize:
                                                                        token.fontSizeSM,
                                                                }}
                                                            >
                                                                {
                                                                    paymentMethod.paymentMethodName
                                                                }
                                                            </Text>
                                                        </Space>
                                                    </Radio>
                                                );
                                            },
                                        )}
                                    </Flex>
                                </Radio.Group>
                            </Flex>
                        </Card>

                        <Card
                            variant="outlined"
                            style={{ borderRadius: token.borderRadiusLG }}
                        >
                            <Flex vertical gap="small">
                                <Flex justify="space-between">
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: token.fontSizeSM }}
                                    >
                                        Tạm tính
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: token.fontSizeSM,
                                            textAlign: "right",
                                        }}
                                    >
                                        {MiscUtils.formatPrice(totalAmount) +
                                            "\u00A0₫"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: token.fontSizeSM }}
                                    >
                                        Thuế (10%)
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: token.fontSizeSM,
                                            textAlign: "right",
                                        }}
                                    >
                                        {MiscUtils.formatPrice(taxCost) +
                                            "\u00A0₫"}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between" align="center">
                                    <Space size="small">
                                        <Text strong>Tổng tiền</Text>
                                        <Tooltip title="Chưa tính phí vận chuyển">
                                            <Avatar
                                                size="small"
                                                style={{
                                                    backgroundColor:
                                                        token.colorPrimary,
                                                }}
                                                icon={<InfoCircle size={14} />}
                                            />
                                        </Tooltip>
                                    </Space>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: token.fontSizeLG,
                                            color: token.colorPrimary,
                                            textAlign: "right",
                                        }}
                                    >
                                        {MiscUtils.formatPrice(totalPay) +
                                            "\u00A0₫"}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card>

                        <Button
                            size="large"
                            type="primary"
                            icon={<ShoppingCart />}
                            onClick={handleOrderButton}
                            disabled={cart.cartItems.length === 0}
                            block
                        >
                            Đặt mua
                        </Button>
                    </Flex>
                </Col>
            </Row>
        );
    }

    return (
        <main>
            {contextHolder}
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: `0 ${token.paddingLG}px`,
                }}
            >
                <Flex vertical gap="large">
                    <Space>
                        <ShoppingCart />
                        <Title level={2}>Giỏ hàng</Title>
                    </Space>

                    {cartContentFragment}
                </Flex>
            </div>
        </main>
    );
}

function CartItemQuantity({
    cartItem,
}: {
    cartItem: ClientCartVariantResponse;
}) {
    const { currentCartId, user } = useAuthStore();
    const saveCartApi = useSaveCartApi();
    const { token } = useToken();

    const handleCartItemQuantityInput = (cartItemQuantity: number | null) => {
        if (
            user &&
            cartItemQuantity !== cartItem.cartItemQuantity &&
            cartItemQuantity &&
            cartItemQuantity <= cartItem.cartItemVariant.variantInventory
        ) {
            const cartRequest: ClientCartRequest = {
                cartId: currentCartId,
                userId: user.id,
                cartItems: [
                    {
                        variantId: cartItem.cartItemVariant.variantId,
                        quantity: cartItemQuantity,
                    },
                ],
                status: 1,
                updateQuantityType: UpdateQuantityType.OVERRIDE,
            };
            saveCartApi.mutate(cartRequest);
        }
    };

    return (
        <Flex vertical>
            <Space size="small">
                <Button
                    size="small"
                    onClick={() =>
                        handleCartItemQuantityInput(
                            cartItem.cartItemQuantity - 1,
                        )
                    }
                    disabled={cartItem.cartItemQuantity <= 1}
                >
                    –
                </Button>
                <InputNumber
                    size="small"
                    min={1}
                    max={cartItem.cartItemVariant.variantInventory}
                    value={cartItem.cartItemQuantity}
                    onChange={handleCartItemQuantityInput}
                    style={{ width: 45, textAlign: "center" }}
                    controls={false}
                />
                <Button
                    size="small"
                    onClick={() =>
                        handleCartItemQuantityInput(
                            cartItem.cartItemQuantity + 1,
                        )
                    }
                    disabled={
                        cartItem.cartItemQuantity >=
                        cartItem.cartItemVariant.variantInventory
                    }
                >
                    +
                </Button>
            </Space>
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                Tồn kho: {cartItem.cartItemVariant.variantInventory}
            </Text>
        </Flex>
    );
}

function handleDeleteCartItem(cartItem: ClientCartVariantResponse) {
    const deleteCartItemsApi = useDeleteCartItemsApi();
    const { currentCartId } = useAuthStore();

    Modal.confirm({
        title: "Xóa mặt hàng",
        content: "Bạn có muốn xóa mặt hàng này?",
        okText: "Xóa",
        okButtonProps: { danger: true },
        cancelText: "Không xóa",
        onOk: () =>
            deleteCartItemsApi.mutate([
                {
                    cartId: currentCartId as number,
                    variantId: cartItem.cartItemVariant.variantId,
                },
            ]),
    });
}

function ConfirmedOrder({ closeModal }: { closeModal: () => void }) {
    const { token } = useToken();

    const {
        mutate: createClientOrder,
        data: clientConfirmedOrderResponse,
        isLoading,
        isError,
    } = useCreateClientOrderApi();

    const [checkoutPaypalStatus, setCheckoutPaypalStatus] = useState<
        "none" | "success" | "cancel"
    >("none");

    const { currentPaymentMethod } = useAuthStore();

    let contentFragment;

    useEffect(() => {
        if (checkoutPaypalStatus === "none") {
            const request: ClientSimpleOrderRequest = {
                paymentMethodType: currentPaymentMethod,
            };
            createClientOrder(request);
        }
    }, [checkoutPaypalStatus, createClientOrder, currentPaymentMethod]);

    const { newNotifications } = useClientSiteStore();

    useEffect(() => {
        if (newNotifications.length > 0 && clientConfirmedOrderResponse) {
            const lastNotification =
                newNotifications[newNotifications.length - 1];
            if (
                lastNotification.message.includes(
                    clientConfirmedOrderResponse.orderCode,
                )
            ) {
                if (
                    lastNotification.type ===
                    NotificationType.CHECKOUT_PAYPAL_SUCCESS
                ) {
                    setCheckoutPaypalStatus("success");
                }
                if (
                    lastNotification.type ===
                    NotificationType.CHECKOUT_PAYPAL_CANCEL
                ) {
                    setCheckoutPaypalStatus("cancel");
                }
            }
        }
    }, [
        clientConfirmedOrderResponse,
        newNotifications,
        newNotifications.length,
    ]);

    const handlePaypalCheckoutButton = (checkoutLink: string) => {
        if (checkoutLink) {
            window.open(checkoutLink, "mywin", "width=500,height=800");
        }
    };

    if (isError) {
        contentFragment = (
            <Flex
                vertical
                align="center"
                justify="space-between"
                style={{ minHeight: 200 }}
            >
                <Flex
                    vertical
                    align="center"
                    style={{ color: token.colorError }}
                >
                    <AlertTriangle size={100} strokeWidth={1} />
                    <Text strong>Đã có lỗi xảy ra</Text>
                </Flex>
                <Button
                    style={{ marginTop: token.marginMD }}
                    onClick={closeModal}
                    block
                >
                    Đóng
                </Button>
            </Flex>
        );
    }

    if (
        clientConfirmedOrderResponse &&
        clientConfirmedOrderResponse.orderPaymentMethodType ===
            PaymentMethodType.CASH
    ) {
        contentFragment = (
            <Flex
                vertical
                align="center"
                justify="space-between"
                style={{ minHeight: 200 }}
            >
                <Flex
                    vertical
                    align="center"
                    style={{ color: token.colorSuccess }}
                >
                    <Check size={100} strokeWidth={1} />
                    <Text>
                        <span>Đơn hàng </span>
                        <Link
                            href={`/order/detail/${clientConfirmedOrderResponse.orderCode}`}
                        >
                            <AntLink strong>
                                {clientConfirmedOrderResponse.orderCode}
                            </AntLink>
                        </Link>
                        <span> đã được tạo!</span>
                    </Text>
                </Flex>
                <Button
                    onClick={closeModal}
                    style={{ marginTop: token.marginMD }}
                    block
                >
                    Đóng
                </Button>
            </Flex>
        );
    }

    if (
        clientConfirmedOrderResponse &&
        clientConfirmedOrderResponse.orderPaymentMethodType ===
            PaymentMethodType.PAYPAL
    ) {
        contentFragment = (
            <Flex
                vertical
                align="center"
                justify="space-between"
                style={{ minHeight: 200 }}
            >
                <Flex
                    vertical
                    align="center"
                    style={{ color: token.colorSuccess }}
                >
                    <Check size={100} strokeWidth={1} />
                    <Text style={{ textAlign: "center" }}>
                        <span>Đơn hàng </span>
                        <Text strong>
                            {clientConfirmedOrderResponse.orderCode}
                        </Text>
                        <span> đã được tạo!</span>
                    </Text>
                    <Text
                        type="secondary"
                        style={{ fontSize: token.fontSizeSM }}
                    >
                        Hoàn tất thanh toán PayPal bằng cách bấm nút dưới
                    </Text>
                </Flex>
                {checkoutPaypalStatus === "none" ? (
                    <Button
                        type="primary"
                        block
                        style={{ marginTop: token.marginMD }}
                        onClick={() =>
                            handlePaypalCheckoutButton(
                                clientConfirmedOrderResponse.orderPaypalCheckoutLink ||
                                    "",
                            )
                        }
                    >
                        Thanh toán PayPal
                    </Button>
                ) : checkoutPaypalStatus === "success" ? (
                    <Button
                        type="primary"
                        block
                        icon={<Check />}
                        style={{ marginTop: token.marginMD }}
                        onClick={closeModal}
                    >
                        Đã thanh toán thành công
                    </Button>
                ) : (
                    <Flex vertical gap="small" style={{ width: "100%" }}>
                        <Button
                            danger
                            block
                            style={{ marginTop: token.marginMD }}
                            icon={<X size={16} />}
                            onClick={closeModal}
                        >
                            Đã hủy thanh toán. Đóng hộp thoại này.
                        </Button>
                        <Button
                            type="primary"
                            block
                            onClick={() =>
                                handlePaypalCheckoutButton(
                                    clientConfirmedOrderResponse.orderPaypalCheckoutLink ||
                                        "",
                                )
                            }
                        >
                            Thanh toán PayPal lần nữa
                        </Button>
                    </Flex>
                )}
            </Flex>
        );
    }

    return (
        <div
            style={{
                position: "relative",
                minHeight: isLoading ? 200 : "auto",
            }}
        >
            {isLoading && <Spin />}
            {contentFragment}
        </div>
    );
}

function useGetCartApi() {
    const {
        data: cartResponse,
        isLoading: isLoadingCartResponse,
        isError: isErrorCartResponse,
    } = useQuery<ClientCartResponse | Empty, ErrorMessage>(
        ["client-api", "carts", "getCart"],
        () => FetchUtils.getWithToken(ResourceURL.CLIENT_CART),
        {
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            keepPreviousData: true,
        },
    );

    return { cartResponse, isLoadingCartResponse, isErrorCartResponse };
}

function useGetAllPaymentMethodsApi() {
    const {
        data: paymentMethodResponses,
        isLoading: isLoadingPaymentMethodResponses,
        isError: isErrorPaymentMethodResponses,
    } = useQuery<CollectionWrapper<ClientPaymentMethodResponse>, ErrorMessage>(
        ["client-api", "payment-methods", "getAllPaymentMethods"],
        () => FetchUtils.get(ResourceURL.CLIENT_PAYMENT_METHOD),
        {
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        },
    );

    return {
        paymentMethodResponses,
        isLoadingPaymentMethodResponses,
        isErrorPaymentMethodResponses,
    };
}

function useDeleteCartItemsApi() {
    const queryClient = useQueryClient();

    const { currentTotalCartItems, updateCurrentTotalCartItems } =
        useAuthStore();

    return useMutation<void, ErrorMessage, ClientCartVariantKeyRequest[]>(
        (requestBody) =>
            FetchUtils.deleteWithToken(ResourceURL.CLIENT_CART, requestBody),
        {
            onSuccess: (_, requestBody) => {
                void queryClient.invalidateQueries([
                    "client-api",
                    "carts",
                    "getCart",
                ]);
                updateCurrentTotalCartItems(
                    currentTotalCartItems - requestBody.length,
                );
            },
            onError: () =>
                NotifyUtils.simpleFailed(
                    "Không xóa được mặt hàng khỏi giỏ hàng",
                ),
        },
    );
}

function useCreateClientOrderApi() {
    const queryClient = useQueryClient();

    const { updateCurrentCartId, updateCurrentTotalCartItems } = useAuthStore();

    return useMutation<
        ClientConfirmedOrderResponse,
        ErrorMessage,
        ClientSimpleOrderRequest
    >(
        (requestBody) =>
            FetchUtils.postWithToken(ResourceURL.CLIENT_ORDER, requestBody),
        {
            onSuccess: () => {
                void queryClient.invalidateQueries([
                    "client-api",
                    "carts",
                    "getCart",
                ]);
                updateCurrentCartId(null);
                updateCurrentTotalCartItems(0);
            },
        },
    );
}

export default ClientCart;
