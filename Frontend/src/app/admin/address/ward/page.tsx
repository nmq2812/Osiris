"use client";
import React from "react";
import { Highlight, Stack } from "@mantine/core";
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
import { DistrictResponse } from "@/models/District";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import DistrictConfigs from "../district/DistrictConfigs";
import { WardResponse } from "@/models/Ward";
import WardConfigs from "./WardConfigs";

function WardManage() {
    useResetManagePageState();
    useInitFilterPanelState(WardConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<WardResponse>,
    } = useGetAllApi<WardResponse>(
        WardConfigs.resourceUrl,
        WardConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const showedPropertiesFragment = (entity: WardResponse) => (
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
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.district.province.name}
                </Highlight>
            </td>
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.district.province.code}
                </Highlight>
            </td>
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.district.name}
                </Highlight>
            </td>
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.district.code}
                </Highlight>
            </td>
        </>
    );

    const entityDetailTableRowsFragment = (entity: WardResponse) => (
        <>
            <tr>
                <td>{WardConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{WardConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{WardConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{WardConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{WardConfigs.properties.code.label}</td>
                <td>{entity.code}</td>
            </tr>
            <tr>
                <td>{WardConfigs.properties["province.name"].label}</td>
                <td>{entity.district.province.name}</td>
            </tr>
            <tr>
                <td>{WardConfigs.properties["province.code"].label}</td>
                <td>{entity.district.province.code}</td>
            </tr>
            <tr>
                <td>{WardConfigs.properties["district.name"].label}</td>
                <td>{entity.district.name}</td>
            </tr>
            <tr>
                <td>{WardConfigs.properties["district.code"].label}</td>
                <td>{entity.district.code}</td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={WardConfigs.manageTitleLinks}
                    title={WardConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={WardConfigs.resourceUrl}
                    resourceKey={WardConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={WardConfigs.properties}
                    resourceUrl={WardConfigs.resourceUrl}
                    resourceKey={WardConfigs.resourceKey}
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

export default WardManage;
