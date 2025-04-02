"use client";
import React from "react";
import { Button, Card, Row, Col, Space, Typography, theme } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";

import PageConfigs from "@/utils/PageConfigs";
import MockUtils from "@/utils/MockUtils";

function ClientHomeFeaturedCategories() {
    const { token } = theme.useToken();

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography.Title level={2}>
                    <Typography.Text style={{ color: "orange" }}>
                        Danh mục nổi bật
                    </Typography.Text>
                </Typography.Title>
                <Button
                    href="/all-categories"
                    type="default"
                    icon={<UnorderedListOutlined />}
                    style={{ borderRadius: "8px" }}
                >
                    Xem tất cả
                </Button>
            </div>
            <Row gutter={[16, 16]}>
                {MockUtils.featuredCategories.map((category) => {
                    const CategoryIcon =
                        PageConfigs.categorySlugIconMap[category.categorySlug];

                    return (
                        <Col
                            key={category.categorySlug}
                            xs={12}
                            sm={8}
                            md={6}
                            lg={6}
                        >
                            <a href={"/category/" + category.categorySlug}>
                                <Card
                                    style={{
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        transition: "all 0.3s",
                                    }}
                                    hoverable
                                    onClick={() => {}}
                                >
                                    <Space>
                                        <CategoryIcon
                                            size={50}
                                            strokeWidth={1}
                                        />
                                        <Typography.Text>
                                            {category.categoryName}
                                        </Typography.Text>
                                    </Space>
                                </Card>
                            </a>
                        </Col>
                    );
                })}
            </Row>
        </Space>
    );
}

export default ClientHomeFeaturedCategories;
