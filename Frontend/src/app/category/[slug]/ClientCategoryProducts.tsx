import React from "react";
import { Row, Col, Space, Pagination, Skeleton, Typography, theme } from "antd";
import { AlertOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import ClientProductCard from "@/components/ClientProductCard";
import ApplicationConstants from "@/constants/ApplicationConstants";
import ResourceURL from "@/constants/ResourceURL";
import { ClientListedProductResponse } from "@/datas/ClientUI";
import useClientCategoryStore from "@/stores/use-client-category-store";
import FetchUtils, { ListResponse, ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useQuery } from "@tanstack/react-query";

const { Text } = Typography;
const { useToken } = theme;

interface ClientCategoryProductsProps {
    categorySlug: string;
}

function ClientCategoryProducts({ categorySlug }: ClientCategoryProductsProps) {
    const { token } = useToken();

    const { activePage, activeSearch, updateActivePage } =
        useClientCategoryStore();

    const {
        productResponses,
        isLoadingProductResponses,
        isErrorProductResponses,
    } = useGetAllCategoryProductsApi(categorySlug);
    const products =
        productResponses as ListResponse<ClientListedProductResponse>;

    if (isLoadingProductResponses) {
        return (
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
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: token.paddingLG,
                    color: token.colorError,
                }}
            >
                <AlertOutlined style={{ fontSize: 64 }} />
                <Text
                    style={{
                        fontSize: token.fontSizeXL,
                        fontWeight: 500,
                        marginTop: token.marginMD,
                    }}
                >
                    Đã có lỗi xảy ra
                </Text>
            </div>
        );
    }

    if (products.totalElements === 0) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: token.paddingLG,
                    color: token.colorPrimary,
                }}
            >
                <ExclamationCircleOutlined style={{ fontSize: 64 }} />
                <Text
                    style={{
                        fontSize: token.fontSizeXL,
                        fontWeight: 500,
                        marginTop: token.marginMD,
                    }}
                >
                    Không có sản phẩm
                </Text>
            </div>
        );
    }

    return (
        <>
            <Row gutter={[16, 24]}>
                {products.content.map((product, index) => (
                    <Col key={index} xs={12} sm={8} md={6}>
                        <ClientProductCard
                            product={product}
                            search={activeSearch || ""}
                        />
                    </Col>
                ))}
            </Row>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: token.marginLG,
                }}
            >
                <Pagination
                    current={activePage}
                    total={products.totalElements}
                    pageSize={
                        ApplicationConstants.DEFAULT_CLIENT_CATEGORY_PAGE_SIZE
                    }
                    onChange={(page: number) =>
                        page !== activePage && updateActivePage(page)
                    }
                />
                <Text>
                    <Text strong>Trang {activePage}</Text>
                    <span> / {products.totalPages}</span>
                </Text>
            </div>
        </>
    );
}

function useGetAllCategoryProductsApi(categorySlug: string) {
    const {
        totalProducts,
        activePage,
        activeSort,
        activeSearch,
        activeSaleable,
        activeBrandFilter,
        activePriceFilter,
        updateTotalProducts,
    } = useClientCategoryStore();

    const requestParams = {
        page: activePage,
        size: ApplicationConstants.DEFAULT_CLIENT_CATEGORY_PAGE_SIZE,
        filter: [
            `category.slug==${categorySlug}`,
            activeBrandFilter,
            activePriceFilter,
        ]
            .filter(Boolean)
            .join(";"),
        sort: activeSort,
        search: activeSearch,
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
        placeholderData: (previousData) => previousData,
    });

    // Handle success side effect
    React.useEffect(() => {
        if (
            productResponses &&
            totalProducts !== productResponses.totalElements
        ) {
            updateTotalProducts(productResponses.totalElements);
        }
    }, [productResponses, totalProducts, updateTotalProducts]);

    // Handle error side effect
    React.useEffect(() => {
        if (isErrorProductResponses) {
            NotifyUtils.simpleFailed("Lấy dữ liệu không thành công");
        }
    }, [isErrorProductResponses]);

    return {
        productResponses,
        isLoadingProductResponses,
        isErrorProductResponses,
    };
}

export default ClientCategoryProducts;
