"use client";
import React, { useEffect, useState } from "react";
import {
    Typography,
    Button,
    Card,
    Checkbox,
    Tag,
    Space,
    Row,
    Col,
    Input,
    Radio,
    Breadcrumb,
    theme,
    Divider,
} from "antd";
import {
    LineChartOutlined,
    SearchOutlined,
    CloseOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    RightOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import { useParams } from "next/navigation";

import ResourceURL from "@/constants/ResourceURL";
import { ClientCategoryResponse, ClientFilterResponse } from "@/datas/ClientUI";
import useTitle from "@/hooks/use-title";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useQuery } from "react-query";
import useClientCategoryStore from "@/stores/use-client-category-store";
import ClientCategoryProducts from "./ClientCategoryProducts";
import ClientCategorySkeleton from "./ClientCategorySkeleton";
import ClientError from "@/components/ClientError";
import { useDebounce } from "@/hooks/useDebounce";

const { Title, Text } = Typography;
const { useToken } = theme;

function ClientCategory() {
    const { token } = useToken();
    const params = useParams();
    const slug = params?.slug as string;

    const {
        totalProducts,
        activePage,
        activePriceFilter,
        activeBrandFilter,
        activeSort,
        activeSearch,
        activeSaleable,
        updateActivePage,
        updateActiveSort,
        updateActiveSearch,
        updateActiveSaleable,
        updateActiveBrandFilter,
        updateActivePriceFilter,
        resetClientCategoryState,
    } = useClientCategoryStore();

    // Search state
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const debouncedSearchQuery = useDebounce(searchQuery, 400);

    useEffect(() => {
        if (debouncedSearchQuery !== activeSearch) {
            updateActivePage(1);
            updateActiveSearch(debouncedSearchQuery);
        }
    }, [
        activeSearch,
        debouncedSearchQuery,
        updateActivePage,
        updateActiveSearch,
    ]);

    // Filter state
    const [priceOptions, setPriceOptions] = useState<string[]>([]);
    const [brandOptions, setBrandOptions] = useState<string[]>([]);

    // Reset all state
    useEffect(() => {
        setSearchQuery(null);
        setPriceOptions([]);
        setBrandOptions([]);
        resetClientCategoryState();
    }, [resetClientCategoryState, slug]);

    // Fetch category
    const {
        categoryResponse,
        isLoadingCategoryResponse,
        isErrorCategoryResponse,
    } = useGetCategoryApi(slug);
    const category = categoryResponse as ClientCategoryResponse;
    useTitle(category?.categoryName);

    // Fetch filter
    const { filterResponse, isLoadingFilterResponse, isErrorFilterResponse } =
        useGetFilterApi(slug);
    const filter = filterResponse as ClientFilterResponse;

    // Composition
    const isLoading = isLoadingCategoryResponse || isLoadingFilterResponse;
    const isError = isErrorCategoryResponse || isErrorFilterResponse;

    if (isLoading) {
        return <ClientCategorySkeleton />;
    }

    if (isError) {
        return <ClientError />;
    }

    const handlePriceOptionTags = (selectedValue: string) => {
        // Kiểm tra xem giá trị đã được chọn chưa
        const newPriceOptions = priceOptions.includes(selectedValue)
            ? priceOptions.filter((opt) => opt !== selectedValue) // Nếu đã chọn, loại bỏ
            : [...priceOptions, selectedValue]; // Nếu chưa chọn, thêm vào

        const expressions = [];

        for (const priceOption of newPriceOptions) {
            const priceOptionArray = priceOption.split("-");
            if (priceOptionArray[1] === "max") {
                expressions.push(
                    `variants.price=bt=(${priceOptionArray[0]},1000000000)`,
                );
            } else {
                expressions.push(
                    `variants.price=bt=(${priceOptionArray[0]},${priceOptionArray[1]})`,
                );
            }
        }

        setPriceOptions(newPriceOptions);
        updateActivePriceFilter(
            expressions.length > 0 ? `(${expressions.join(",")})` : null,
        );
    };

    const handleBrandTags = (brandId: string) => {
        // Kiểm tra xem thương hiệu đã được chọn chưa
        const newBrandOptions = brandOptions.includes(brandId)
            ? brandOptions.filter((id) => id !== brandId) // Nếu đã chọn, loại bỏ
            : [...brandOptions, brandId]; // Nếu chưa chọn, thêm vào

        setBrandOptions(newBrandOptions);
        updateActiveBrandFilter(
            newBrandOptions.length > 0
                ? `brand.id=in=(${newBrandOptions.join(",")})`
                : null,
        );
    };

    const disabledResetButton =
        activePage === 1 &&
        activeBrandFilter === null &&
        activePriceFilter === null &&
        activeSort === null &&
        searchQuery === null &&
        !activeSaleable;

    const handleResetButton = () => {
        resetClientCategoryState();
        setSearchQuery(null);
        setPriceOptions([]);
        setBrandOptions([]);
    };

    return (
        <main className="container mx-auto px-4 py-4">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: "100%" }}
                    >
                        <Breadcrumb
                            items={[
                                {
                                    title: <Link href="/">Trang chủ</Link>,
                                },
                                ...MiscUtils.makeCategoryBreadcrumbs(category)
                                    .slice(0, -1)
                                    .map((c) => ({
                                        title: (
                                            <Link
                                                href={
                                                    "/category/" +
                                                    c.categorySlug
                                                }
                                            >
                                                {c.categoryName}
                                            </Link>
                                        ),
                                    })),
                                {
                                    title: (
                                        <Text type="secondary">
                                            {category.categoryName}
                                        </Text>
                                    ),
                                },
                            ]}
                        />

                        <Space size="small">
                            <Title level={2} style={{ margin: 0 }}>
                                {category.categoryName}
                            </Title>
                            {category.categoryChildren.length > 0 && (
                                <>
                                    <Text type="secondary">
                                        <RightOutlined
                                            style={{ fontSize: 12 }}
                                        />
                                    </Text>
                                    <Breadcrumb
                                        separator="·"
                                        items={category.categoryChildren.map(
                                            (c) => ({
                                                key: c.categorySlug,
                                                title: (
                                                    <Link
                                                        href={
                                                            "/category/" +
                                                            c.categorySlug
                                                        }
                                                        style={{ fontSize: 14 }}
                                                    >
                                                        {c.categoryName}
                                                    </Link>
                                                ),
                                            }),
                                        )}
                                    />
                                </>
                            )}
                        </Space>
                    </Space>
                </Card>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Space>
                                    <LineChartOutlined />
                                    <Text strong>Bộ lọc</Text>
                                </Space>
                                <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={
                                        <CloseOutlined
                                            style={{ fontSize: 12 }}
                                        />
                                    }
                                    onClick={handleResetButton}
                                    disabled={disabledResetButton}
                                >
                                    Đặt mặc định
                                </Button>
                            </div>

                            <Space
                                direction="vertical"
                                size="small"
                                style={{ width: "100%" }}
                            >
                                <Text strong>Tìm kiếm</Text>
                                <Input
                                    placeholder={
                                        "Tìm kiếm trong " +
                                        category.categoryName
                                    }
                                    prefix={<SearchOutlined />}
                                    value={searchQuery || ""}
                                    onChange={(event) =>
                                        setSearchQuery(
                                            event.target.value || null,
                                        )
                                    }
                                    allowClear
                                />
                            </Space>

                            <Space
                                direction="vertical"
                                size="small"
                                style={{ width: "100%" }}
                            >
                                <Text strong>Khoảng giá</Text>
                                <div className="price-tags">
                                    {MiscUtils.generatePriceOptions(
                                        filter.filterPriceQuartiles,
                                    ).map((priceOption, index) => {
                                        const value = priceOption.join("-");
                                        return (
                                            <Tag
                                                key={index}
                                                color={
                                                    priceOptions.includes(value)
                                                        ? "blue"
                                                        : undefined
                                                }
                                                onClick={() =>
                                                    handlePriceOptionTags(value)
                                                }
                                                style={{
                                                    marginBottom: 8,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {MiscUtils.readablePriceOption(
                                                    priceOption,
                                                )}
                                            </Tag>
                                        );
                                    })}
                                </div>
                            </Space>

                            <Space
                                direction="vertical"
                                size="small"
                                style={{ width: "100%" }}
                            >
                                <Text strong>Thương hiệu</Text>
                                {filter.filterBrands.length > 0 ? (
                                    <div className="brand-tags">
                                        {filter.filterBrands.map((brand) => (
                                            <Tag
                                                key={brand.brandId}
                                                color={
                                                    brandOptions.includes(
                                                        String(brand.brandId),
                                                    )
                                                        ? "blue"
                                                        : undefined
                                                }
                                                onClick={() =>
                                                    handleBrandTags(
                                                        String(brand.brandId),
                                                    )
                                                }
                                                style={{
                                                    marginBottom: 8,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {brand.brandName}
                                            </Tag>
                                        ))}
                                    </div>
                                ) : (
                                    <Text italic type="secondary">
                                        Không có tùy chọn
                                    </Text>
                                )}
                            </Space>

                            <Space
                                direction="vertical"
                                size="small"
                                style={{ width: "100%" }}
                            >
                                <Text strong>Khác</Text>
                                <Checkbox
                                    checked={activeSaleable}
                                    onChange={(event) =>
                                        updateActiveSaleable(
                                            event.target.checked,
                                        )
                                    }
                                >
                                    Chỉ tính còn hàng
                                </Checkbox>
                            </Space>
                        </Space>
                    </Col>

                    <Col xs={24} md={18}>
                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <Space align="center">
                                        {activeSort === "highest-price" ? (
                                            <ArrowDownOutlined />
                                        ) : (
                                            <ArrowUpOutlined />
                                        )}
                                        <Text strong style={{ marginRight: 8 }}>
                                            Sắp xếp theo
                                        </Text>
                                        <Radio.Group
                                            value={activeSort || ""}
                                            onChange={(event) =>
                                                updateActiveSort(
                                                    (event.target.value as
                                                        | ""
                                                        | "lowest-price"
                                                        | "highest-price") ||
                                                        null,
                                                )
                                            }
                                        >
                                            <Radio value="">Mới nhất</Radio>
                                            <Radio value="lowest-price">
                                                Giá thấp → cao
                                            </Radio>
                                            <Radio value="highest-price">
                                                Giá cao → thấp
                                            </Radio>
                                        </Radio.Group>
                                    </Space>
                                </div>
                                <Text>{totalProducts} sản phẩm</Text>
                            </div>

                            <ClientCategoryProducts
                                categorySlug={category.categorySlug}
                            />
                        </Space>
                    </Col>
                </Row>
            </Space>
        </main>
    );
}

function useGetCategoryApi(categorySlug: string) {
    const {
        data: categoryResponse,
        isLoading: isLoadingCategoryResponse,
        isError: isErrorCategoryResponse,
    } = useQuery<ClientCategoryResponse, ErrorMessage>(
        ["client-api", "categories", "getCategory", categorySlug],
        () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY + "/" + categorySlug),
        {
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        },
    );

    return {
        categoryResponse,
        isLoadingCategoryResponse,
        isErrorCategoryResponse,
    };
}

function useGetFilterApi(categorySlug: string) {
    const {
        data: filterResponse,
        isLoading: isLoadingFilterResponse,
        isError: isErrorFilterResponse,
    } = useQuery<ClientFilterResponse, ErrorMessage>(
        ["client-api", "filters", "getFilterByCategorySlug", categorySlug],
        () =>
            FetchUtils.get(ResourceURL.CLIENT_FILTER_CATEGORY, {
                slug: categorySlug,
            }),
        {
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        },
    );

    return { filterResponse, isLoadingFilterResponse, isErrorFilterResponse };
}

export default ClientCategory;
