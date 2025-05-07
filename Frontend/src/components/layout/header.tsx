"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import {
    Layout,
    Input,
    Button,
    Dropdown,
    Badge,
    Typography,
    Tooltip,
    Row,
    Col,
    Popover,
    MenuProps,
    AutoComplete,
    Avatar,
    Spin,
    Empty,
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
import { debounce } from "lodash";
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
import { useQuery } from "@tanstack/react-query";
import CategoryMenu from "./CategoryMenu";
import OsirisLogo from "../OsirisLogo";

import useAdminAuthStore from "@/stores/use-admin-auth-store";
import DefaultHeader from "./DefaultHeader";

const { Header } = Layout;
const { Text } = Typography;

function SearchComponent() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useMemo(
        () =>
            debounce(async (value: string) => {
                if (!value || value.length < 2) {
                    setSearchResults([]);
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);
                try {
                    const response = (await FetchUtils.get(
                        ResourceURL.CLIENT_PRODUCT,
                        {
                            q: value,
                            limit: 6,
                            page: 1,
                        },
                    )) as { content: any[] };

                    if (response && response.content) {
                        setSearchResults(response.content);
                    } else {
                        setSearchResults([]);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                    setSearchResults([]);
                } finally {
                    setIsLoading(false);
                }
            }, 500),
        [],
    );

    useEffect(() => {
        debouncedSearch(searchValue);

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchValue, debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (value: string, option: any) => {
        if (option.productSlug) {
            router.push(`/product/${option.productSlug}`);
        }
        setShowResults(false);
    };

    const handleSearch = (value: string) => {
        if (value.trim()) {
            router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }
        setShowResults(false);
    };

    // Tối ưu hóa hiệu suất bằng cách tạo options thông qua useMemo
    const options = useMemo(
        () =>
            searchResults.map((product) => ({
                value: product.productName,
                label: (
                    <div className="flex items-center gap-3 py-2">
                        <Avatar
                            size={40}
                            shape="square"
                            src={
                                product.productThumbnail || product.productImage
                            }
                            alt={product.productName}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1">
                                {product.productName}
                            </div>
                            {/* <div className="text-blue-600 font-medium">
                                {MiscUtils.formatCurrency(product.productPrice)}
                            </div> */}
                        </div>
                    </div>
                ),
                productSlug: product.productSlug,
            })),
        [searchResults],
    );

    return (
        <div className="relative w-full" ref={searchRef}>
            <AutoComplete
                className="w-full"
                value={searchValue}
                onChange={setSearchValue}
                onSelect={handleSelect}
                options={options}
                onFocus={() => setShowResults(true)}
                open={showResults && searchValue.length >= 2}
                notFoundContent={
                    isLoading ? (
                        <div className="py-6 text-center">
                            <Spin size="small" />
                            <div className="mt-2 text-sm text-gray-500">
                                Đang tìm kiếm...
                            </div>
                        </div>
                    ) : searchValue.length >= 2 ? (
                        <Empty
                            description="Không tìm thấy sản phẩm phù hợp"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            className="py-4"
                        />
                    ) : null
                }
                popupClassName="search-results-dropdown"
                getPopupContainer={(trigger) =>
                    trigger.parentNode as HTMLElement
                }
            >
                <Input.Search
                    placeholder="Bạn tìm gì..."
                    enterButton
                    allowClear
                    size="large"
                    onSearch={handleSearch}
                />
            </AutoComplete>

            {/* Link xem tất cả kết quả */}
            {showResults &&
                searchValue.length >= 2 &&
                searchResults.length > 0 && (
                    <div className="absolute bottom-0 right-0 transform translate-y-full bg-white border-t w-full p-2 text-right z-10 shadow-sm">
                        <Link
                            href={`/search?q=${encodeURIComponent(
                                searchValue.trim(),
                            )}`}
                            className="text-blue-600 hover:underline text-sm px-3"
                            onClick={() => setShowResults(false)}
                        >
                            Xem tất cả {searchResults.length}+ kết quả
                        </Link>
                    </div>
                )}
        </div>
    );
}

function HeaderSection() {
    const router = useRouter();
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerWidth, setHeaderWidth] = useState(0);
    const pathName = usePathname();
    if (pathName.startsWith("/admin")) {
        return <DefaultHeader></DefaultHeader>;
    }

    if (pathName.startsWith("/payment")) {
        return null;
    }

    useEffect(() => {
        if (headerRef.current) {
            setHeaderWidth(headerRef.current.offsetWidth);
        }
    }, []);

    const [openedCategoryMenu, setOpenedCategoryMenu] = useState(false);

    const { user, resetAuthState, currentTotalCartItems } = useAuthStore();

    useNotificationEvents();

    const { newNotifications } = useClientSiteStore();

    const [disabledNotificationIndicator, setDisabledNotificationIndicator] =
        useState(true);

    useEffect(() => {
        if (newNotifications.length > 0) {
            setDisabledNotificationIndicator(false);
        }
    }, [newNotifications.length]);

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
                padding: "0",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                paddingBottom: 24,
                height: "auto",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <div
                className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
                ref={headerRef}
            >
                <Row
                    align="middle"
                    className="py-4"
                    justify="space-between"
                    gutter={[16, 0]}
                >
                    <Col
                        xs={24}
                        sm={6}
                        md={5}
                        lg={4}
                        onClick={() => router.replace("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <OsirisLogo></OsirisLogo>
                    </Col>
                    <Col
                        xs={24}
                        sm={12}
                        md={12}
                        lg={10}
                        className="order-3 mt-4 sm:order-2 sm:mt-0"
                    >
                        <SearchComponent />
                    </Col>
                    <Col
                        xs={24}
                        sm={6}
                        md={7}
                        lg={10}
                        className="order-2 sm:order-3"
                    >
                        <Row justify="end" gutter={[12, 8]} align="middle">
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
                                                    className="flex items-center"
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
                                                        className="flex items-center justify-center"
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
                                                    className="flex items-center justify-center"
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
                                            className="flex items-center justify-center"
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
                                        className="flex items-center justify-center"
                                    />
                                </Dropdown>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="mb-3 flex flex-wrap items-center justify-between">
                    <Col xs={24} sm={14} md={16}>
                        <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0">
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
                                <Button
                                    icon={<MenuOutlined />}
                                    className="flex items-center"
                                >
                                    Danh mục sản phẩm
                                </Button>
                            </Popover>
                            <Button type="link" className="px-2">
                                Sản phẩm mới
                            </Button>
                            <Button
                                type="link"
                                style={{ color: "green" }}
                                className="px-2"
                            >
                                Sản phẩm xu hướng
                            </Button>
                            <Button
                                type="link"
                                style={{ color: "#eb2f96" }}
                                className="px-2"
                            >
                                Khuyến mại
                            </Button>
                        </div>
                    </Col>
                    <Col
                        xs={24}
                        sm={10}
                        md={8}
                        className="text-left sm:text-right"
                    >
                        <div className="flex items-center justify-start sm:justify-end">
                            <Badge
                                count="Hot"
                                style={{ backgroundColor: "#eb2f96" }}
                            />
                            <Text type="secondary" className="ml-2">
                                Miễn phí giao hàng cho đơn hàng trên 1 triệu
                                đồng
                            </Text>
                        </div>
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

    const { data } = useQuery({
        queryKey: [
            "client-api",
            "notifications/init-events",
            "initNotificationEvents",
        ],
        queryFn: () =>
            FetchUtils.getWithToken(
                ResourceURL.CLIENT_NOTIFICATION_INIT_EVENTS,
            ),
        refetchOnWindowFocus: false,
        enabled: !!user && typeof window !== "undefined",
    });

    useEffect(() => {
        if (!data || typeof window === "undefined") return;

        try {
            const response = data as EventInitiationResponse;
            const eventSource = new EventSource(
                `${ResourceURL.CLIENT_NOTIFICATION_EVENTS}?eventSourceUuid=${response.eventSourceUuid}`,
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

            return () => {
                eventSource.close();
            };
        } catch (error) {
            console.error("Failed to initialize EventSource:", error);
            NotifyUtils.simpleFailed("Lấy dữ liệu không thành công");
        }
    }, [data, pushNewNotification]);

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);
}

export default HeaderSection;

const styles = `
.search-results-dropdown {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
  width: 100%;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  border-radius: 0 0 4px 4px;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ant-select-item {
  padding: 4px 8px !important;
}

.ant-select-item-option-content {
  width: 100%;
}
`;

if (typeof document !== "undefined") {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
}
