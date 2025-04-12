"use client";
import React, { useState } from "react";
import {
    Badge,
    Button,
    Card,
    Row,
    Col,
    Space,
    Typography,
    Skeleton,
    Pagination,
    theme,
    Flex,
    Avatar,
} from "antd";
import {
    BellOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    FileTextOutlined,
    PayCircleOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import useTitle from "@/hooks/use-title";
import ApplicationConstants from "@/constants/ApplicationConstants";
import FetchUtils, { ErrorMessage, ListResponse } from "@/utils/FetchUtils";
import ResourceURL from "@/constants/ResourceURL";
import NotifyUtils from "@/utils/NotifyUtils";
import {
    NotificationRequest,
    NotificationResponse,
    NotificationType,
} from "@/models/Notification";
import DateUtils from "@/utils/DateUtils";
import { useAuthStore } from "@/stores/authStore";
import useClientSiteStore from "@/stores/use-client-site-store";
import dayjs from "dayjs";

const { Title, Text, Link: AntLink } = Typography;
const { useToken } = theme;

function ClientNotification() {
    useTitle("Thông báo");
    const { token } = useToken();
    const [activePage, setActivePage] = useState(1);

    const {
        notificationResponses,
        isLoadingNotificationResponses,
        isErrorNotificationResponses,
    } = useGetAllNotificationsApi(activePage);

    const notifications =
        notificationResponses as ListResponse<NotificationResponse>;

    let notificationContentFragment;

    if (isLoadingNotificationResponses) {
        notificationContentFragment = (
            <Space direction="vertical" style={{ width: "100%" }}>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} active paragraph={{ rows: 1 }} />
                    ))}
            </Space>
        );
    } else if (isErrorNotificationResponses) {
        notificationContentFragment = (
            <Space
                direction="vertical"
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: `${token.marginXL}px 0`,
                    color: token.colorError,
                    width: "100%",
                }}
            >
                <ExclamationCircleOutlined style={{ fontSize: 80 }} />
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                    Đã có lỗi xảy ra
                </Text>
            </Space>
        );
    } else if (notifications && notifications.totalElements === 0) {
        notificationContentFragment = (
            <Space
                direction="vertical"
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: `${token.marginXL}px 0`,
                    color: token.colorPrimary,
                    width: "100%",
                }}
            >
                <InfoCircleOutlined style={{ fontSize: 80 }} />
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                    Chưa có thông báo nào
                </Text>
            </Space>
        );
    } else if (notifications && notifications.totalElements > 0) {
        notificationContentFragment = (
            <>
                <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                >
                    {notifications.content.map((notification) => (
                        <ClientNotificationCard
                            key={notification.id}
                            notification={notification}
                        />
                    ))}
                </Space>

                <Flex
                    justify="space-between"
                    align="center"
                    style={{ marginTop: 24 }}
                >
                    <Pagination
                        current={activePage}
                        total={notifications.totalElements}
                        pageSize={
                            ApplicationConstants.DEFAULT_CLIENT_NOTIFICATION_PAGE_SIZE
                        }
                        onChange={(page) =>
                            page !== activePage && setActivePage(page)
                        }
                        showSizeChanger={false}
                    />
                    <Text>
                        <Text strong>Trang {activePage}</Text>
                        <span> / {notifications.totalPages}</span>
                    </Text>
                </Flex>
            </>
        );
    }

    return (
        <main>
            <div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <ClientUserNavbar />
                    </Col>

                    <Col xs={24} md={18}>
                        <Card
                            bordered={false}
                            style={{ borderRadius: token.borderRadiusLG }}
                        >
                            <Space
                                direction="vertical"
                                size="large"
                                style={{ width: "100%" }}
                            >
                                <Title level={2}>Thông báo</Title>
                                {notificationContentFragment}
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </main>
    );
}

// Map notification types to their respective icons and colors
interface NotificationIconConfig {
    icon: React.ReactNode;
    color: string;
}

const notificationIconMap: Record<NotificationType, NotificationIconConfig> = {
    [NotificationType.GENERAL]: {
        icon: <BellOutlined />,
        color: "blue",
    },
    [NotificationType.ERROR]: {
        icon: <ExclamationCircleOutlined />,
        color: "red",
    },
    [NotificationType.WARNING]: {
        icon: <WarningOutlined />,
        color: "gold",
    },
    [NotificationType.PREORDER]: {
        icon: <ClockCircleOutlined />,
        color: "cyan",
    },
    [NotificationType.REVIEW]: {
        icon: <MessageOutlined />,
        color: "purple",
    },
    [NotificationType.ORDER]: {
        icon: <FileTextOutlined />,
        color: "geekblue",
    },
    [NotificationType.CHECKOUT_PAYPAL_SUCCESS]: {
        icon: <PayCircleOutlined />,
        color: "cyan",
    },
    [NotificationType.CHECKOUT_PAYPAL_CANCEL]: {
        icon: <PayCircleOutlined />,
        color: "magenta",
    },
};

