"use client";
import React from "react";
import { Button, Space, Typography, Skeleton, Empty } from "antd";
import {
    UnorderedListOutlined,
    WarningOutlined,
    InboxOutlined,
} from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";
import ClientProductCard from "@/components/ClientProductCard";
import ResourceURL from "@/constants/ResourceURL";
import { ClientListedProductResponse } from "@/datas/ClientUI";
import FetchUtils, { ListResponse, ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useRouter } from "next/navigation";

function ClientHomeHotProducts() {
    const requestParams = { size: 12, newable: true, saleable: true };
    const route = useRouter();

    const {
        data: productResponses,
        isLoading: isLoadingProductResponses,
        isError: isErrorProductResponses,
    } = useQuery<ListResponse<ClientListedProductResponse>, ErrorMessage>({
        queryKey: ["client-api", "products", "getAllProducts", requestParams],
        queryFn: () =>
            FetchUtils.get(ResourceURL.CLIENT_PRODUCT, requestParams),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    console.log("productResponses", productResponses);

    React.useEffect(() => {
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
            <div style={{ textAlign: "center", margin: "24px 0" }}>
                <WarningOutlined style={{ fontSize: 64, color: "#ff4d4f" }} />
                <Typography.Text
                    style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    Đã có lỗi xảy ra
                </Typography.Text>
            </div>
        );
    }

    if (products && products.totalElements === 0) {
        resultFragment = (
            <Empty
                image={
                    <InboxOutlined style={{ fontSize: 64, color: "#1890ff" }} />
                }
                description="Không có sản phẩm"
                style={{ margin: "24px 0" }}
            />
        );
    }

    if (products && products.totalElements > 0) {
        resultFragment = (
            <div className="flex overflow-x-auto space-x-4 pb-4">
                {products.content.map((product, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0"
                        style={{ minWidth: "280px" }}
                    >
                        <ClientProductCard product={product} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Typography.Title level={2}>
                    <Typography.Text style={{ color: "orange" }}>
                        Sản phẩm bán chạy
                    </Typography.Text>
                </Typography.Title>
                <Button
                    type="default"
                    icon={<UnorderedListOutlined />}
                    style={{ borderRadius: "8px" }}
                    onClick={() => {
                        route.push("/product");
                    }}
                >
                    Xem tất cả
                </Button>
            </div>

            {resultFragment}
        </Space>
    );
}

export default ClientHomeHotProducts;
