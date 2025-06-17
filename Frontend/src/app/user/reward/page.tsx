"use client";
import React, { useEffect } from "react";
import {
    Badge,
    Card,
    Col,
    Row,
    Skeleton,
    Space,
    Typography,
    Layout,
    Avatar,
    Spin,
} from "antd";
import {
    ExclamationCircleOutlined,
    TrophyOutlined,
    BarcodeOutlined,
    StarOutlined,
} from "@ant-design/icons";

import useTitle from "@/hooks/use-title";

import { RewardType } from "@/models/RewardStrategy";
import DateUtils from "@/utils/DateUtils";
import { useQuery } from "@tanstack/react-query";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import ResourceURL from "@/constants/ResourceURL";
import NotifyUtils from "@/utils/NotifyUtils";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import { ClientRewardResponse } from "@/datas/ClientUI";

const { Text, Title } = Typography;

type RewardLogInfo = {
    icon: React.ReactNode;
    color: string;
};

const rewardLogInfoMap: Record<RewardType, RewardLogInfo> = {
    [RewardType.SUCCESS_ORDER]: {
        icon: <BarcodeOutlined />,
        color: "#1890ff",
    },
    [RewardType.ADD_REVIEW]: {
        icon: <StarOutlined />,
        color: "#faad14",
    },
};

function ClientReward() {
    useTitle();

    const { rewardResponse, isLoadingRewardResponse, isErrorRewardResponse } =
        useGetRewardApi();

    let rewardContentFragment;

    if (isLoadingRewardResponse) {
        rewardContentFragment = (
            <Space direction="vertical" style={{ width: "100%" }}>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} active />
                    ))}
            </Space>
        );
    }

    if (isErrorRewardResponse) {
        rewardContentFragment = (
            <Space
                direction="vertical"
                align="center"
                style={{ margin: "24px 0", color: "#ff4d4f" }}
            >
                <ExclamationCircleOutlined style={{ fontSize: 125 }} />
                <Text style={{ fontSize: 20, fontWeight: 500 }}>
                    Đã có lỗi xảy ra
                </Text>
            </Space>
        );
    }

    if (rewardResponse) {
        const reward = rewardResponse as unknown as {
            rewardTotalScore: number;
            rewardLogs: Array<{
                rewardLogId: string;
                rewardLogType: RewardType;
                rewardLogScore: number;
                rewardLogNote: string;
                rewardLogCreatedAt: string;
            }>;
        };

        rewardContentFragment = (
            <>
                <Space
                    align="center"
                    style={{ width: "100%", justifyContent: "space-between" }}
                >
                    <TrophyOutlined
                        style={{ fontSize: 85, color: "#722ed1" }}
                    />
                    <Space direction="vertical" align="center">
                        <Text style={{ color: "#722ed1", fontWeight: 500 }}>
                            Tổng điểm thưởng tích lũy của bạn là
                        </Text>
                        <Badge
                            count={reward.rewardTotalScore}
                            style={{
                                backgroundColor: "#722ed1",
                                fontSize: 16,
                                padding: "5px 10px",
                            }}
                        />
                    </Space>
                    <TrophyOutlined
                        style={{ fontSize: 85, color: "#722ed1" }}
                    />
                </Space>

                <Card
                    style={{
                        backgroundColor: "#f5f5f5",
                        borderRadius: 8,
                    }}
                >
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                    >
                        <Text type="secondary" style={{ fontWeight: 500 }}>
                            Lịch sử nhận điểm thưởng
                        </Text>

                        <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                        >
                            {reward.rewardLogs.map((rewardLog) => {
                                const rewardLogInfo =
                                    rewardLogInfoMap[rewardLog.rewardLogType];

                                return (
                                    <Space
                                        key={rewardLog.rewardLogId}
                                        style={{ flexWrap: "nowrap" }}
                                    >
                                        <Avatar
                                            size="small"
                                            style={{
                                                backgroundColor:
                                                    rewardLogInfo.color,
                                            }}
                                            icon={rewardLogInfo.icon}
                                        />
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            {DateUtils.isoDateToString(
                                                rewardLog.rewardLogCreatedAt,
                                            )}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: "#1890ff",
                                                fontWeight: 500,
                                            }}
                                        >
                                            +{rewardLog.rewardLogScore}
                                        </Text>
                                        <Text style={{ fontSize: 12 }}>
                                            {rewardLog.rewardLogNote}
                                        </Text>
                                    </Space>
                                );
                            })}
                        </Space>
                    </Space>
                </Card>
            </>
        );
    }

    return (
        <Layout.Content style={{ padding: "24px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Row gutter={[24, 24]}>
                    <Col md={6}>
                        <ClientUserNavbar />
                    </Col>

                    <Col md={18}>
                        <Card style={{ borderRadius: 8 }}>
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <Title level={2}>Điểm thưởng</Title>

                                {rewardContentFragment}
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Layout.Content>
    );
}

function useGetRewardApi() {
    const {
        data: rewardResponse,
        isLoading: isLoadingRewardResponse,
        isError: isErrorRewardResponse,
    } = useQuery<ClientRewardResponse, ErrorMessage>({
        queryKey: ["client-api", "rewards", "getReward"],
        queryFn: () => FetchUtils.getWithToken(ResourceURL.CLIENT_REWARD),
        placeholderData: (previousData) => previousData,
    });

    useEffect(() => {
        if (isErrorRewardResponse) {
            NotifyUtils.simpleFailed("Lấy dữ liệu không thành công");
        }
    }, [isErrorRewardResponse]);

    return { rewardResponse, isLoadingRewardResponse, isErrorRewardResponse };
}

export default ClientReward;
