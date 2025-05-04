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
import { PropertyResponse } from "@/models/Property";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import PropertyConfigs from "./PropertyConfigs";

function PropertyManage() {
    useResetManagePageState();
    useInitFilterPanelState(PropertyConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<PropertyResponse>,
    } = useGetAllApi<PropertyResponse>(
        PropertyConfigs.resourceUrl,
        PropertyConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const propertyStatusBadgeFragment = (status: number) => {
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

    const showedPropertiesFragment = (entity: PropertyResponse) => (
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
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.code}
                </Highlight>
            </td>
            <td>{propertyStatusBadgeFragment(entity.status)}</td>
        </>
    );

    const entityDetailTableRowsFragment = (entity: PropertyResponse) => (
        <>
            <tr>
                <td>{PropertyConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{PropertyConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{PropertyConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{PropertyConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{PropertyConfigs.properties.code.label}</td>
                <td>{entity.code}</td>
            </tr>
            <tr>
                <td>{PropertyConfigs.properties.description.label}</td>
                <td style={{ maxWidth: 300 }}>{entity.description}</td>
            </tr>
            <tr>
                <td>{PropertyConfigs.properties.status.label}</td>
                <td>{propertyStatusBadgeFragment(entity.status)}</td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={PropertyConfigs.manageTitleLinks}
                    title={PropertyConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={PropertyConfigs.resourceUrl}
                    resourceKey={PropertyConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={PropertyConfigs.properties}
                    resourceUrl={PropertyConfigs.resourceUrl}
                    resourceKey={PropertyConfigs.resourceKey}
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

export default PropertyManage;
