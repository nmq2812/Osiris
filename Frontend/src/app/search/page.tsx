"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    Layout,
    Card,
    Checkbox,
    Col,
    Divider,
    Empty,
    Pagination,
    Radio,
    Row,
    Skeleton,
    Space,
    Typography,
    theme,
} from "antd";
import {
    AlertOutlined,
    SortAscendingOutlined,
    AreaChartOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import ClientProductCard from "@/components/ClientProductCard";
import ApplicationConstants from "@/constants/ApplicationConstants";
import ResourceURL from "@/constants/ResourceURL";
import { ClientListedProductResponse } from "@/datas/ClientUI";
import useTitle from "@/hooks/use-title";
import FetchUtils, { ListResponse, ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useQuery } from "@tanstack/react-query";

const { Title, Text } = Typography;

const { Content } = Layout;

// Tạo component riêng sử dụng useSearchParams để bọc trong Suspense
function SearchResults() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q");
    useTitle(`Kết quả tìm kiếm cho "${searchQuery}"`);

    const [activePage, setActivePage] = useState(1);
    const [activeSort, setActiveSort] = useState<string | null>(null);
    const [activeSaleable, setActiveSaleable] = useState(false);

    const requestParams = {
        page: activePage,
        size: ApplicationConstants.DEFAULT_CLIENT_SEARCH_PAGE_SIZE,
        filter: null,
        sort: activeSort,
        search: searchQuery,
        newable: true,
        saleable: activeSaleable,
    };

    const {
        data: productResponses,
        isLoading: isLoadingProductResponses,
        isError: isErrorProductResponses,
    } = useQuery<ListResponse<ClientListedProductResponse>, ErrorMessage>({
        queryKey: ["client-api", "products", "getAllProducts", requestParams],
        queryFn: () =>
            FetchUtils.get(ResourceURL.CLIENT_PRODUCT, requestParams),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isErrorProductResponses) {
            NotifyUtils.simpleFailed("Lấy dữ liệu không thành công");
        }
    }, [isErrorProductResponses]);

    const products =
        productResponses as ListResponse<ClientListedProductResponse>;

    let resultFragment;

    if (isLoadingProductResponses) {
        resultFragment = (
            <Space direction="vertical" style={{ width: "100%" }}>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} active />
                    ))}
            </Space>
        );
    }

    if (isErrorProductResponses) {
        resultFragment = (
            <div style={{ textAlign: "center", padding: 24 }}>
                <AlertOutlined style={{ fontSize: 64, color: "#f5222d" }} />
                <Typography.Title level={4} style={{ marginTop: 16 }}>
                    Đã có lỗi xảy ra
                </Typography.Title>
            </div>
        );
    }

    if (products && products.totalElements === 0) {
        resultFragment = (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có sản phẩm"
                style={{ margin: "48px 0" }}
            />
        );
    }

    if (products && products.totalElements > 0) {
        resultFragment = (
            <>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    {products.content.map((product, index) => (
                        <Col key={index} xs={12} sm={8} md={6}>
                            <ClientProductCard
                                product={product}
                                search={searchQuery || ""}
                            />
                        </Col>
                    ))}
                </Row>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 24,
                    }}
                >
                    <Pagination
                        current={activePage}
                        total={products.totalElements}
                        pageSize={
                            ApplicationConstants.DEFAULT_CLIENT_SEARCH_PAGE_SIZE
                        }
                        onChange={(page) =>
                            page !== activePage && setActivePage(page)
                        }
                        showSizeChanger={false}
                    />
                    <Text>
                        <Text strong>Trang {activePage}</Text> /{" "}
                        {products.totalPages}
                    </Text>
                </div>
            </>
        );
    }

    return (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card>
                <Title level={2}>
                    Kết quả tìm kiếm cho "
                    <Text type="warning" style={{ display: "inline" }}>
                        {searchQuery}
                    </Text>
                    "
                </Title>
            </Card>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Space>
                        <SortAscendingOutlined />
                        <Text strong style={{ marginRight: 8 }}>
                            Sắp xếp theo
                        </Text>
                        <Radio.Group
                            value={activeSort || ""}
                            onChange={(e) =>
                                setActiveSort(e.target.value || null)
                            }
                        >
                            <Radio value="">Mới nhất</Radio>
                            <Radio value="lowest-price">Giá thấp → cao</Radio>
                            <Radio value="highest-price">Giá cao → thấp</Radio>
                        </Radio.Group>
                    </Space>
                    <Text>{products?.totalElements || 0} sản phẩm</Text>
                </div>

                <Space>
                    <AreaChartOutlined />
                    <Text strong style={{ marginRight: 8 }}>
                        Lọc theo
                    </Text>
                    <Checkbox
                        checked={activeSaleable}
                        onChange={(e) => {
                            setActiveSaleable(e.target.checked);
                            setActivePage(1);
                        }}
                    >
                        Chỉ tính còn hàng
                    </Checkbox>
                </Space>

                {resultFragment}
            </Space>
        </Space>
    );
}

// Component chính không sử dụng trực tiếp useSearchParams
function ClientSearch() {
    return (
        <main>
            <Content
                style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
            >
                <Suspense
                    fallback={
                        <Card style={{ marginTop: 16 }}>
                            <Skeleton active />
                            <Divider />
                            <Skeleton active />
                        </Card>
                    }
                >
                    <SearchResults />
                </Suspense>
            </Content>
        </main>
    );
}

export default ClientSearch;
