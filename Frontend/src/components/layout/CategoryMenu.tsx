"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
    Typography,
    Row,
    Col,
    Space,
    Flex,
    Tabs,
    Skeleton,
    Avatar,
    Input,
    theme,
    Tag,
    Card,
    Empty,
} from "antd";
import { SearchOutlined, RightOutlined } from "@ant-design/icons";
import ResourceURL from "@/constants/ResourceURL";
import { ClientCategoryResponse } from "@/datas/ClientUI";
import { CollectionWrapper } from "@/datas/CollectionWrapper";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import PageConfigs from "@/utils/PageConfigs";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

const { Link, Text } = Typography;
const { useToken } = theme;

function CategoryMenu({
    setOpenedCategoryMenu,
}: {
    setOpenedCategoryMenu: Dispatch<SetStateAction<boolean>>;
}) {
    const route = useRouter();
    const { token } = useToken();
    const [searchValue, setSearchValue] = useState("");

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

    const handleAnchor = (path: string) => {
        setOpenedCategoryMenu(false);
        setTimeout(() => route.replace(path), 200);
    };

    // Function to filter categories based on search input
    const filterCategories = (categories: ClientCategoryResponse[]) => {
        if (!searchValue) return categories;

        const search = searchValue.toLowerCase();
        return categories.filter(
            (cat) =>
                cat.categoryName.toLowerCase().includes(search) ||
                cat.categoryChildren.some(
                    (child) =>
                        child.categoryName.toLowerCase().includes(search) ||
                        child.categoryChildren.some((grandchild) =>
                            grandchild.categoryName
                                .toLowerCase()
                                .includes(search),
                        ),
                ),
        );
    };

    if (isLoadingCategoryResponses) {
        return (
            <Card style={{ width: "100%" }}>
                <Input
                    placeholder="Tìm kiếm danh mục..."
                    prefix={<SearchOutlined />}
                    disabled
                    style={{ marginBottom: 16 }}
                />
                <Flex vertical gap="middle">
                    <Skeleton.Button active block style={{ height: 40 }} />
                    <Row gutter={[16, 16]}>
                        {Array(8)
                            .fill(0)
                            .map((_, i) => (
                                <Col span={6} key={i}>
                                    <Skeleton active paragraph={{ rows: 3 }} />
                                </Col>
                            ))}
                    </Row>
                </Flex>
            </Card>
        );
    }

    if (isErrorCategoryResponses || !categoryResponses?.content?.length) {
        return (
            <Card style={{ width: "100%", textAlign: "center" }}>
                <Empty
                    description="Không thể tải danh mục sản phẩm"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    const filteredCategories = filterCategories(categoryResponses.content);

    return (
        <Card
            style={{
                width: "100%",
                boxShadow: "0 6px 16px -8px rgba(0,0,0,0.08)",
                padding: 16,
            }}
        >
            <Input
                placeholder="Tìm kiếm danh mục..."
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                allowClear
                style={{ marginBottom: 16 }}
            />

            {filteredCategories.length === 0 ? (
                <Empty description="Không tìm thấy danh mục phù hợp" />
            ) : (
                <Tabs
                    type="card"
                    tabBarStyle={{ marginBottom: 16 }}
                    items={filteredCategories.map((firstCategory, index) => {
                        const FirstCategoryIcon =
                            PageConfigs.categorySlugIconMap[
                                firstCategory.categorySlug
                            ];

                        return {
                            key: String(index),
                            label: (
                                <Space size={4}>
                                    {FirstCategoryIcon && (
                                        <FirstCategoryIcon size={14} />
                                    )}
                                    <span>{firstCategory.categoryName}</span>
                                </Space>
                            ),
                            children: (
                                <div>
                                    <Flex
                                        align="center"
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Avatar
                                            size={48}
                                            icon={
                                                FirstCategoryIcon && (
                                                    <FirstCategoryIcon />
                                                )
                                            }
                                            style={{
                                                backgroundColor:
                                                    token.colorPrimary,
                                                color: token.colorPrimary,
                                            }}
                                        />
                                        <div style={{ marginLeft: 12 }}>
                                            <Link
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: 600,
                                                    color: token.colorPrimary,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}
                                                onClick={() =>
                                                    handleAnchor(
                                                        "/category/" +
                                                            firstCategory.categorySlug,
                                                    )
                                                }
                                            >
                                                {firstCategory.categoryName}
                                                <RightOutlined
                                                    style={{ fontSize: 12 }}
                                                />
                                            </Link>
                                            <Text type="secondary">
                                                {
                                                    firstCategory
                                                        .categoryChildren.length
                                                }{" "}
                                                danh mục con
                                            </Text>
                                        </div>
                                    </Flex>

                                    <div className="category-layout">
                                        <Row gutter={[16, 24]}>
                                            {firstCategory.categoryChildren.map(
                                                (secondCategory, idx) => (
                                                    <Col
                                                        xs={24}
                                                        sm={12}
                                                        md={8}
                                                        lg={6}
                                                        key={idx}
                                                    >
                                                        <div className="category-group">
                                                            <Link
                                                                className="category-parent"
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
                                                                {idx < 2 && (
                                                                    <Tag
                                                                        color="blue"
                                                                        style={{
                                                                            marginLeft: 4,
                                                                            fontSize: 10,
                                                                        }}
                                                                    >
                                                                        Phổ biến
                                                                    </Tag>
                                                                )}
                                                            </Link>

                                                            <Flex
                                                                vertical
                                                                className="category-children"
                                                                style={{
                                                                    flexWrap:
                                                                        "wrap",
                                                                }}
                                                            >
                                                                {secondCategory.categoryChildren
                                                                    .slice(0, 6)
                                                                    .map(
                                                                        (
                                                                            thirdCategory,
                                                                            i,
                                                                        ) => (
                                                                            <Link
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="category-child"
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
                                                                {secondCategory
                                                                    .categoryChildren
                                                                    .length >
                                                                    6 && (
                                                                    <Link
                                                                        className="category-child view-more"
                                                                        onClick={() =>
                                                                            handleAnchor(
                                                                                "/category/" +
                                                                                    secondCategory.categorySlug,
                                                                            )
                                                                        }
                                                                    >
                                                                        Xem
                                                                        thêm...
                                                                    </Link>
                                                                )}
                                                            </Flex>
                                                        </div>
                                                    </Col>
                                                ),
                                            )}
                                        </Row>
                                    </div>
                                </div>
                            ),
                        };
                    })}
                />
            )}
        </Card>
    );
}

// Thêm CSS vào global styles
const styles = `
.category-scroll::-webkit-scrollbar {
    width: 6px;
}

.category-scroll::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
}

.category-scroll::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 3px;
}

.category-scroll::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
}

.category-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.category-parent {
    font-weight: 600;
    color: #1677ff;
    display: flex;
    align-items: center;
    padding-bottom: 6px;
    border-bottom: 1px dashed #f0f0f0;
}

.category-children {
    gap: 8px;
}

.category-child {
    transition: all 0.2s;
    color: rgba(0, 0, 0, 0.65);
    line-height: 1.3;
    display: block;
}

.category-child:hover {
    color: #1677ff;
    transform: translateX(4px);
}
`;

// Inject styles
if (typeof document !== "undefined") {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
}

export default CategoryMenu;
