"use client";
import React, { useState } from "react";
import {
    Button,
    Card,
    Row,
    Col,
    Image,
    Pagination,
    Skeleton,
    Space,
    Typography,
    theme,
    Flex,
    Modal,
    Empty,
} from "antd";
import {
    ExclamationCircleOutlined,
    HeartOutlined,
    DeleteOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import useTitle from "@/hooks/use-title";
import FetchUtils, { ErrorMessage, ListResponse } from "@/utils/FetchUtils";
import ResourceURL from "@/constants/ResourceURL";
import NotifyUtils from "@/utils/NotifyUtils";
import DateUtils from "@/utils/DateUtils";
import ApplicationConstants from "@/constants/ApplicationConstants";
import { ClientWishResponse } from "@/datas/ClientUI";

const { Title, Text, Link: AntLink } = Typography;
const { useToken } = theme;
const { confirm } = Modal;

function ClientWishlist() {
    useTitle("Sản phẩm yêu thích");
    const { token } = useToken();
    const [activePage, setActivePage] = useState(1);

    const { wishResponses, isLoadingWishResponses, isErrorWishResponses } =
        useGetAllWishesApi(activePage);
    const wishes = wishResponses as ListResponse<ClientWishResponse>;

    let wishlistContentFragment;

    if (isLoadingWishResponses) {
        wishlistContentFragment = (
            <Space direction="vertical" style={{ width: "100%" }}>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} active paragraph={{ rows: 1 }} />
                    ))}
            </Space>
        );
    } else if (isErrorWishResponses) {
        wishlistContentFragment = (
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
                <WarningOutlined style={{ fontSize: 80 }} />
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                    Đã có lỗi xảy ra
                </Text>
            </Space>
        );
    } else if (wishes && wishes.totalElements === 0) {
        wishlistContentFragment = (
            <Empty
                image={
                    <HeartOutlined
                        style={{ fontSize: 80, color: token.colorPrimary }}
                    />
                }
                description={
                    <Text style={{ fontSize: 18, fontWeight: 500 }}>
                        Chưa có sản phẩm yêu thích
                    </Text>
                }
                style={{ margin: `${token.marginXL}px 0` }}
            />
        );
    } else if (wishes && wishes.totalElements > 0) {
        wishlistContentFragment = (
            <>
                <Space direction="vertical" style={{ width: "100%" }}>
                    {wishes.content.map((wish) => (
                        <ClientWishCard key={wish.wishId} wish={wish} />
                    ))}
                </Space>

                <Flex
                    justify="space-between"
                    align="center"
                    style={{ marginTop: 24 }}
                >
                    <Pagination
                        current={activePage}
                        total={wishes.totalElements}
                        pageSize={
                            ApplicationConstants.DEFAULT_CLIENT_WISHLIST_PAGE_SIZE
                        }
                        onChange={(page) =>
                            page !== activePage && setActivePage(page)
                        }
                        showSizeChanger={false}
                    />
                    <Text>
                        <Text strong>Trang {activePage}</Text>
                        <span> / {wishes.totalPages}</span>
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
                                style={{ width: "100%" }}
                            >
                                <Title level={2}>Sản phẩm yêu thích</Title>

                                {wishlistContentFragment}
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </main>
    );
}

function ClientWishCard({ wish }: { wish: ClientWishResponse }) {
    const { token } = useToken();
    const deleteWishesApi = useDeleteWishesApi();

    const handleDeleteWishButton = () => {
        confirm({
            title: "Xác nhận xóa",
            icon: <ExclamationCircleOutlined />,
            content: (
                <Text>
                    Xóa sản phẩm{" "}
                    <Text strong>{wish.wishProduct.productName}</Text> khỏi danh
                    sách yêu thích?
                </Text>
            ),
            okText: "Xóa",
            okType: "danger",
            cancelText: "Không xóa",
            onOk: () => deleteWishesApi.mutate([wish.wishId]),
        });
    };

    return (
        <Flex justify="space-between" align="center">
            <Flex align="center" gap={12}>
                <Image
                    style={{ borderRadius: token.borderRadius }}
                    width={55}
                    height={55}
                    src={wish.wishProduct.productThumbnail || undefined}
                    alt={wish.wishProduct.productName}
                    preview={false}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                />
                <Space direction="vertical" size={4}>
                    <Link
                        href={"/product/" + wish.wishProduct.productSlug}
                        passHref
                        legacyBehavior
                    >
                        <AntLink strong>{wish.wishProduct.productName}</AntLink>
                    </Link>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Thêm vào lúc{" "}
                        {DateUtils.isoDateToString(wish.wishCreatedAt)}
                    </Text>
                </Space>
            </Flex>
            <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteWishButton}
            >
                Xóa
            </Button>
        </Flex>
    );
}

function useGetAllWishesApi(activePage: number) {
    const requestParams = {
        page: activePage,
        size: ApplicationConstants.DEFAULT_CLIENT_WISHLIST_PAGE_SIZE,
    };

    const {
        data: wishResponses,
        isLoading: isLoadingWishResponses,
        isError: isErrorWishResponses,
    } = useQuery<ListResponse<ClientWishResponse>, ErrorMessage>(
        ["client-api", "wishes", "getAllWishes", requestParams],
        () => FetchUtils.getWithToken(ResourceURL.CLIENT_WISH, requestParams),
        {
            onError: () =>
                NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        },
    );

    return { wishResponses, isLoadingWishResponses, isErrorWishResponses };
}

function useDeleteWishesApi() {
    const queryClient = useQueryClient();

    return useMutation<void, ErrorMessage, number[]>(
        (entityIds) =>
            FetchUtils.deleteWithToken(ResourceURL.CLIENT_WISH, entityIds),
        {
            onSuccess: () => {
                NotifyUtils.simpleSuccess("Xóa sản phẩm yêu thích thành công");
                void queryClient.invalidateQueries([
                    "client-api",
                    "wishes",
                    "getAllWishes",
                ]);
            },
            onError: () =>
                NotifyUtils.simpleFailed("Xóa sản phẩm yêu thích thất bại"),
        },
    );
}

export default ClientWishlist;
