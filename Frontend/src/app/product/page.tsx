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
    Divider,
    Typography,
    Pagination,
    Spin,
    Empty,
    Tag,
    Breadcrumb,
    Skeleton,
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

// Component chính không sử dụng useSearchParams trực tiếp
const ProductListPage: React.FC = () => {
    return (
        <Layout style={{ background: "#fff", minHeight: "100vh" }}>
            <Breadcrumb style={{ margin: "16px 24px" }}>
                <Breadcrumb.Item>
                    <Link href="/">Trang chủ</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
            </Breadcrumb>

            <Suspense fallback={<ProductListFallback />}>
                <ProductListContent />
            </Suspense>
        </Layout>
    );
};

// Component fallback hiển thị khi đang tải
const ProductListFallback: React.FC = () => {
    return (
        <Layout style={{ padding: "0 24px" }}>
            <div style={{ margin: "16px 0", height: 40 }}>
                <Skeleton.Button active style={{ width: 200 }} />
            </div>

            <Layout>
                <Content style={{ padding: "0 0 24px", width: "100%" }}>
                    <Skeleton active paragraph={{ rows: 1 }} />
                    <div style={{ marginTop: 16 }}>
                        <Row gutter={[16, 24]}>
                            {Array(8)
                                .fill(null)
                                .map((_, index) => (
                                    <Col
                                        xs={24}
                                        sm={12}
                                        md={8}
                                        lg={6}
                                        key={index}
                                    >
                                        <Card>
                                            <Skeleton.Image
                                                style={{
                                                    width: "100%",
                                                    height: 200,
                                                }}
                                                active
                                            />
                                            <Skeleton
                                                active
                                                title
                                                paragraph={{ rows: 2 }}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                        </Row>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

// Component con sử dụng useSearchParams - được bao bọc trong Suspense
const ProductListContent: React.FC = () => {
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

    // Dữ liệu categories
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
            priceRange[0], // Sử dụng giá trị riêng lẻ thay vì mảng
            priceRange[1],
            sortBy,
            inStock,
            currentPage,
        ],
        queryFn: () =>
            FetchUtils.get(ResourceURL.CLIENT_PRODUCT, {
                search: searchQuery || "",
                category: selectedCategory,
                minPrice: priceRange[0] > 0 ? priceRange[0] : 0,
                maxPrice: priceRange[1] < 2000000 ? priceRange[1] : 0,
                sort: sortBy || "",
                saleable: inStock || true,
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
        <Layout style={{ padding: "0 24px" }}>
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
                            {/* Filter content - giữ nguyên như đã cấu hình */}
                            {/* ... */}
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
                    {/* Content - giữ nguyên các phần đã cấu hình */}
                    {/* ... */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProductListPage;
