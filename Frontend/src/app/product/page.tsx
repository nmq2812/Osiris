"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Layout,
    Card,
    Row,
    Col,
    Input,
    Select,
    Slider,
    Button,
    Space,
    Checkbox,
    Typography,
    Pagination,
    Spin,
    Empty,
    Tag,
    Breadcrumb,
} from "antd";
import {
    FilterOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
    SortAscendingOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import FetchUtils, { ErrorMessage, ListResponse } from "@/utils/FetchUtils";
import ResourceURL from "@/constants/ResourceURL";
import {
    ClientCategoryResponse,
    ClientListedProductResponse,
} from "@/datas/ClientUI";
import MiscUtils from "@/utils/MiscUtils";
import { CollectionWrapper } from "@/datas/CollectionWrapper";

const { Title, Text } = Typography;
const { Content, Sider } = Layout;
const { Option } = Select;

// Main component that doesn't use useSearchParams
const ProductListPage: React.FC = () => {
    return (
        <Layout style={{ background: "#fff", minHeight: "100vh" }}>
            <Breadcrumb style={{ margin: "16px 24px" }}>
                <Breadcrumb.Item>
                    <Link href="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
            </Breadcrumb>

            <Layout style={{ padding: "0 24px" }}>
                <Suspense
                    fallback={
                        <div style={{ textAlign: "center", padding: 40 }}>
                            <Spin size="large" />
                        </div>
                    }
                >
                    <ProductContent />
                </Suspense>
            </Layout>
        </Layout>
    );
};

// Component that uses useSearchParams - wrapped in Suspense
const ProductContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Các state cho filter và search
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        searchParams.get("category"),
    );
    const [priceRange, setPriceRange] = useState<[number, number]>([
        0, 2000000,
    ]);
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
    const [inStock, setInStock] = useState(
        searchParams.get("inStock") === "true",
    );
    const [currentPage, setCurrentPage] = useState(
        Number(searchParams.get("page")) || 1,
    );
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const { data: categoryResponses } = useQuery<
        CollectionWrapper<ClientCategoryResponse>,
        ErrorMessage
    >({
        queryKey: ["client-api", "categories", "getAllCategories"],
        queryFn: () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    // Dữ liệu categories (trong thực tế sẽ fetch từ API)
    const categories = categoryResponses?.content || [];

    // Build query params từ các filter
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (selectedCategory) params.set("category", selectedCategory);
        if (sortBy) params.set("sort", sortBy);
        if (inStock) params.set("inStock", "true");
        if (currentPage > 1) params.set("page", currentPage.toString());
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
        if (priceRange[1] < 2000000)
            params.set("maxPrice", priceRange[1].toString());

        return params.toString();
    };

    // Fetch sản phẩm từ API
    const {
        data: productData,
        isLoading,
        error,
    } = useQuery<ListResponse<ClientListedProductResponse>>({
        queryKey: [
            "products",
            searchQuery,
            selectedCategory,
            priceRange,
            sortBy,
            inStock,
            currentPage,
        ],
        queryFn: () =>
            FetchUtils.get(ResourceURL.CLIENT_PRODUCT, {
                search: searchQuery,
                category: selectedCategory,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                sort: sortBy,
                saleable: inStock,
                page: currentPage,
                size: 12,
            }),
    });

    // Cập nhật URL khi filter thay đổi
    useEffect(() => {
        const queryString = buildQueryParams();
        router.push(`/product${queryString ? `?${queryString}` : ""}`, {
            scroll: false,
        });
    }, [
        searchQuery,
        selectedCategory,
        priceRange,
        sortBy,
        inStock,
        currentPage,
    ]);

    // Xử lý khi người dùng tìm kiếm
    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    // Xử lý khi thay đổi trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Reset tất cả filter
    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setPriceRange([0, 2000000]);
        setSortBy("newest");
        setInStock(false);
        setCurrentPage(1);
    };

    return (
        <>
            <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{
                    margin: "16px 0",
                    display: "block",
                    width: "100%",
                    maxWidth: "200px",
                }}
            >
                {sidebarCollapsed ? "Hiện bộ lọc" : "Ẩn bộ lọc"}
            </Button>

            <Layout>
                {!sidebarCollapsed && (
                    <Sider
                        width={250}
                        style={{
                            background: "#fff",
                            padding: "0 16px",
                            marginRight: 16,
                            borderRight: "1px solid #f0f0f0",
                        }}
                        breakpoint="lg"
                        collapsedWidth={0}
                        onCollapse={(collapsed) =>
                            setSidebarCollapsed(collapsed)
                        }
                    >
                        <Title level={4} style={{ marginTop: 16 }}>
                            Bộ lọc
                        </Title>

                        <Space
                            direction="vertical"
                            style={{ width: "100%" }}
                            size="large"
                        >
                            <div>
                                <Text strong>Tìm kiếm</Text>
                                <Input
                                    placeholder="Nhập từ khóa..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    suffix={<SearchOutlined />}
                                    style={{ marginTop: 8 }}
                                    allowClear
                                    onPressEnter={(e) =>
                                        handleSearch(
                                            (e.target as HTMLInputElement)
                                                .value,
                                        )
                                    }
                                />
                            </div>

                            <div>
                                <Text strong>Danh mục</Text>
                                <div style={{ marginTop: 8 }}>
                                    {categories.map((category) => (
                                        <div
                                            key={category.categoryName}
                                            style={{ marginBottom: 8 }}
                                        >
                                            <Checkbox
                                                checked={
                                                    selectedCategory ===
                                                    category.categoryName
                                                }
                                                onChange={(e) =>
                                                    setSelectedCategory(
                                                        e.target.checked
                                                            ? category.categoryName
                                                            : null,
                                                    )
                                                }
                                            >
                                                {category.categoryName}
                                            </Checkbox>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Text strong>Khoảng giá</Text>
                                <Slider
                                    range
                                    min={0}
                                    max={2000000}
                                    step={100000}
                                    value={priceRange}
                                    onChange={(value) =>
                                        setPriceRange(value as [number, number])
                                    }
                                    style={{ marginTop: 16 }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: 8,
                                    }}
                                >
                                    <Text>
                                        {priceRange[0].toLocaleString("vi-VN")}{" "}
                                        ₫
                                    </Text>
                                    <Text>
                                        {priceRange[1].toLocaleString("vi-VN")}{" "}
                                        ₫
                                    </Text>
                                </div>
                            </div>

                            <div>
                                <Checkbox
                                    checked={inStock}
                                    onChange={(e) =>
                                        setInStock(e.target.checked)
                                    }
                                >
                                    Chỉ hiện sản phẩm còn hàng
                                </Checkbox>
                            </div>

                            <Button type="default" onClick={handleResetFilters}>
                                Xóa bộ lọc
                            </Button>
                        </Space>
                    </Sider>
                )}

                <Content
                    style={{
                        padding: "0 0 24px",
                        minHeight: 280,
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <Space>
                            <SortAscendingOutlined />
                            <Text strong>Sắp xếp:</Text>
                            <Select
                                value={sortBy}
                                onChange={(value) => setSortBy(value)}
                                style={{ width: 150 }}
                            >
                                <Option value="newest">Mới nhất</Option>
                                <Option value="lowest-price">
                                    Giá thấp → cao
                                </Option>
                                <Option value="highest-price">
                                    Giá cao → thấp
                                </Option>
                                <Option value="best-selling">
                                    Bán chạy nhất
                                </Option>
                            </Select>
                        </Space>
                    </div>

                    {/* Hiển thị các filter đã chọn */}
                    {(searchQuery ||
                        selectedCategory ||
                        inStock ||
                        priceRange[0] > 0 ||
                        priceRange[1] < 2000000) && (
                        <Space wrap style={{ marginBottom: 16 }}>
                            <Text>Lọc theo:</Text>
                            {searchQuery && (
                                <Tag
                                    closable
                                    onClose={() => setSearchQuery("")}
                                >
                                    Tìm kiếm: {searchQuery}
                                </Tag>
                            )}
                            {selectedCategory && (
                                <Tag
                                    closable
                                    onClose={() => setSelectedCategory(null)}
                                >
                                    Danh mục:{" "}
                                    {
                                        categories.find(
                                            (c) =>
                                                c.categoryName ===
                                                selectedCategory,
                                        )?.categoryName
                                    }
                                </Tag>
                            )}
                            {inStock && (
                                <Tag closable onClose={() => setInStock(false)}>
                                    Còn hàng
                                </Tag>
                            )}
                            {(priceRange[0] > 0 || priceRange[1] < 2000000) && (
                                <Tag
                                    closable
                                    onClose={() => setPriceRange([0, 2000000])}
                                >
                                    Giá: {priceRange[0].toLocaleString("vi-VN")}{" "}
                                    ₫ - {priceRange[1].toLocaleString("vi-VN")}{" "}
                                    ₫
                                </Tag>
                            )}
                        </Space>
                    )}

                    {isLoading ? (
                        <div style={{ textAlign: "center", padding: 40 }}>
                            <Spin size="large" />
                        </div>
                    ) : error ? (
                        <Empty
                            description="Đã có lỗi xảy ra khi tải dữ liệu"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : productData?.content?.length === 0 ? (
                        <Empty
                            description="Không tìm thấy sản phẩm phù hợp"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <>
                            <Row gutter={[16, 24]}>
                                {productData?.content?.map((product) => (
                                    <Col
                                        xs={24}
                                        sm={12}
                                        md={8}
                                        lg={6}
                                        key={product.productId}
                                    >
                                        <Link
                                            href={`/product/${product.productSlug}`}
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <Card
                                                hoverable
                                                cover={
                                                    <div
                                                        style={{
                                                            height: 200,
                                                            position:
                                                                "relative",
                                                        }}
                                                    >
                                                        <Image
                                                            src={
                                                                product.productThumbnail ||
                                                                "/images/default-product.png"
                                                            }
                                                            alt={
                                                                product.productName
                                                            }
                                                            fill
                                                            style={{
                                                                objectFit:
                                                                    "contain",
                                                            }}
                                                        />
                                                    </div>
                                                }
                                                actions={[
                                                    <HeartOutlined key="favorite" />,
                                                    <ShoppingCartOutlined key="add-cart" />,
                                                ]}
                                            >
                                                <Card.Meta
                                                    title={product.productName}
                                                    description={
                                                        <Space
                                                            direction="vertical"
                                                            size={0}
                                                        >
                                                            <Text
                                                                strong
                                                                style={{
                                                                    color: "#f5222d",
                                                                    fontSize: 16,
                                                                }}
                                                            >
                                                                {product.productPriceRange
                                                                    .map(
                                                                        (
                                                                            price,
                                                                        ) =>
                                                                            product.productPromotion
                                                                                ? MiscUtils.calculateDiscountedPrice(
                                                                                      price,
                                                                                      product
                                                                                          .productPromotion
                                                                                          .promotionPercent,
                                                                                  )
                                                                                : price,
                                                                    )
                                                                    .map(
                                                                        MiscUtils.formatPrice,
                                                                    )
                                                                    .join("–") +
                                                                    "\u00A0₫"}
                                                            </Text>
                                                            <Text type="secondary">
                                                                {product
                                                                    .productVariants
                                                                    .length > 1
                                                                    ? `${product.productVariants.length} phiên bản`
                                                                    : ""}
                                                            </Text>
                                                        </Space>
                                                    }
                                                />
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>

                            <div
                                style={{
                                    marginTop: 24,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Pagination
                                    current={currentPage}
                                    total={productData?.totalElements || 0}
                                    pageSize={12}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                />
                                <Text>
                                    {productData?.totalElements || 0} sản phẩm
                                </Text>
                            </div>
                        </>
                    )}
                </Content>
            </Layout>
        </>
    );
};

export default ProductListPage;
