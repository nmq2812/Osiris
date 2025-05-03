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
import { CustomerGroupResponse } from "@/models/CustomerGroup";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import CustomerGroupConfigs from "./CustomerGroupConfigs";

function CustomerGroupManage() {
    useResetManagePageState();
    useInitFilterPanelState(CustomerGroupConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<CustomerGroupResponse>,
    } = useGetAllApi<CustomerGroupResponse>(
        CustomerGroupConfigs.resourceUrl,
        CustomerGroupConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const customerGroupStatusBadgeFragment = (status: number) => {
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

    const showedPropertiesFragment = (entity: CustomerGroupResponse) => (
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
            <td>{customerGroupStatusBadgeFragment(entity.status)}</td>
        </>
    );

    const entityDetailTableRowsFragment = (entity: CustomerGroupResponse) => (
        <>
            <tr>
                <td>{CustomerGroupConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{CustomerGroupConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{CustomerGroupConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{CustomerGroupConfigs.properties.code.label}</td>
                <td>{entity.code}</td>
            </tr>
            <tr>
                <td>{CustomerGroupConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{CustomerGroupConfigs.properties.description.label}</td>
                <td style={{ maxWidth: 300 }}>{entity.description}</td>
            </tr>
            <tr>
                <td>{CustomerGroupConfigs.properties.color.label}</td>
                <td>
                    <Group spacing="xs">
                        <ColorSwatch color={entity.color} />
                        <Code>{entity.color.toLowerCase()}</Code>
                    </Group>
                </td>
            </tr>
            <tr>
                <td>{CustomerGroupConfigs.properties.status.label}</td>
                <td>{customerGroupStatusBadgeFragment(entity.status)}</td>
            </tr>
        </>
    );

    return (
        <Stack>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={CustomerGroupConfigs.manageTitleLinks}
                    title={CustomerGroupConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={CustomerGroupConfigs.resourceUrl}
                    resourceKey={CustomerGroupConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={CustomerGroupConfigs.properties}
                    resourceUrl={CustomerGroupConfigs.resourceUrl}
                    resourceKey={CustomerGroupConfigs.resourceKey}
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

export default CustomerGroupManage;
