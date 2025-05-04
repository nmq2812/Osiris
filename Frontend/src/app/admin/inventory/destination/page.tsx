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
import { DestinationResponse } from "@/models/Destination";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import DestinationConfigs from "./DestinationConfigs";

function DestinationManage() {
    useResetManagePageState();
    useInitFilterPanelState(DestinationConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<DestinationResponse>,
    } = useGetAllApi<DestinationResponse>(
        DestinationConfigs.resourceUrl,
        DestinationConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const destinationStatusBadgeFragment = (status: number) => {
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

    const showedPropertiesFragment = (entity: DestinationResponse) => (
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
                    {entity.address.line || ""}
                </Highlight>
            </td>
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.address.province?.name || ""}
                </Highlight>
            </td>
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.address.district?.name || ""}
                </Highlight>
            </td>
            <td>{destinationStatusBadgeFragment(entity.status)}</td>
        </>
    );

    const entityDetailTableRowsFragment = (entity: DestinationResponse) => (
        <>
            <tr>
                <td>{DestinationConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{DestinationConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{DestinationConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{DestinationConfigs.properties.contactFullname.label}</td>
                <td>{entity.contactFullname}</td>
            </tr>
            <tr>
                <td>{DestinationConfigs.properties.contactEmail.label}</td>
                <td>{entity.contactEmail}</td>
            </tr>
            <tr>
                <td>{DestinationConfigs.properties.contactPhone.label}</td>
                <td>{entity.contactPhone}</td>
            </tr>
            <tr>
                <td>{DestinationConfigs.properties["address.line"].label}</td>
                <td>{entity.address.line}</td>
            </tr>
            <tr>
                <td>
                    {
                        DestinationConfigs.properties["address.province.name"]
                            .label
                    }
                </td>
                <td>{entity.address.province?.name}</td>
            </tr>
            <tr>
                <td>
                    {
                        DestinationConfigs.properties["address.district.name"]
                            .label
                    }
                </td>
                <td>{entity.address.district?.name}</td>
            </tr>
            <tr>
                <td>{DestinationConfigs.properties.status.label}</td>
                <td>{destinationStatusBadgeFragment(entity.status)}</td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={DestinationConfigs.manageTitleLinks}
                    title={DestinationConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={DestinationConfigs.resourceUrl}
                    resourceKey={DestinationConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={DestinationConfigs.properties}
                    resourceUrl={DestinationConfigs.resourceUrl}
                    resourceKey={DestinationConfigs.resourceKey}
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

export default DestinationManage;
