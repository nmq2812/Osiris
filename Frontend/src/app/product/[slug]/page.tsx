"use client";
import React, { useEffect } from "react";
import { Space, Skeleton, theme, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import ResourceURL from "@/constants/ResourceURL";
import NotifyUtils from "@/utils/NotifyUtils";
import ClientError from "@/components/ClientError";
import { ClientProductResponse } from "@/datas/ClientUI";
import useTitle from "@/hooks/use-title";
import ClientProductDescription from "./ClientProductDescription";
import ClientProductIntro from "./ClientProductIntro";
import ClientProductRelatedProducts from "./ClientProductRelatedProducts";
import ClientProductReviews from "./ClientProductReviews";
import ClientProductSpecification from "./ClientProductSpecification";

const { useToken } = theme;

function ClientProduct() {
    const { token } = useToken();
    const params = useParams();
    const slug = params.slug as string;

    const {
        productResponse,
        isLoadingProductResponse,
        isErrorProductResponse,
    } = useGetProductApi(slug);
    const product = productResponse as ClientProductResponse;
    useTitle(product?.productName);

    if (isLoadingProductResponse) {
        return <ClientProductSkeleton />;
    }

    if (isErrorProductResponse) {
        return <ClientError />;
    }

    return (
        <main>
            <div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
                <Space
                    direction="vertical"
                    size={token.marginXL * 2}
                    style={{ width: "100%" }}
                >
                    <ClientProductIntro product={product} />

                    {product.productSpecifications && (
                        <ClientProductSpecification product={product} />
                    )}

                    {product.productDescription && (
                        <ClientProductDescription product={product} />
                    )}

                    <ClientProductReviews productSlug={slug} />

                    {product.productRelatedProducts.length > 0 && (
                        <ClientProductRelatedProducts product={product} />
                    )}
                </Space>
            </div>
        </main>
    );
}

function ClientProductSkeleton() {
    return (
        <main>
            <div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                active
                                paragraph={{ rows: 4 }}
                            />
                        ))}
                </Space>
            </div>
        </main>
    );
}

function useGetProductApi(productSlug: string) {
    const {
        data: productResponse,
        isLoading: isLoadingProductResponse,
        isError: isErrorProductResponse,
    } = useQuery<ClientProductResponse, ErrorMessage>({
        queryKey: ["client-api", "products", "getProduct", productSlug],
        queryFn: () =>
            FetchUtils.get(ResourceURL.CLIENT_PRODUCT + "/" + productSlug),

        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    });

    useEffect(() => {
        if (isErrorProductResponse) {
            NotifyUtils.simpleFailed("Lấy dữ liệu không thành công");
        }
    }, [isErrorProductResponse]);

    return {
        productResponse,
        isLoadingProductResponse,
        isErrorProductResponse,
    };
}

export default ClientProduct;
