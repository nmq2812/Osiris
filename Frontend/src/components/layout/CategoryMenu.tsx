"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
    Typography,
    Row,
    Col,
    Space,
    Flex,
    Tabs,
    Skeleton,
    Avatar,
} from "antd";

import { AlertTriangle } from "tabler-icons-react";
import ResourceURL from "@/constants/ResourceURL";
import { ClientCategoryResponse } from "@/datas/ClientUI";
import { CollectionWrapper } from "@/datas/CollectionWrapper";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import PageConfigs from "@/utils/PageConfigs";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

const { Link, Text } = Typography;

function CategoryMenu({
    setOpenedCategoryMenu,
}: {
    setOpenedCategoryMenu: Dispatch<SetStateAction<boolean>>;
}) {
    const route = useRouter();

    const {
        data: categoryResponses,
        isLoading: isLoadingCategoryResponses,
        isError: isErrorCategoryResponses,
    } = useQuery<CollectionWrapper<ClientCategoryResponse>, ErrorMessage>(
        ["client-api", "categories", "getAllCategories"],
        () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY),
        {
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        },
    );

    if (isLoadingCategoryResponses) {
        return (
            <Flex vertical>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} active paragraph={{ rows: 1 }} />
                    ))}
            </Flex>
        );
    }

    if (isErrorCategoryResponses) {
        return (
            <Flex
                vertical
                align="center"
                style={{ margin: "24px 0", color: "#eb2f96" }}
            >
                <AlertTriangle size={125} strokeWidth={1} />
                <Text style={{ fontSize: 20, fontWeight: 500 }}>
                    Đã có lỗi xảy ra
                </Text>
            </Flex>
        );
    }

    const handleAnchor = (path: string) => {
        setOpenedCategoryMenu(false);
        setTimeout(() => route.replace(path), 200);
    };

    return (
        <Tabs
            type="card"
            items={categoryResponses?.content.map((firstCategory, index) => {
                const FirstCategoryIcon =
                    PageConfigs.categorySlugIconMap[firstCategory.categorySlug];

                return {
                    key: String(index),
                    label: (
                        <Space>
                            <FirstCategoryIcon size={14} />
                            <span>{firstCategory.categoryName}</span>
                        </Space>
                    ),
                    children: (
                        <Flex vertical>
                            <Space>
                                <Avatar
                                    size={42}
                                    icon={<FirstCategoryIcon />}
                                />
                                <Link
                                    style={{ fontSize: 16, fontWeight: 500 }}
                                    onClick={() =>
                                        handleAnchor(
                                            "/category/" +
                                                firstCategory.categorySlug,
                                        )
                                    }
                                >
                                    {firstCategory.categoryName}
                                </Link>
                            </Space>
                            <div style={{ height: 325, overflow: "auto" }}>
                                <Row gutter={[16, 16]}>
                                    {firstCategory.categoryChildren.map(
                                        (secondCategory, index) => (
                                            <Col
                                                span={12}
                                                xs={12}
                                                sm={8}
                                                md={6}
                                                lg={4}
                                                key={index}
                                            >
                                                <Flex vertical gap="small">
                                                    <Link
                                                        style={{
                                                            fontWeight: 500,
                                                        }}
                                                        type="danger"
                                                        onClick={() =>
                                                            handleAnchor(
                                                                "/category/" +
                                                                    secondCategory.categorySlug,
                                                            )
                                                        }
                                                    >
                                                        {
                                                            secondCategory.categoryName
                                                        }
                                                    </Link>
                                                    {secondCategory.categoryChildren.map(
                                                        (
                                                            thirdCategory,
                                                            index,
                                                        ) => (
                                                            <Link
                                                                key={index}
                                                                onClick={() =>
                                                                    handleAnchor(
                                                                        "/category/" +
                                                                            thirdCategory.categorySlug,
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    thirdCategory.categoryName
                                                                }
                                                            </Link>
                                                        ),
                                                    )}
                                                </Flex>
                                            </Col>
                                        ),
                                    )}
                                </Row>
                            </div>
                        </Flex>
                    ),
                };
            })}
        />
    );
}

export default CategoryMenu;
