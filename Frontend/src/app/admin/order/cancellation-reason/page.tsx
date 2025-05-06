"use client";
import React from "react";
import { Badge, Highlight, Stack } from "@mantine/core";
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
import { OrderCancellationReasonResponse } from "@/models/OrderCancellationReason";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import OrderCancellationReasonConfigs from "./OrderCancellationReasonConfigs";

function OrderCancellationReasonManage() {
    useResetManagePageState();
    useInitFilterPanelState(OrderCancellationReasonConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<OrderCancellationReasonResponse>,
    } = useGetAllApi<OrderCancellationReasonResponse>(
        OrderCancellationReasonConfigs.resourceUrl,
        OrderCancellationReasonConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const orderCancellationReasonStatusBadgeFragment = (status: number) => {
        if (status === 1) {
            return (
                <Badge variant="outline" size="sm">
                    Có hiệu lực
                </Badge>
            );
        }

        return (
            <Badge color="red" variant="outline" size="sm">
                Vô hiệu lực
            </Badge>
        );
    };

    const showedPropertiesFragment = (
        entity: OrderCancellationReasonResponse,
    ) => (
        <>
            <td>{entity.id}</td>
            <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.name}
                </Highlight>
            </td>
            <td>{orderCancellationReasonStatusBadgeFragment(entity.status)}</td>
        </>
    );

    const entityDetailTableRowsFragment = (
        entity: OrderCancellationReasonResponse,
    ) => (
        <>
            <tr>
                <td>{OrderCancellationReasonConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>
                    {OrderCancellationReasonConfigs.properties.createdAt.label}
                </td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>
                    {OrderCancellationReasonConfigs.properties.updatedAt.label}
                </td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{OrderCancellationReasonConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{OrderCancellationReasonConfigs.properties.note.label}</td>
                <td style={{ maxWidth: 300 }}>{entity.note}</td>
            </tr>
            <tr>
                <td>
                    {OrderCancellationReasonConfigs.properties.status.label}
                </td>
                <td>
                    {orderCancellationReasonStatusBadgeFragment(entity.status)}
                </td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={OrderCancellationReasonConfigs.manageTitleLinks}
                    title={OrderCancellationReasonConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={OrderCancellationReasonConfigs.resourceUrl}
                    resourceKey={OrderCancellationReasonConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={OrderCancellationReasonConfigs.properties}
                    resourceUrl={OrderCancellationReasonConfigs.resourceUrl}
                    resourceKey={OrderCancellationReasonConfigs.resourceKey}
                    showedPropertiesFragment={showedPropertiesFragment}
                    entityDetailTableRowsFragment={
                        entityDetailTableRowsFragment
                    }
                />
            </ManageMain>

            <ManagePagination listResponse={listResponse} />
        </Stack>
    );
}

export default OrderCancellationReasonManage;
