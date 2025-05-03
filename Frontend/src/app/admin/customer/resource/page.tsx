"use client";
import React from "react";
import {
    Badge,
    Code,
    ColorSwatch,
    Group,
    Highlight,
    Stack,
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
import { CustomerResourceResponse } from "@/models/CustomerResource";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import CustomerResourceConfigs from "./CustomerResourceConfigs";

function CustomerResourceManage() {
    useResetManagePageState();
    useInitFilterPanelState(CustomerResourceConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<CustomerResourceResponse>,
    } = useGetAllApi<CustomerResourceResponse>(
        CustomerResourceConfigs.resourceUrl,
        CustomerResourceConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const customerResourceStatusBadgeFragment = (status: number) => {
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

    const showedPropertiesFragment = (entity: CustomerResourceResponse) => (
        <>
            <td>{entity.id}</td>
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
                    {entity.name}
                </Highlight>
            </td>
            <td>
                <Group spacing="xs">
                    <ColorSwatch color={entity.color} />
                    <Code>{entity.color.toLowerCase()}</Code>
                </Group>
            </td>
            <td>{customerResourceStatusBadgeFragment(entity.status)}</td>
        </>
    );

    const entityDetailTableRowsFragment = (
        entity: CustomerResourceResponse,
    ) => (
        <>
            <tr>
                <td>{CustomerResourceConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{CustomerResourceConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{CustomerResourceConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{CustomerResourceConfigs.properties.code.label}</td>
                <td>{entity.code}</td>
            </tr>
            <tr>
                <td>{CustomerResourceConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{CustomerResourceConfigs.properties.description.label}</td>
                <td style={{ maxWidth: 300 }}>{entity.description}</td>
            </tr>
            <tr>
                <td>{CustomerResourceConfigs.properties.color.label}</td>
                <td>
                    <Group spacing="xs">
                        <ColorSwatch color={entity.color} />
                        <Code>{entity.color.toLowerCase()}</Code>
                    </Group>
                </td>
            </tr>
            <tr>
                <td>{CustomerResourceConfigs.properties.status.label}</td>
                <td>{customerResourceStatusBadgeFragment(entity.status)}</td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={CustomerResourceConfigs.manageTitleLinks}
                    title={CustomerResourceConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={CustomerResourceConfigs.resourceUrl}
                    resourceKey={CustomerResourceConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={CustomerResourceConfigs.properties}
                    resourceUrl={CustomerResourceConfigs.resourceUrl}
                    resourceKey={CustomerResourceConfigs.resourceKey}
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

export default CustomerResourceManage;
