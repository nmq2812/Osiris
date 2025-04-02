"use client";
import React from "react";
import { Skeleton } from "@mantine/core";
import { Button, Space, Typography } from "antd";
import { AlertTriangle, List, Marquee } from "tabler-icons-react";

import { useQuery } from "react-query";
import ClientProductCard from "@/components/ClientProductCard";
import ResourceURL from "@/constants/ResourceURL";
import { ClientListedProductResponse } from "@/datas/ClientUI";
import FetchUtils, { ListResponse, ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";

function ClientHomeLatestProducts() {
    const requestParams = { size: 12, newable: true, saleable: true };

    const {
        data: productResponses,
        isLoading: isLoadingProductResponses,
        isError: isErrorProductResponses,
    } = useQuery<ListResponse<ClientListedProductResponse>, ErrorMessage>(
        ["client-api", "products", "getAllProducts", requestParams],
        () => FetchUtils.get(ResourceURL.CLIENT_PRODUCT, requestParams),
        {
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        },
    );
    const products =
        productResponses as ListResponse<ClientListedProductResponse>;

    let resultFragment;

    if (isLoadingProductResponses) {
        resultFragment = (
            <Space direction="vertical">
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} height={50} radius="md" />
                    ))}
            </Space>
        );
    }

    if (isErrorProductResponses) {
        resultFragment = (
            <Space
                style={{
                    alignItems: "center",
                }}
            >
                <AlertTriangle size={125} strokeWidth={1} />
                <Typography.Text style={{ fontSize: "14px", fontWeight: 500 }}>
                    Đã có lỗi xảy ra
                </Typography.Text>
            </Space>
        );
    }

    if (products && products.totalElements === 0) {
        resultFragment = (
            <Space
                style={{
                    margin: "24px",
                    alignItems: "center",
                    color: "#1890ff",
                }}
            >
                <Marquee size={125} strokeWidth={1} />
                <Typography.Text style={{ fontSize: "20px", fontWeight: 500 }}>
                    Không có sản phẩm
                </Typography.Text>
            </Space>
        );
    }

    if (products && products.totalElements > 0) {
        resultFragment = (
            <div className="grid">
                {products.content.map((product, index) => (
                    <div key={index} className="grid-col">
                        <ClientProductCard product={product} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Space
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Typography.Title level={2}>
                    <Typography.Text style={{ color: "orange" }}>
                        Sản phẩm mới nhất
                    </Typography.Text>
                </Typography.Title>
                <Button type="default" icon={<List size={16} />}>
                    Xem tất cả
                </Button>
            </Space>

            {resultFragment}
        </Space>
    );
}

export default ClientHomeLatestProducts;
