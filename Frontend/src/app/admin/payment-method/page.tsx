"use client";
import React, { useState, useEffect } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Space,
    Spin,
    Switch,
    Table,
    Typography,
} from "antd";
import { AlertOutlined } from "@ant-design/icons";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import ManageHeader from "@/components/ManageHeader";
import ManageHeaderTitle from "@/components/ManageHeaderTitle";
import PageConfigs from "@/utils/PageConfigs";
import FetchUtils, { ErrorMessage, ListResponse } from "@/utils/FetchUtils";
import useGetAllApi from "@/hooks/use-get-all-api";
import {
    PaymentMethodRequest,
    PaymentMethodResponse,
} from "@/models/PaymentMethod";
import PaymentMethodConfigs from "./PaymentMethodConfigs";
import useResetManagePageState from "@/hooks/use-reset-manage-page-state";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";

const { Text } = Typography;

function PaymentMethodManage() {
    const queryClient = useQueryClient();
    useResetManagePageState();

    const [paymentMethodStatus, setPaymentMethodStatus] = useState<
        Array<{ status: boolean }>
    >([]);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<PaymentMethodResponse>,
    } = useGetAllApi<PaymentMethodResponse>(
        PaymentMethodConfigs.resourceUrl,
        PaymentMethodConfigs.resourceKey,
        { all: 1, sort: "id,asc" },
        (data) => {
            setPaymentMethodStatus(
                data.content.map((entity) => ({ status: entity.status === 1 })),
            );
        },
        {
            refetchOnWindowFocus: false,
            queryKey: [],
        },
    );

    const updatePaymentMethodApi = useUpdatePaymentMethodApi();

    const handleUpdateButton = async () => {
        if (!paymentMethodStatus.every((p) => !p.status)) {
            try {
                const updatePaymentMethodRequests: UpdatePaymentMethodRequest[] =
                    [];

                listResponse.content.forEach((entity, index) => {
                    const currentStatus = paymentMethodStatus[index].status
                        ? 1
                        : 2;

                    if (currentStatus !== entity.status) {
                        updatePaymentMethodRequests.push({
                            id: entity.id,
                            body: { status: currentStatus },
                        });
                    }
                });

                await Promise.all(
                    updatePaymentMethodRequests.map(async (request) => {
                        await updatePaymentMethodApi.mutateAsync(request);
                    }),
                );

                NotifyUtils.simpleSuccess("Cập nhật thành công");
                void queryClient.invalidateQueries({
                    queryKey: [PaymentMethodConfigs.resourceKey, "getAll"],
                });
            } catch (e) {
                NotifyUtils.simpleFailed("Cập nhật không thành công");
            }
        }
    };

    const paymentMethodStatusBadgeFragment = (status: number) => {
        switch (status) {
            case 1:
                return <Badge color="blue" text="Đang sử dụng" />;
            case 2:
                return <Badge color="pink" text="Không sử dụng" />;
            default:
                return null;
        }
    };

    const columns = [
        {
            title: "Kích hoạt",
            dataIndex: "status",
            key: "status",
            render: (_: any, _record: any, index: number) => (
                <Switch
                    checked={paymentMethodStatus[index]?.status}
                    onChange={(checked) => {
                        const newStatus = [...paymentMethodStatus];
                        newStatus[index] = { status: checked };
                        setPaymentMethodStatus(newStatus);
                    }}
                />
            ),
        },
        {
            title: "Hình thức thanh toán",
            dataIndex: "name",
            key: "name",
            render: (_: any, record: PaymentMethodResponse) => {
                const PaymentMethodIcon =
                    PageConfigs.paymentMethodIconMap[record.code];
                return (
                    <Space>
                        <PaymentMethodIcon />
                        <Text>{record.name}</Text>
                    </Space>
                );
            },
        },
        {
            title: "Mã",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "statusBadge",
            render: (status: number) =>
                paymentMethodStatusBadgeFragment(status),
        },
    ];

    const disabledUpdateButton =
        MiscUtils.isEquals(
            listResponse.content.map((entity) => ({
                status: entity.status === 1,
            })),
            paymentMethodStatus,
        ) || paymentMethodStatus.every((p) => !p.status);

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={PaymentMethodConfigs.manageTitleLinks}
                    title={PaymentMethodConfigs.manageTitle}
                />
            </ManageHeader>

            <Alert
                message="Thông báo"
                description="Kích hoạt một vài hoặc tất cả các hình thức thanh toán, luôn phải có ít nhất một hình thức thanh toán được chọn."
                type="warning"
                showIcon
                icon={<AlertOutlined />}
            />

            <Card>
                <Spin spinning={isLoading}>
                    <Table
                        columns={columns}
                        dataSource={listResponse.content}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </Spin>
            </Card>

            <Button
                type="primary"
                disabled={disabledUpdateButton}
                onClick={handleUpdateButton}
                style={{ alignSelf: "flex-start" }}
            >
                Cập nhật
            </Button>
        </Space>
    );
}

type UpdatePaymentMethodRequest = { id: number; body: PaymentMethodRequest };

function useUpdatePaymentMethodApi() {
    return useMutation<
        PaymentMethodResponse,
        ErrorMessage,
        UpdatePaymentMethodRequest
    >({
        mutationFn: (request) =>
            FetchUtils.update(
                PaymentMethodConfigs.resourceUrl,
                request.id,
                request.body,
            ),
    });
}

export default PaymentMethodManage;
