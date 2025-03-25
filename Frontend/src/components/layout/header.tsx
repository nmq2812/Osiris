"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Layout,
    Input,
    Space,
    Button,
    Dropdown,
    Badge,
    Typography,
    Tooltip,
    Row,
    Col,
    Popover,
    MenuProps,
} from "antd";
import {
    BellOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    LoginOutlined,
    HeartOutlined,
    TrophyOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    StarOutlined,
    FileOutlined,
    MenuOutlined,
    IdcardOutlined,
} from "@ant-design/icons";
import ResourceURL from "@/constants/ResourceURL";
import {
    EventInitiationResponse,
    NotificationResponse,
} from "@/models/Notification";
import { useAuthStore } from "@/stores/authStore";
import useClientSiteStore from "@/stores/use-client-site-store";
import FetchUtils from "@/utils/FetchUtils";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useQuery } from "react-query";
import CategoryMenu from "./CategoryMenu";

const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;

function HeaderSection() {
    const router = useRouter();
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerWidth, setHeaderWidth] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderWidth(headerRef.current.offsetWidth);
        }
    }, []);

    const [openedCategoryMenu, setOpenedCategoryMenu] = useState(false);

    const { user, resetAuthState, currentTotalCartItems } = useAuthStore();

    // Search state & function
    const [search, setSearch] = useState("");

    useNotificationEvents();

    const { newNotifications } = useClientSiteStore();

    const [disabledNotificationIndicator, setDisabledNotificationIndicator] =
        useState(true);

    useEffect(() => {
        if (newNotifications.length > 0) {
            setDisabledNotificationIndicator(false);
        }
    }, [newNotifications.length]);

    const handleSearch = (value: string) => {
        if (value.trim() !== "") {
            router.replace("/search?q=" + value.trim());
        }
    };

    const handleSignoutMenu = () => {
        if (user) {
            resetAuthState();
            NotifyUtils.simpleSuccess("Đăng xuất thành công");
        }
    };

    const handleNotificationButton = () => {
        if (user) {
            setDisabledNotificationIndicator(true);
            router.replace("/user/notification");
        } else {
            NotifyUtils.simple("Vui lòng đăng nhập để sử dụng chức năng");
        }
    };

    const userMenu: MenuProps["items"] = user
        ? [
              {
                  key: "account",
                  icon: <UserOutlined />,
                  label: <Link href="/user">Tài khoản</Link>,
              },
              {
                  key: "settings",
                  icon: <SettingOutlined />,
                  label: <Link href="/user/setting">Thiết đặt</Link>,
              },
              {
                  key: "reviews",
                  icon: <StarOutlined />,
                  label: <Link href="/user/review">Đánh giá sản phẩm</Link>,
              },
              {
                  key: "wishlist",
                  icon: <HeartOutlined />,
                  label: <Link href="/user/wishlist">Sản phẩm yêu thích</Link>,
              },
              {
                  key: "rewards",
                  icon: <TrophyOutlined />,
                  label: <Link href="/user/reward">Điểm thưởng</Link>,
              },
              {
                  key: "preorders",
                  icon: <ClockCircleOutlined />,
                  label: <Link href="/user/preorder">Đặt trước sản phẩm</Link>,
              },
              {
                  key: "chat",
                  icon: <MessageOutlined />,
                  label: <Link href="/user/chat">Yêu cầu tư vấn</Link>,
              },
              { type: "divider" },
              {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Đăng xuất",
                  danger: true,
                  onClick: handleSignoutMenu,
              },
          ]
        : [
              {
                  key: "login",
                  icon: <LoginOutlined />,
                  label: <Link href="/signin">Đăng nhập</Link>,
              },
              {
                  key: "register",
                  icon: <IdcardOutlined />,
                  label: <Link href="/signup">Đăng ký</Link>,
              },
          ];

    return (
        <Header
            style={{
                background: "#fff",
                padding: "0 10rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                marginBottom: 24,
                height: "fit-content",
            }}
        >
            <div className="container" ref={headerRef}>
                <Row align="middle" style={{ height: 64 }}>
                    <Col span={4}>
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="Osiris Logo"
                                width={40}
                                height={40}
                                className="mr-2"
                            />
                            <span className="text-2xl font-bold text-blue-600">
                                OSIRIS
                            </span>
                        </Link>
                    </Col>
                    <Col span={10}>
                        <Search
                            placeholder="Bạn tìm gì..."
                            allowClear
                            enterButton
                            size="large"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onSearch={handleSearch}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col span={10}>
                        <Row justify="end" gutter={16}>
                            {user && (
                                <>
                                    <Col>
                                        <Tooltip title="Giỏ hàng">
                                            <Link href="/cart">
                                                <Badge
                                                    count={
                                                        currentTotalCartItems
                                                    }
                                                    overflowCount={99}
                                                >
                                                    <Button
                                                        type="text"
                                                        icon={
                                                            <ShoppingCartOutlined
                                                                style={{
                                                                    fontSize:
                                                                        "20px",
                                                                }}
                                                            />
                                                        }
                                                        size="large"
                                                    />
                                                </Badge>
                                            </Link>
                                        </Tooltip>
                                    </Col>
                                    <Col>
                                        <Tooltip title="Đơn hàng">
                                            <Link href="/order">
                                                <Button
                                                    type="text"
                                                    icon={
                                                        <FileOutlined
                                                            style={{
                                                                fontSize:
                                                                    "20px",
                                                            }}
                                                        />
                                                    }
                                                    size="large"
                                                />
                                            </Link>
                                        </Tooltip>
                                    </Col>
                                </>
                            )}
                            <Col>
                                <Tooltip title="Thông báo">
                                    <Badge
                                        dot={!disabledNotificationIndicator}
                                        offset={[-2, 2]}
                                    >
                                        <Button
                                            type="text"
                                            icon={
                                                <BellOutlined
                                                    style={{ fontSize: "20px" }}
                                                />
                                            }
                                            onClick={handleNotificationButton}
                                            size="large"
                                        />
                                    </Badge>
                                </Tooltip>
                            </Col>
                            <Col>
                                <Dropdown
                                    menu={{ items: userMenu }}
                                    placement="bottomRight"
                                    arrow
                                >
                                    <Button
                                        type="text"
                                        icon={
                                            <UserOutlined
                                                style={{
                                                    fontSize: "20px",
                                                    color: user
                                                        ? "#1890ff"
                                                        : undefined,
                                                }}
                                            />
                                        }
                                        size="large"
                                    />
                                </Dropdown>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: 12, marginBottom: 12 }}>
                    <Col>
                        <Space size="small">
                            <Popover
                                open={openedCategoryMenu}
                                onOpenChange={setOpenedCategoryMenu}
                                content={
                                    <CategoryMenu
                                        setOpenedCategoryMenu={
                                            setOpenedCategoryMenu
                                        }
                                    />
                                }
                                placement="bottomLeft"
                                trigger="click"
                                overlayStyle={{ width: headerWidth }}
                            >
                                <Button icon={<MenuOutlined />}>
                                    Danh mục sản phẩm
                                </Button>
                            </Popover>
                            <Button type="link">Sản phẩm mới</Button>
                            <Button type="link" style={{ color: "green" }}>
                                Sản phẩm xu hướng
                            </Button>
                            <Button type="link" style={{ color: "#eb2f96" }}>
                                Khuyến mại
                            </Button>
                        </Space>
                    </Col>
                    <Col flex="auto" style={{ textAlign: "right" }}>
                        <Space>
                            <Badge
                                count="Hot"
                                style={{ backgroundColor: "#eb2f96" }}
                            />
                            <Text type="secondary">
                                Miễn phí giao hàng cho đơn hàng trên 1 triệu
                                đồng
                            </Text>
                        </Space>
                    </Col>
                </Row>
            </div>
        </Header>
    );
}

