"use client";
import React from "react";
import { Badge, Box, Highlight, Stack } from "@mantine/core";
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
import { OfficeResponse } from "@/models/Office";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import OfficeConfigs from "./OfficeConfigs";

function OfficeManage() {
    useResetManagePageState();
    useInitFilterPanelState(OfficeConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<OfficeResponse>,
    } = useGetAllApi<OfficeResponse>(
        OfficeConfigs.resourceUrl,
        OfficeConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const officeStatusBadgeFragment = (status: number) => {
        if (status === 1) {
            return (
                <Box component="div">
                    <Badge variant="outline" size="sm">
                        Đang hoạt động
                    </Badge>
                </Box>
            );
        }

        if (status === 2) {
            return (
                <Box component="div">
                    <Badge color="teal" variant="outline" size="sm">
                        Ít hoạt động
                    </Badge>
                </Box>
            );
        }

        return (
            <Box component="div">
                <Badge color="red" variant="outline" size="sm">
                    Không hoạt động
                </Badge>
            </Box>
        );
    };

    const showedPropertiesFragment = (entity: any) => (
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
                <div>{officeStatusBadgeFragment(entity.status)}</div>
            </td>
        </>
    );

    const entityDetailTableRowsFragment = (entity: any) => (
        <>
            <tr>
                <td>{OfficeConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{OfficeConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{OfficeConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{OfficeConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{OfficeConfigs.properties["address.line"].label}</td>
                <td>{entity.address.line}</td>
            </tr>
            <tr>
                <td>
                    {OfficeConfigs.properties["address.province.name"].label}
                </td>
                <td>{entity.address.province?.name}</td>
            </tr>
            <tr>
                <td>
                    {OfficeConfigs.properties["address.province.code"].label}
                </td>
                <td>{entity.address.province?.code}</td>
            </tr>
            <tr>
                <td>
                    {OfficeConfigs.properties["address.district.name"].label}
                </td>
                <td>{entity.address.district?.name}</td>
            </tr>
            <tr>
                <td>
                    {OfficeConfigs.properties["address.district.code"].label}
                </td>
                <td>{entity.address.district?.code}</td>
            </tr>
            <tr>
                <td>{OfficeConfigs.properties.status.label}</td>
                <td>
                    <div>{officeStatusBadgeFragment(entity.status)}</div>
                </td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={OfficeConfigs.manageTitleLinks}
                    title={OfficeConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={OfficeConfigs.resourceUrl}
                    resourceKey={OfficeConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={OfficeConfigs.properties}
                    resourceUrl={OfficeConfigs.resourceUrl}
                    resourceKey={OfficeConfigs.resourceKey}
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

export default OfficeManage;
