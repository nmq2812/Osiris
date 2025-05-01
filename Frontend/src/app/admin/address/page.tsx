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
import { AddressResponse } from "@/models/Address";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import AddressConfigs from "./AddressConfigs";

function AddressManage() {
    useResetManagePageState();
    useInitFilterPanelState(AddressConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<AddressResponse>,
    } = useGetAllApi<AddressResponse>(
        AddressConfigs.resourceUrl,
        AddressConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

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
                    {entity.line || ""}
                </Highlight>
            </td>
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.province?.name || ""}
                </Highlight>
            </td>
            <td>
                <Highlight
                    highlight={searchToken}
                    highlightColor="blue"
                    size="sm"
                >
                    {entity.district?.name || ""}
                </Highlight>
            </td>
        </>
    );

    const entityDetailTableRowsFragment = (entity: any) => (
        <>
            <tr>
                <td>{AddressConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties.line.label}</td>
                <td>{entity.line}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties["province.name"].label}</td>
                <td>{entity.province?.name}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties["province.code"].label}</td>
                <td>{entity.province?.code}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties["district.name"].label}</td>
                <td>{entity.district?.name}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties["district.code"].label}</td>
                <td>{entity.district?.code}</td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={AddressConfigs.manageTitleLinks}
                    title={AddressConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={AddressConfigs.resourceUrl}
                    resourceKey={AddressConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={AddressConfigs.properties}
                    resourceUrl={AddressConfigs.resourceUrl}
                    resourceKey={AddressConfigs.resourceKey}
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

export default AddressManage;