function useNotificationEvents() {
    const { user } = useAuthStore();
    const eventSourceRef = useRef<EventSource | null>(null);
    const { pushNewNotification } = useClientSiteStore();

    useQuery(
        ["client-api", "notifications/init-events", "initNotificationEvents"],
        () =>
            FetchUtils.getWithToken(
                ResourceURL.CLIENT_NOTIFICATION_INIT_EVENTS,
            ),
        {
            onSuccess: (response) => {
                if (typeof window !== "undefined") {
                    try {
                        const eventSource = new EventSource(
                            `${
                                ResourceURL.CLIENT_NOTIFICATION_EVENTS
                            }?eventSourceUuid=${
                                (response as EventInitiationResponse)
                                    .eventSourceUuid
                            }`,
                        );

                        eventSource.onopen = () =>
                            MiscUtils.console.log(
                                "Opening EventSource of Notifications...",
                            );

                        eventSource.onerror = () =>
                            MiscUtils.console.error(
                                "Encountered error with Notifications EventSource!",
                            );

                        eventSource.onmessage = (event) => {
                            const notificationResponse = JSON.parse(
                                event.data,
                            ) as NotificationResponse;
                            pushNewNotification(notificationResponse);
                        };

                        eventSourceRef.current = eventSource;
                    } catch (error) {
                        console.error(
                            "Failed to initialize EventSource:",
                            error,
                        );
                    }
                }
            },
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
            enabled: !!user && typeof window !== "undefined",
        },
    );

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);
}

export default HeaderSection;
