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
import { PromotionResponse } from "@/models/Promotion";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import PromotionConfigs from "./PromotionConfigs";

function PromotionManage() {
    useResetManagePageState();
    useInitFilterPanelState(PromotionConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<PromotionResponse>,
    } = useGetAllApi<PromotionResponse>(
        PromotionConfigs.resourceUrl,
        PromotionConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const promotionStatusBadgeFragment = (status: number) => {
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

    const showedPropertiesFragment = (entity: PromotionResponse) => (
        <>
            <td>{entity.id}</td>
            <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.name}
                </Highlight>
            </td>
            <td>{DateUtils.isoDateToString(entity.startDate)}</td>
            <td>{DateUtils.isoDateToString(entity.endDate)}</td>
            <td>{entity.percent}%</td>
            <td>{promotionStatusBadgeFragment(entity.status)}</td>
            <td>{entity.products.length} sản phẩm</td>
        </>
    );

    const entityDetailTableRowsFragment = (entity: PromotionResponse) => (
        <>
            <tr>
                <td>{PromotionConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{PromotionConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{PromotionConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{PromotionConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{PromotionConfigs.properties.startDate.label}</td>
                <td>{DateUtils.isoDateToString(entity.startDate)}</td>
            </tr>
            <tr>
                <td>{PromotionConfigs.properties.endDate.label}</td>
                <td>{DateUtils.isoDateToString(entity.endDate)}</td>
            </tr>
            <tr>
                <td>{PromotionConfigs.properties.percent.label}</td>
                <td>{entity.percent}%</td>
            </tr>
            <tr>
                <td>{PromotionConfigs.properties.status.label}</td>
                <td>{promotionStatusBadgeFragment(entity.status)}</td>
            </tr>
            <tr>
                <td>{PromotionConfigs.properties.numberOfProducts.label}</td>
                <td>{entity.products.length} sản phẩm</td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={PromotionConfigs.manageTitleLinks}
                    title={PromotionConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={PromotionConfigs.resourceUrl}
                    resourceKey={PromotionConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={PromotionConfigs.properties}
                    resourceUrl={PromotionConfigs.resourceUrl}
                    resourceKey={PromotionConfigs.resourceKey}
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

export default PromotionManage;
