"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Row,
    Col,
    Badge,
    Image,
    Pagination,
    Skeleton,
    Space,
    Typography,
    theme,
    Flex,
    Modal,
} from "antd";
import {
    BellOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
    DeliveredProcedureOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import useTitle from "@/hooks/use-title";
import FetchUtils, { ErrorMessage, ListResponse } from "@/utils/FetchUtils";
import ResourceURL from "@/constants/ResourceURL";
import NotifyUtils from "@/utils/NotifyUtils";
import DateUtils from "@/utils/DateUtils";
import ApplicationConstants from "@/constants/ApplicationConstants";
import {
    ClientPreorderRequest,
    ClientPreorderResponse,
} from "@/datas/ClientUI";
import { useAuthStore } from "@/stores/authStore";

const { Title, Text, Link: AntLink } = Typography;
const { useToken } = theme;
const { confirm } = Modal;

function ClientPreorder() {
    useTitle("Đặt trước sản phẩm");
    const { token } = useToken();
    const [activePage, setActivePage] = useState(1);

    const {
        preorderResponses,
        isLoadingPreorderResponses,
        isErrorPreorderResponses,
    } = useGetAllPreordersApi(activePage);
    const preorders = preorderResponses as ListResponse<ClientPreorderResponse>;

    let preorderContentFragment;

    if (isLoadingPreorderResponses) {
        preorderContentFragment = (
            <Space direction="vertical" style={{ width: "100%" }}>
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} active paragraph={{ rows: 1 }} />
                    ))}
            </Space>
        );
    } else if (isErrorPreorderResponses) {
        preorderContentFragment = (
            <Space
                direction="vertical"
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "48px 0",
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
    } else if (preorders && preorders.totalElements === 0) {
        preorderContentFragment = (
            <Space
                direction="vertical"
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "48px 0",
                    color: token.colorPrimary,
                    width: "100%",
                }}
            >
                <DeliveredProcedureOutlined style={{ fontSize: 80 }} />
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                    Chưa đặt trước sản phẩm nào
                </Text>
            </Space>
        );
    } else if (preorders && preorders.totalElements > 0) {
        preorderContentFragment = (
            <>
                <Space direction="vertical" style={{ width: "100%" }}>
                    {preorders.content.map((preorder) => (
                        <ClientPreorderCard
                            key={preorder.preorderId}
                            preorder={preorder}
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
                        total={preorders.totalElements}
                        pageSize={
                            ApplicationConstants.DEFAULT_CLIENT_PREORDER_PAGE_SIZE
                        }
                        onChange={(page) =>
                            page !== activePage && setActivePage(page)
                        }
                        showSizeChanger={false}
                    />
                    <Text>
                        <Text strong>Trang {activePage}</Text>
                        <span> / {preorders.totalPages}</span>
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
                                <Title level={2}>Đặt trước sản phẩm</Title>
                                {preorderContentFragment}
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </main>
    );
}

function ClientPreorderCard({
    preorder,
}: {
    preorder: ClientPreorderResponse;
}) {
    const { token } = useToken();
    const updatePreorderApi = useUpdatePreorderApi();
    const deletePreordersApi = useDeletePreordersApi();
    const { user } = useAuthStore();

    const handleCancelPreorderButton = () => {
        confirm({
            title: "Xác nhận hủy",
            icon: <ExclamationCircleOutlined />,
            content: (
                <Text>
                    Hủy thông báo đặt trước cho sản phẩm{" "}
                    <Text strong>{preorder.preorderProduct.productName}</Text>,
                    không thể hoàn tác?
                </Text>
            ),
            okText: "Hủy",
            okType: "danger",
            okButtonProps: {
                style: {
                    backgroundColor: token.colorWarning,
                    borderColor: token.colorWarning,
                },
            },
            cancelText: "Không hủy",
            onOk: () => {
                if (user) {
                    const clientPreorderRequest: ClientPreorderRequest = {
                        userId: user.id,
                        productId: preorder.preorderProduct.productId,
                        status: 3,
                    };
                    updatePreorderApi.mutate(clientPreorderRequest);
                }
            },
        });
    };

    const handleDeletePreorderButton = () => {
        confirm({
            title: "Xác nhận xóa",
            icon: <ExclamationCircleOutlined />,
            content: (
                <Text>
                    Xóa sản phẩm{" "}
                    <Text strong>{preorder.preorderProduct.productName}</Text>{" "}
                    khỏi danh sách đặt trước?
                </Text>
            ),
            okText: "Xóa",
            okType: "danger",
            cancelText: "Không xóa",
            onOk: () => deletePreordersApi.mutate([preorder.preorderId]),
        });
    };

    const preorderStatusBadgeFragment = (status: number) => {
        switch (status) {
            case 1:
                return (
                    <Badge
                        color="default"
                        text="Chưa thông báo"
                        style={{ fontSize: 12 }}
                    />
                );
            case 2:
                return (
                    <Badge
                        color="success"
                        text="Đã thông báo"
                        style={{ fontSize: 12 }}
                    />
                );
            case 3:
                return (
                    <Badge
                        color="error"
                        text="Hủy thông báo"
                        style={{ fontSize: 12 }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Flex justify="space-between" align="center">
            <Flex align="center" gap={12}>
                <Image
                    style={{ borderRadius: token.borderRadius }}
                    width={55}
                    height={55}
                    src={preorder.preorderProduct.productThumbnail || undefined}
                    alt={preorder.preorderProduct.productName}
                    preview={false}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                />
                <Space direction="vertical" size={4}>
                    <Space>
                        <Link
                            href={
                                "/product/" +
                                preorder.preorderProduct.productSlug
                            }
                            passHref
                            legacyBehavior
                        >
                            <AntLink strong>
                                {preorder.preorderProduct.productName}
                            </AntLink>
                        </Link>
                        {preorderStatusBadgeFragment(preorder.preorderStatus)}
                    </Space>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Cập nhật lúc{" "}
                        {DateUtils.isoDateToString(preorder.preorderUpdatedAt)}
                    </Text>
                </Space>
            </Flex>

            <Space>
                <Button
                    type="default"
                    icon={<BellOutlined />}
                    onClick={handleCancelPreorderButton}
                    disabled={preorder.preorderStatus !== 1}
                    style={{
                        color: token.colorWarning,
                        borderColor: token.colorWarning,
                    }}
                >
                    Hủy
                </Button>
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDeletePreorderButton}
                >
                    Xóa
                </Button>
            </Space>
        </Flex>
    );
}

function useGetAllPreordersApi(activePage: number) {
    const requestParams = {
        page: activePage,
        size: ApplicationConstants.DEFAULT_CLIENT_PREORDER_PAGE_SIZE,
    };

    const {
        data: preorderResponses,
        isLoading: isLoadingPreorderResponses,
        isError: isErrorPreorderResponses,
    } = useQuery<ListResponse<ClientPreorderResponse>, ErrorMessage>({
        queryKey: ["client-api", "preorders", "getAllPreorders", requestParams],
        queryFn: () =>
            FetchUtils.getWithToken(ResourceURL.CLIENT_PREORDER, requestParams),

        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    });

    useEffect(() => {
        if (isErrorPreorderResponses) {
            NotifyUtils.simpleFailed("Lấy dữ liệu không thành công");
        }
    }, [isErrorPreorderResponses]);

    return {
        preorderResponses,
        isLoadingPreorderResponses,
        isErrorPreorderResponses,
    };
}

function useUpdatePreorderApi() {
    const queryClient = useQueryClient();

    return useMutation<
        ClientPreorderResponse,
        ErrorMessage,
        ClientPreorderRequest
    >({
        mutationFn: (requestBody) =>
            FetchUtils.putWithToken(ResourceURL.CLIENT_PREORDER, requestBody),

        onSuccess: () => {
            NotifyUtils.simpleSuccess("Cập nhật thành công");
            void queryClient.invalidateQueries({
                queryKey: ["client-api", "preorders", "getAllPreorders"],
            });
        },
        onError: () => NotifyUtils.simpleFailed("Cập nhật không thành công"),
    });
}

function useDeletePreordersApi() {
    const queryClient = useQueryClient();

    return useMutation<void, ErrorMessage, number[]>({
        mutationFn: (entityIds) =>
            FetchUtils.deleteWithToken(ResourceURL.CLIENT_PREORDER, entityIds),

        onSuccess: () => {
            NotifyUtils.simpleSuccess("Xóa đặt trước sản phẩm thành công");
            void queryClient.invalidateQueries({
                queryKey: ["client-api", "preorders", "getAllPreorders"],
            });
        },
    });
}

export default ClientPreorder;
