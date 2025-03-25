"use client";
import React from "react";
import { Row, Col, Space, Typography, Card } from "antd";
import { CarOutlined, HeartOutlined, StarOutlined } from "@ant-design/icons";
import ClientCarousel from "@/components/ClientCarousel";

const { Title, Text } = Typography;

// Định nghĩa styles
const styles = {
    carouselBox: {
        height: "100%",
        minHeight: 315,
    },
    gradient1: {
        background: "linear-gradient(105deg, #36CFC9 0%, #A0D911 100%)",
        height: "100%",
        minHeight: 315,
        borderRadius: "8px",
    },
    gradient2: {
        background: "linear-gradient(0deg, #FFA940 0%, #F5222D 100%)",
        height: "100%",
        minHeight: 315,
        borderRadius: "8px",
    },
    gradient3: {
        background: "linear-gradient(0deg, #2F54EB 0%, #13C2C2 100%)",
        height: "100%",
        minHeight: 315,
        borderRadius: "8px",
    },
    rightBannerCard: {
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
    },
    icon: {
        fontSize: 65,
    },
};

function ClientHomeBanner() {
    return (
        <Row gutter={16}>
            <Col xs={24} md={14} lg={16}>
                <ClientCarousel>
                    <div style={styles.gradient1}></div>
                    <div style={styles.gradient2}></div>
                    <div style={styles.gradient3}></div>
                </ClientCarousel>
            </Col>
            <Col xs={24} md={10} lg={8}>
                <Space direction="vertical" style={{ width: "100%" }} size={16}>
                    <Card
                        styles={{ body: { padding: 0 } }}
                        style={styles.rightBannerCard}
                    >
                        <Space align="start" style={{ padding: "12px 16px" }}>
                            <CarOutlined style={styles.icon} />
                            <Space direction="vertical" size={4}>
                                <Title level={5} style={{ marginBottom: 0 }}>
                                    Miễn phí vận chuyển
                                </Title>
                                <Text>
                                    100% đơn hàng đều được miễn phí vận chuyển
                                    khi thanh toán trước.
                                </Text>
                            </Space>
                        </Space>
                    </Card>

                    <Card
                        styles={{ body: { padding: 0 } }}
                        style={styles.rightBannerCard}
                    >
                        <Space align="start" style={{ padding: "12px 16px" }}>
                            <StarOutlined style={styles.icon} />
                            <Space direction="vertical" size={4}>
                                <Title level={5} style={{ marginBottom: 0 }}>
                                    Bảo hành tận tâm
                                </Title>
                                <Text>
                                    Bất kể giấy tờ thế nào, công ty luôn cam kết
                                    sẽ hỗ trợ khách hàng tới cùng.
                                </Text>
                            </Space>
                        </Space>
                    </Card>

                    <Card
                        styles={{ body: { padding: 0 } }}
                        style={styles.rightBannerCard}
                    >
                        <Space align="start" style={{ padding: "12px 16px" }}>
                            <HeartOutlined style={styles.icon} />
                            <Space direction="vertical" size={4}>
                                <Title level={5} style={{ marginBottom: 0 }}>
                                    Đổi trả 1-1 hoặc hoàn tiền
                                </Title>
                                <Text>
                                    Nếu phát sinh lỗi hoặc bạn cảm thấy sản phẩm
                                    chưa đáp ứng được nhu cầu.
                                </Text>
                            </Space>
                        </Space>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
}

export default ClientHomeBanner;
