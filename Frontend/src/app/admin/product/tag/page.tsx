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
import { TagResponse } from "@/models/Tag";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import TagConfigs from "./TagConfigs";

function TagManage() {
    useResetManagePageState();
    useInitFilterPanelState(TagConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<TagResponse>,
    } = useGetAllApi<TagResponse>(
        TagConfigs.resourceUrl,
        TagConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const tagStatusBadgeFragment = (status: number) => {
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

    const showedPropertiesFragment = (entity: TagResponse) => (
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
                    {entity.slug}
                </Highlight>
            </td>
            <td>{tagStatusBadgeFragment(entity.status)}</td>
        </>
    );

    const entityDetailTableRowsFragment = (entity: TagResponse) => (
        <>
            <tr>
                <td>{TagConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{TagConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{TagConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{TagConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{TagConfigs.properties.slug.label}</td>
                <td>{entity.slug}</td>
            </tr>
            <tr>
                <td>{TagConfigs.properties.status.label}</td>
                <td>{tagStatusBadgeFragment(entity.status)}</td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={TagConfigs.manageTitleLinks}
                    title={TagConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={TagConfigs.resourceUrl}
                    resourceKey={TagConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={TagConfigs.properties}
                    resourceUrl={TagConfigs.resourceUrl}
                    resourceKey={TagConfigs.resourceKey}
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

export default TagManage;
