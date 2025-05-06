"use client";
import React from "react";
import {
    ActionIcon,
    ColorSwatch,
    Group,
    Highlight,
    Stack,
    Text,
    useMantineTheme,
} from "@mantine/core";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import ManageHeader from "@/components/ManageHeader";
import ManageHeaderButtons from "@/components/ManageHeaderButtons";
import ManageHeaderTitle from "@/components/ManageHeaderTitle";
import ManageMain from "@/components/ManageMain";
import ManagePagination from "@/components/ManagePagination/ManagePagination";
import ManageTable from "@/components/ManageTable/ManageTable";
import SearchPanel from "@/components/SearchPanel/SearchPanel";
import useGetAllApi from "@/hooks/use-get-all-api";
import useInitFilterPanelState from "@/hooks/use-init-filter-panel-state";
import useResetManagePageState from "@/hooks/use-reset-manage-page-state";
import { OrderResponse } from "@/models/Order";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import PageConfigs from "@/utils/PageConfigs";
import { Clipboard, Plus } from "tabler-icons-react";
import DocketConfigs from "../inventory/docket/DocketConfigs";
import OrderConfigs from "./OrderConfigs";

function OrderManage() {
    const theme = useMantineTheme();

    useResetManagePageState();
    useInitFilterPanelState(OrderConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<OrderResponse>,
    } = useGetAllApi<OrderResponse>(
        OrderConfigs.resourceUrl,
        OrderConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const showedPropertiesFragment = (entity: OrderResponse) => {
        const PaymentMethodIcon =
            PageConfigs.paymentMethodIconMap[entity.paymentMethodType];

        return (
            <>
                <td>{entity.id}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
                <td>
                    <Group spacing="xs">
                        <Highlight
                            highlight={searchToken}
                            highlightColor="blue"
                            size="sm"
                            sx={{ fontFamily: theme.fontFamilyMonospace }}
                        >
                            {entity.code}
                        </Highlight>
                        <ActionIcon
                            color="blue"
                            variant="outline"
                            size="sm"
                            title="Sao chép mã đơn hàng này"
                            onClick={() => {
                                void navigator.clipboard.writeText(entity.code);
                                NotifyUtils.simple(
                                    <Text inherit>
                                        Đã sao chép mã đơn hàng{" "}
                                        <strong>{entity.code}</strong>
                                    </Text>,
                                );
                            }}
                        >
                            <Clipboard size={15} strokeWidth={1.5} />
                        </ActionIcon>
                    </Group>
                </td>
                <td>
                    <Group spacing="xs">
                        <ColorSwatch color={entity.orderResource.color} />
                        <Highlight
                            highlight={searchToken}
                            highlightColor="blue"
                            size="sm"
                        >
                            {entity.orderResource.name}
                        </Highlight>
                    </Group>
                </td>
                <td>
                    <Stack spacing={0}>
                        <Highlight
                            highlight={searchToken}
                            highlightColor="blue"
                            size="sm"
                        >
                            {entity.user.fullname}
                        </Highlight>
                        <Highlight
                            highlight={searchToken}
                            highlightColor="blue"
                            size="xs"
                            color="dimmed"
                        >
                            {entity.user.username}
                        </Highlight>
                    </Stack>
                </td>
                <td>
                    <Stack spacing={0}>
                        <Highlight
                            highlight={searchToken}
                            highlightColor="blue"
                            size="sm"
                        >
                            {entity.toName}
                        </Highlight>
                        <Highlight
                            highlight={searchToken}
                            highlightColor="blue"
                            size="xs"
                        >
                            {entity.toPhone}
                        </Highlight>
                        <Highlight
                            highlight={searchToken}
                            highlightColor="blue"
                            size="xs"
                            color="dimmed"
                        >
                            {entity.toAddress}
                        </Highlight>
                        <Highlight
                            highlight={searchToken}
                            highlightColor="blue"
                            size="xs"
                            color="dimmed"
                        >
                            {[entity.toWardName, entity.toDistrictName].join(
                                ", ",
                            )}
                        </Highlight>
                        <Highlight
                            highlight={searchToken}
                            highlightColor="blue"
                            size="xs"
                            color="dimmed"
                        >
                            {entity.toProvinceName}
                        </Highlight>
                    </Stack>
                </td>
                <td style={{ textAlign: "right" }}>
                    <Stack align="end" spacing={5}>
                        <Text weight={500} size="sm">
                            {MiscUtils.formatPrice(entity.totalPay) + " ₫"}
                        </Text>
                        <PaymentMethodIcon color={theme.colors.gray[5]} />
                    </Stack>
                </td>
                <td>
                    <ActionIcon
                        color="blue"
                        variant="hover"
                        size={24}
                        title="Tạo phiếu xuất kho"
                        component="a"
                        href={DocketConfigs.managerPath + "/create"}
                        target="_blank"
                    >
                        <Plus />
                    </ActionIcon>
                </td>
                <td>
                    <Stack spacing="xs" sx={{ alignItems: "start" }}>
                        {OrderConfigs.orderStatusBadgeFragment(entity.status)}
                        {OrderConfigs.orderPaymentStatusBadgeFragment(
                            entity.paymentStatus,
                        )}
                    </Stack>
                </td>
            </>
        );
    };

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={OrderConfigs.manageTitleLinks}
                    title={OrderConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={OrderConfigs.resourceUrl}
                    resourceKey={OrderConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={OrderConfigs.properties}
                    resourceUrl={OrderConfigs.resourceUrl}
                    resourceKey={OrderConfigs.resourceKey}
                    showedPropertiesFragment={showedPropertiesFragment}
                    entityDetailTableRowsFragment={
                        OrderConfigs.entityDetailTableRowsFragment
                    }
                />
            </ManageMain>

            <ManagePagination listResponse={listResponse} />
        </Stack>
    );
}

export default OrderManage;