function ClientNotificationCard({
    notification,
}: {
    notification: NotificationResponse;
}) {
    const { token } = useToken();
    const updateNotificationApi = useUpdateNotificationApi(notification.id);
    const { user } = useAuthStore();

    const handleMarkAsReadButton = () => {
        if (user) {
            const notificationRequest: NotificationRequest = {
                userId: user.id,
                type: notification.type,
                message: notification.message,
                anchor: notification.anchor,
                status: 2,
            };

            updateNotificationApi.mutate(notificationRequest);
        }
    };

    const isRecent = dayjs().diff(notification.createdAt, "minute") <= 5;
    const iconConfig = notificationIconMap[notification.type];

    // Background color based on status and recency
    const backgroundColor =
        notification.status === 1
            ? isRecent
                ? token.colorWarningBg
                : token.colorInfoBg
            : token.colorBgContainerDisabled;

    return (
        <Card
            bodyStyle={{
                padding: "10px 16px",
                backgroundColor,
            }}
            style={{
                borderRadius: token.borderRadiusLG,
                border:
                    notification.status === 1
                        ? `1px solid ${
                              isRecent ? token.colorWarning : token.colorPrimary
                          }`
                        : undefined,
            }}
        >
            <Flex justify="space-between" align="center">
                <Flex align="center" gap={12}>
                    <Avatar
                        style={{ backgroundColor: token.colorPrimaryBg }}
                        icon={iconConfig.icon}
                        size="large"
                    />
                    <Space direction="vertical" size={4}>
                        <Flex align="center" gap={8}>
                            {notification.status === 1 && (
                                <Badge
                                    color={
                                        isRecent
                                            ? token.colorWarning
                                            : token.colorPrimary
                                    }
                                    style={{ display: "inline-block" }}
                                />
                            )}
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                {DateUtils.isoDateToString(
                                    notification.createdAt,
                                )}
                            </Text>
                        </Flex>
                        <Text>
                            {notification.message}
                            {notification.anchor && (
                                <Link
                                    href={notification.anchor}
                                    passHref
                                    legacyBehavior
                                >
                                    <AntLink style={{ marginLeft: 5 }}>
                                        Chi tiết
                                    </AntLink>
                                </Link>
                            )}
                        </Text>
                    </Space>
                </Flex>

                {notification.status === 1 && (
                    <Button
                        type={isRecent ? "primary" : "default"}
                        style={
                            isRecent
                                ? {
                                      backgroundColor: token.colorWarning,
                                      borderColor: token.colorWarning,
                                  }
                                : {
                                      borderColor: token.colorPrimary,
                                      color: token.colorPrimary,
                                  }
                        }
                        size="small"
                        onClick={handleMarkAsReadButton}
                    >
                        Đánh dấu đã đọc
                    </Button>
                )}
            </Flex>
        </Card>
    );
}

function useGetAllNotificationsApi(activePage: number) {
    const requestParams = {
        page: activePage,
        size: ApplicationConstants.DEFAULT_CLIENT_NOTIFICATION_PAGE_SIZE,
    };

    const { newNotifications } = useClientSiteStore();

    const {
        data: notificationResponses,
        isLoading: isLoadingNotificationResponses,
        isError: isErrorNotificationResponses,
    } = useQuery<ListResponse<NotificationResponse>, ErrorMessage>(
        [
            "client-api",
            "notifications",
            "getAllNotifications",
            requestParams,
            newNotifications.length,
        ],
        () =>
            FetchUtils.getWithToken(
                ResourceURL.CLIENT_NOTIFICATION,
                requestParams,
            ),
        {
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        },
    );

    return {
        notificationResponses,
        isLoadingNotificationResponses,
        isErrorNotificationResponses,
    };
}

function useUpdateNotificationApi(id: number) {
    const queryClient = useQueryClient();

    return useMutation<NotificationResponse, ErrorMessage, NotificationRequest>(
        (requestBody) =>
            FetchUtils.putWithToken(
                ResourceURL.CLIENT_NOTIFICATION + "/" + id,
                requestBody,
            ),
        {
            onSuccess: () =>
                queryClient.invalidateQueries([
                    "client-api",
                    "notifications",
                    "getAllNotifications",
                ]),
            onError: () =>
                NotifyUtils.simpleFailed("Cập nhật không thành công"),
        },
    );
}

export default ClientNotification;
