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
import { JobLevelResponse } from "@/models/JobLevel";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import JobLevelConfigs from "./JobLevelConfigs";

function JobLevelManage() {
    useResetManagePageState();
    useInitFilterPanelState(JobLevelConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<JobLevelResponse>,
    } = useGetAllApi<JobLevelResponse>(
        JobLevelConfigs.resourceUrl,
        JobLevelConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const jobLevelStatusBadgeFragment = (status: number) => {
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

    const showedPropertiesFragment = (entity: JobLevelResponse) => (
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
            <td>{jobLevelStatusBadgeFragment(entity.status)}</td>
        </>
    );

    const entityDetailTableRowsFragment = (entity: JobLevelResponse) => (
        <>
            <tr>
                <td>{JobLevelConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{JobLevelConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{JobLevelConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{JobLevelConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{JobLevelConfigs.properties.status.label}</td>
                <td>{jobLevelStatusBadgeFragment(entity.status)}</td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={JobLevelConfigs.manageTitleLinks}
                    title={JobLevelConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={JobLevelConfigs.resourceUrl}
                    resourceKey={JobLevelConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={JobLevelConfigs.properties}
                    resourceUrl={JobLevelConfigs.resourceUrl}
                    resourceKey={JobLevelConfigs.resourceKey}
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

export default JobLevelManage;
