"use client";
import React, { useState } from "react";
import {
    Breadcrumb,
    Card,
    Col,
    Layout,
    Row,
    Skeleton,
    Typography,
    notification,
    Input,
    Empty,
    Divider,
    Tooltip,
} from "antd";
import {
    AlertOutlined,
    SearchOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import ResourceURL from "@/constants/ResourceURL";
import { ClientCategoryResponse } from "@/datas/ClientUI";
import { CollectionWrapper } from "@/datas/CollectionWrapper";
import useTitle from "@/hooks/use-title";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import { useQuery } from "react-query";

const { Content } = Layout;
const { Title, Text, Link } = Typography;
const { Search } = Input;

function ClientAllCategories() {
    useTitle("Tất cả danh mục sản phẩm");
    const [searchTerm, setSearchTerm] = useState("");

    const [api, contextHolder] = notification.useNotification();

    const {
        data: categoryResponses,
        isLoading: isLoadingCategoryResponses,
        isError: isErrorCategoryResponses,
        refetch,
    } = useQuery<CollectionWrapper<ClientCategoryResponse>, ErrorMessage>(
        ["client-api", "categories", "getAllCategories"],
        () => FetchUtils.get(ResourceURL.CLIENT_CATEGORY),
        {
            onError: () =>
                api.error({
                    message: "Lỗi",
                    description: "Lấy dữ liệu danh mục không thành công",
                }),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        },
    );

    const handleSearch = (value: string) => {
        setSearchTerm(value.toLowerCase());
    };

    let resultFragment;

    if (isLoadingCategoryResponses) {
        resultFragment = (
            <Row gutter={[16, 16]}>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Col span={24} key={index}>
                            <Skeleton active />
                        </Col>
                    ))}
            </Row>
        );
    }

    if (isErrorCategoryResponses) {
        resultFragment = (
            <Card className="error-card">
                <div
                    style={{
                        textAlign: "center",
                        color: "#ff4d4f",
                        padding: "32px 0",
                    }}
                >
                    <AlertOutlined style={{ fontSize: 64 }} />
                    <div style={{ margin: "16px 0" }}>
                        <Text strong style={{ fontSize: 18 }}>
                            Đã có lỗi xảy ra khi tải danh mục
                        </Text>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </Card>
        );
    }

    if (categoryResponses) {
        const filteredCategories = categoryResponses.content.filter(
            (category) => {
                if (!searchTerm) return true;

                // Lọc danh mục cấp 1
                if (category.categoryName.toLowerCase().includes(searchTerm)) {
                    return true;
                }

                // Lọc danh mục cấp 2
                const hasMatchingChildren = category.categoryChildren.some(
                    (child) =>
                        child.categoryName.toLowerCase().includes(searchTerm),
                );

                // Lọc danh mục cấp 3
                const hasMatchingGrandchildren = category.categoryChildren.some(
                    (child) =>
                        child.categoryChildren.some((grandchild) =>
                            grandchild.categoryName
                                .toLowerCase()
                                .includes(searchTerm),
                        ),
                );

                return hasMatchingChildren || hasMatchingGrandchildren;
            },
        );

        if (filteredCategories.length === 0) {
            resultFragment = (
                <Card>
                    <Empty
                        description="Không tìm thấy danh mục phù hợp"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            );
        } else {
            resultFragment = filteredCategories.map((firstCategory, index) => {
                const FirstCategoryIcon =
                    PageConfigs.categorySlugIconMap[firstCategory.categorySlug];

                return (
                    <Card
                        key={index}
                        className="category-card mb-6 hover:shadow-md transition-shadow"
                        style={{ marginBottom: 24 }}
                    >
                        <Row
                            align="middle"
                            gutter={[16, 16]}
                            className="category-header"
                        >
                            <Col>
                                {FirstCategoryIcon && (
                                    <div className="category-icon p-2 bg-gray-100 rounded-full">
                                        <FirstCategoryIcon
                                            style={{
                                                fontSize: 32,
                                                color: "#ff4d4f",
                                            }}
                                        />
                                    </div>
                                )}
                            </Col>
                            <Col>
                                <Link
                                    href={
                                        "/category/" +
                                        firstCategory.categorySlug
                                    }
                                    className="category-title hover:text-primary transition-colors"
                                >
                                    <Title level={3} style={{ margin: 0 }}>
                                        {firstCategory.categoryName}
                                    </Title>
                                </Link>
                            </Col>
                            <Col flex="auto" style={{ textAlign: "right" }}>
                                <Tooltip title="Xem tất cả sản phẩm">
                                    <Link
                                        href={
                                            "/category/" +
                                            firstCategory.categorySlug
                                        }
                                        className="view-all-link"
                                    >
                                        Xem tất cả <ArrowRightOutlined />
                                    </Link>
                                </Tooltip>
                            </Col>
                        </Row>

                        <Divider style={{ margin: "12px 0" }} />

                        <Row gutter={[24, 24]} className="category-content">
                            {firstCategory.categoryChildren.map(
                                (secondCategory, index) => (
                                    <Col
                                        xs={24}
                                        sm={12}
                                        md={8}
                                        lg={6}
                                        key={index}
                                    >
                                        <div className="subcategory-group p-4 bg-gray-50 rounded-lg h-full">
                                            <Link
                                                href={
                                                    "/category/" +
                                                    secondCategory.categorySlug
                                                }
                                                className="subcategory-title"
                                            >
                                                <Text
                                                    strong
                                                    style={{
                                                        color: "#ff4d4f",
                                                        fontSize: "16px",
                                                    }}
                                                >
                                                    {
                                                        secondCategory.categoryName
                                                    }
                                                </Text>
                                            </Link>
                                            <div className="third-level-categories mt-2">
                                                {secondCategory.categoryChildren.map(
                                                    (thirdCategory, index) => (
                                                        <div
                                                            key={index}
                                                            className="third-category-item py-1"
                                                        >
                                                            <Link
                                                                href={
                                                                    "/category/" +
                                                                    thirdCategory.categorySlug
                                                                }
                                                                className="third-category-link hover:text-primary hover:underline"
                                                            >
                                                                {
                                                                    thirdCategory.categoryName
                                                                }
                                                            </Link>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                ),
                            )}
                        </Row>
                    </Card>
                );
            });
        }
    }

    return (
        <Layout>
            {contextHolder}
            <Content className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <Card className="page-header-card">
                        <Breadcrumb
                            items={[
                                {
                                    title: <Link href="/">Trang chủ</Link>,
                                },
                                {
                                    title: "Tất cả danh mục sản phẩm",
                                },
                            ]}
                            className="mb-4"
                        />
                        <Row
                            align="middle"
                            justify="space-between"
                            gutter={[16, 16]}
                        >
                            <Col xs={24} md={12}>
                                <Title level={2} style={{ margin: 0 }}>
                                    Tất cả danh mục sản phẩm
                                </Title>
                            </Col>
                            <Col xs={24} md={12} style={{ textAlign: "right" }}>
                                <Search
                                    placeholder="Tìm kiếm danh mục..."
                                    onSearch={handleSearch}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    style={{ maxWidth: "400px", width: "100%" }}
                                    allowClear
                                    prefix={<SearchOutlined />}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className="categories-container">{resultFragment}</div>
            </Content>
        </Layout>
    );
}

export default ClientAllCategories;
