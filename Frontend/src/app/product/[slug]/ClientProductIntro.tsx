import React, { useRef, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Row,
    Col,
    Space,
    Typography,
    Breadcrumb,
    Image,
    InputNumber,
    Flex,
    theme,
} from "antd";
import {
    BellOutlined,
    HeartOutlined,
    LinkOutlined,
    PictureOutlined,
    ShoppingCartOutlined,
    MinusOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import ClientCarousel from "@/components/ClientCarousel";
import {
    ClientProductResponse,
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
import ReviewStarGroup from "@/components/ReviewStarGroup";

const { Text, Title, Link: AntLink } = Typography;
const { useToken } = theme;

interface ClientProductIntroProps {
    product: ClientProductResponse;
}

function ClientProductIntro({ product }: ClientProductIntroProps) {
    const { token } = useToken();
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const quantityInputRef = useRef<any>(null);

    const { user, currentCartId } = useAuthStore();

    const createWishApi = useCreateWishApi();
    const createPreorderApi = useCreatePreorderApi();
    const saveCartApi = useSaveCartApi();

    const handleSelectVariantButton = (variantIndex: number) => {
        setSelectedVariantIndex(variantIndex);
        setQuantity(1);
    };

    const handleCreateWishButton = () => {
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

    const handleCreatePreorderButton = () => {
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

    const handleAddToCartButton = () => {
        if (!user) {
            NotifyUtils.simple("Vui lòng đăng nhập để sử dụng chức năng");
        } else {
            const cartRequest: ClientCartRequest = {
                cartId: currentCartId,
                userId: user.id,
                cartItems: [
                    {
                        variantId:
                            product.productVariants[selectedVariantIndex]
                                .variantId,
                        quantity: quantity,
                    },
                ],
                status: 1,
                updateQuantityType: UpdateQuantityType.INCREMENTAL,
            };
            saveCartApi.mutate(cartRequest, {
                onSuccess: () =>
                    NotifyUtils.simpleSuccess(
                        <Text>
                            Đã thêm mặt hàng vừa chọn vào{" "}
                            <Link href="/cart" passHref legacyBehavior>
                                <AntLink>giỏ hàng</AntLink>
                            </Link>
                        </Text>,
                    ),
            });
        }
    };

    return (
        <Card style={{ borderRadius: token.borderRadiusLG }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/">Trang chủ</Link>,
                        },
                        ...(product.productCategory
                            ? MiscUtils.makeCategoryBreadcrumbs(
                                  product.productCategory,
                              ).map((c) => ({
                                  title: (
                                      <Link
                                          href={`/category/${c.categorySlug}`}
                                      >
                                          {c.categoryName}
                                      </Link>
                                  ),
                              }))
                            : []),
                        {
                            title: product.productName,
                        },
                    ]}
                />

                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        {product.productImages.length > 0 ? (
                            <ClientCarousel>
                                {product.productImages.map((image) => (
                                    <Image
                                        key={image.id}
                                        style={{
                                            borderRadius: token.borderRadiusLG,
                                            aspectRatio: "1 / 1",
                                            objectFit: "cover",
                                        }}
                                        src={image.path}
                                        alt={product.productName}
                                        placeholder={
                                            <div
                                                style={{
                                                    background:
                                                        token.colorFillContent,
                                                    width: "100%",
                                                    height: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PictureOutlined
                                                    style={{
                                                        fontSize: 40,
                                                        opacity: 0.2,
                                                    }}
                                                />
                                            </div>
                                        }
                                    />
                                ))}
                            </ClientCarousel>
                        ) : (
                            <div
                                style={{
                                    borderRadius: token.borderRadiusLG,
                                    width: "100%",
                                    height: "auto",
                                    aspectRatio: "1 / 1",
                                    border: `2px dotted ${token.colorBorderSecondary}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Space direction="vertical" align="center">
                                    <PictureOutlined
                                        style={{ fontSize: 100, opacity: 0.5 }}
                                    />
                                    <Text>Không có hình cho sản phẩm này</Text>
                                </Space>
                            </div>
                        )}
                    </Col>

                    <Col xs={24} md={12}>
                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                        >
                            <Space
                                direction="vertical"
                                size={2}
                                style={{ width: "100%" }}
                            >
                                {!product.productSaleable && (
                                    <Badge
                                        count="Hết hàng"
                                        style={{
                                            backgroundColor: token.colorError,
                                        }}
                                    />
                                )}

                                {product.productBrand && (
                                    <Space size={5}>
                                        <Text type="secondary">
                                            Thương hiệu:
                                        </Text>
                                        <Link
                                            href={`/brand/${product.productBrand.brandId}`}
                                            passHref
                                            legacyBehavior
                                        >
                                            <AntLink>
                                                {product.productBrand.brandName}
                                            </AntLink>
                                        </Link>
                                    </Space>
                                )}

                                <Title
                                    level={3}
                                    style={{ marginTop: 5, marginBottom: 0 }}
                                >
                                    {product.productName}
                                </Title>

                                <Flex gap="large" style={{ marginTop: 10 }}>
                                    <Space>
                                        <ReviewStarGroup
                                            ratingScore={
                                                product.productAverageRatingScore
                                            }
                                        />
                                        <Text type="secondary">
                                            {product.productCountReviews} đánh
                                            giá
                                        </Text>
                                    </Space>
                                </Flex>
                            </Space>

                            {product.productShortDescription && (
                                <Text type="secondary">
                                    {product.productShortDescription}
                                </Text>
                            )}

                            <Card
                                style={{
                                    backgroundColor:
                                        token.colorBgContainerDisabled,
                                    borderRadius: token.borderRadiusLG,
                                }}
                                bodyStyle={{ padding: "16px 20px" }}
                                bordered={false}
                            >
                                <Space size="middle" align="center">
                                    <Text
                                        style={{
                                            fontSize: 24,
                                            fontWeight: 700,
                                            color: token.colorError,
                                        }}
                                    >
                                        {MiscUtils.formatPrice(
                                            MiscUtils.calculateDiscountedPrice(
                                                product.productVariants[
                                                    selectedVariantIndex
                                                ]?.variantPrice,
                                                product.productPromotion
                                                    ? product.productPromotion
                                                          .promotionPercent
                                                    : 0,
                                            ),
                                        )}{" "}
                                        ₫
                                    </Text>

                                    {product.productPromotion && (
                                        <>
                                            <Text
                                                style={{
                                                    textDecoration:
                                                        "line-through",
                                                }}
                                                type="secondary"
                                            >
                                                {MiscUtils.formatPrice(
                                                    product.productVariants[
                                                        selectedVariantIndex
                                                    ]?.variantPrice,
                                                )}{" "}
                                                ₫
                                            </Text>
                                            <Badge
                                                count={`-${product.productPromotion.promotionPercent}%`}
                                                style={{
                                                    backgroundColor:
                                                        token.colorError,
                                                }}
                                            />
                                        </>
                                    )}
                                </Space>
                            </Card>

                            <Space
                                direction="vertical"
                                size="small"
                                style={{ width: "100%" }}
                            >
                                <Text strong>Phiên bản</Text>
                                {product.productVariants.length > 0 ? (
                                    product.productVariants.some(
                                        (variant) => variant.variantProperties,
                                    ) ? (
                                        <Space wrap>
                                            {product.productVariants.map(
                                                (variant, index) => (
                                                    <Button
                                                        key={variant.variantId}
                                                        type={
                                                            index ===
                                                            selectedVariantIndex
                                                                ? "primary"
                                                                : "default"
                                                        }
                                                        style={{
                                                            opacity:
                                                                variant.variantInventory ===
                                                                0
                                                                    ? 0.5
                                                                    : 1,
                                                            borderColor:
                                                                index ===
                                                                selectedVariantIndex
                                                                    ? token.colorPrimary
                                                                    : token.colorBorder,
                                                            background:
                                                                index ===
                                                                selectedVariantIndex
                                                                    ? token.colorPrimaryBg
                                                                    : undefined,
                                                            padding: "8px 16px",
                                                            height: "auto",
                                                        }}
                                                        onClick={() =>
                                                            handleSelectVariantButton(
                                                                index,
                                                            )
                                                        }
                                                        disabled={
                                                            selectedVariantIndex ===
                                                                index ||
                                                            variant.variantInventory ===
                                                                0
                                                        }
                                                    >
                                                        <Space
                                                            direction="vertical"
                                                            size={2}
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            {variant.variantProperties?.content.map(
                                                                (property) => (
                                                                    <Flex
                                                                        key={
                                                                            property.id
                                                                        }
                                                                        justify="space-between"
                                                                        gap={12}
                                                                    >
                                                                        <Text>
                                                                            {
                                                                                property.name
                                                                            }
                                                                            :
                                                                        </Text>
                                                                        <Text
                                                                            strong
                                                                        >
                                                                            {
                                                                                property.value
                                                                            }
                                                                        </Text>
                                                                    </Flex>
                                                                ),
                                                            )}
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                Tồn kho:{" "}
                                                                {
                                                                    variant.variantInventory
                                                                }
                                                            </Text>
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                Giá:{" "}
                                                                {MiscUtils.formatPrice(
                                                                    MiscUtils.calculateDiscountedPrice(
                                                                        variant.variantPrice,
                                                                        product.productPromotion
                                                                            ? product
                                                                                  .productPromotion
                                                                                  .promotionPercent
                                                                            : 0,
                                                                    ),
                                                                )}{" "}
                                                                ₫
                                                            </Text>
                                                        </Space>
                                                    </Button>
                                                ),
                                            )}
                                        </Space>
                                    ) : (
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 14 }}
                                        >
                                            Sản phẩm chỉ có duy nhất một phiên
                                            bản mặc định
                                        </Text>
                                    )
                                ) : (
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 14 }}
                                    >
                                        Không có phiên bản nào
                                    </Text>
                                )}
                            </Space>

                            {product.productSaleable && (
                                <Space
                                    direction="vertical"
                                    size="small"
                                    style={{ width: "100%" }}
                                >
                                    <Text strong>Số lượng</Text>
                                    <Space.Compact>
                                        <Button
                                            icon={<MinusOutlined />}
                                            onClick={() => {
                                                const newVal = Math.max(
                                                    1,
                                                    quantity - 1,
                                                );
                                                setQuantity(newVal);
                                            }}
                                        />
                                        <InputNumber
                                            ref={quantityInputRef}
                                            min={1}
                                            max={
                                                product.productVariants[
                                                    selectedVariantIndex
                                                ].variantInventory
                                            }
                                            value={quantity}
                                            onChange={(value) =>
                                                setQuantity(Number(value) || 1)
                                            }
                                            style={{
                                                width: 60,
                                                textAlign: "center",
                                            }}
                                            controls={false}
                                        />
                                        <Button
                                            icon={<PlusOutlined />}
                                            onClick={() => {
                                                const max =
                                                    product.productVariants[
                                                        selectedVariantIndex
                                                    ].variantInventory;
                                                const newVal = Math.min(
                                                    max,
                                                    quantity + 1,
                                                );
                                                setQuantity(newVal);
                                            }}
                                        />
                                    </Space.Compact>
                                </Space>
                            )}

                            <Space style={{ marginTop: token.marginMD }}>
                                {!product.productSaleable ? (
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{
                                            borderRadius: token.borderRadiusLG,
                                        }}
                                        icon={<BellOutlined />}
                                        onClick={handleCreatePreorderButton}
                                    >
                                        Đặt trước
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        size="large"
                                        danger
                                        style={{
                                            borderRadius: token.borderRadiusLG,
                                        }}
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleAddToCartButton}
                                    >
                                        Chọn mua
                                    </Button>
                                )}
                                <Button
                                    size="large"
                                    danger
                                    style={{
                                        borderRadius: token.borderRadiusLG,
                                    }}
                                    icon={<HeartOutlined />}
                                    onClick={handleCreateWishButton}
                                >
                                    Yêu thích
                                </Button>
                            </Space>
                        </Space>
                    </Col>
                </Row>
            </Space>
        </Card>
    );
}

export default ClientProductIntro;
