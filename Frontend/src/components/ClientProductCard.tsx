"use client";
import React from "react";
import Link from "next/link";
import { Card, Typography, Image, Badge, Space, Button, Tooltip } from "antd";
import {
    BellOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import {
    ClientListedProductResponse,
    ClientWishRequest,
    ClientPreorderRequest,
    ClientCartRequest,
    UpdateQuantityType,
} from "@/datas/ClientUI";
import useCreatePreorderApi from "@/hooks/use-create-preorder-api";
import useCreateWishApi from "@/hooks/use-create-wish-api";
import useSaveCartApi from "@/hooks/use-save-cart-api";
import { useAuthStore } from "@/stores/authStore";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";

const { Text, Title } = Typography;

interface ClientProductCardProps {
    product: ClientListedProductResponse;
    search?: string;
}

function ClientProductCard({ product, search }: ClientProductCardProps) {
    const [hovered, setHovered] = React.useState(false);

    const createWishApi = useCreateWishApi();
    const createPreorderApi = useCreatePreorderApi();
    const saveCartApi = useSaveCartApi();

    const { user, currentCartId } = useAuthStore();

    const handleCreateWishButton = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) {
            NotifyUtils.simple("Vui lòng đăng nhập để sử dụng chức năng");
        } else {
            const clientWishRequest: ClientWishRequest = {
                userId: user.id,
                productId: product.productId,
            };
            createWishApi.mutate(clientWishRequest);
        }
    };

    const handleCreatePreorderButton = (
        event: React.MouseEvent<HTMLElement>,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) {
            NotifyUtils.simple("Vui lòng đăng nhập để sử dụng chức năng");
        } else {
            const clientPreorderRequest: ClientPreorderRequest = {
                userId: user.id,
                productId: product.productId,
                status: 1,
            };
            createPreorderApi.mutate(clientPreorderRequest);
        }
    };

    const handleAddToCartButton = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) {
            NotifyUtils.simple("Vui lòng đăng nhập để sử dụng chức năng");
        } else {
            const cartRequest: ClientCartRequest = {
                cartId: currentCartId,
                userId: user.id,
                cartItems: [
                    {
                        variantId: product.productVariants[0].variantId,
                        quantity: 1,
                    },
                ],
                status: 1,
                updateQuantityType: UpdateQuantityType.INCREMENTAL,
            };
            saveCartApi.mutate(cartRequest, {
                onSuccess: () =>
                    NotifyUtils.simpleSuccess(
                        <>
                            <span>
                                Đã thêm 1 sản phẩm {product.productName} (phiên
                                bản mặc định) vào{" "}
                            </span>
                            <Link href="/cart">giỏ hàng</Link>
                        </>,
                    ),
            });
        }
    };

    // Helper function to highlight search terms
    const highlightText = (text: string) => {
        if (!search) return text;

        const parts = text.split(new RegExp(`(${search})`, "gi"));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === search?.toLowerCase() ? (
                        <mark key={i} className="bg-yellow-200">
                            {part}
                        </mark>
                    ) : (
                        part
                    ),
                )}
            </>
        );
    };

    return (
        <Link href={`/product/${product.productSlug}`} passHref>
            <Card
                hoverable
                className="h-full transition-shadow duration-200 hover:shadow-lg"
                cover={
                    <div className="relative">
                        <Image
                            src={product.productThumbnail || "/placeholder.png"}
                            alt={product.productName}
                            className="aspect-square object-cover"
                            preview={false}
                        />
                        <div
                            className={`absolute bottom-0 left-1/2 flex -translate-x-1/2 space-x-2 transition-opacity duration-200 mb-2 ${
                                hovered ? "opacity-100" : "opacity-0"
                            }`}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <Tooltip title="Thêm vào danh sách yêu thích">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<HeartOutlined />}
                                    onClick={handleCreateWishButton}
                                    style={{ backgroundColor: "#eb2f96" }}
                                />
                            </Tooltip>

                            {product.productSaleable ? (
                                <Tooltip title="Thêm vào giỏ hàng">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleAddToCartButton}
                                    />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Thông báo khi có hàng">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<BellOutlined />}
                                        onClick={handleCreatePreorderButton}
                                        style={{ backgroundColor: "#13c2c2" }}
                                    />
                                </Tooltip>
                            )}
                        </div>
                    </div>
                }
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <Space direction="vertical" size="small" className="w-full">
                    <Space>
                        <Text strong className="line-clamp-2">
                            {highlightText(product.productName)}
                        </Text>
                        {!product.productSaleable && (
                            <Badge color="red" count="Hết hàng" />
                        )}
                    </Space>

                    <Text strong style={{ color: "#eb2f96" }}>
                        {product.productPriceRange
                            .map((price) =>
                                product.productPromotion
                                    ? MiscUtils.calculateDiscountedPrice(
                                          price,
                                          product.productPromotion
                                              .promotionPercent,
                                      )
                                    : price,
                            )
                            .map(MiscUtils.formatPrice)
                            .join("–") + "\u00A0₫"}
                    </Text>

                    {product.productPromotion && (
                        <Space>
                            <Text type="secondary" delete>
                                {product.productPriceRange
                                    .map(MiscUtils.formatPrice)
                                    .join("–") + "\u00A0₫"}
                            </Text>
                            <Badge
                                count={`-${product.productPromotion.promotionPercent}%`}
                                style={{ backgroundColor: "#eb2f96" }}
                            />
                        </Space>
                    )}

                    <Text type="secondary" className="text-sm">
                        {product.productVariants.length} phiên bản
                    </Text>
                </Space>
            </Card>
        </Link>
    );
}

export default ClientProductCard;
