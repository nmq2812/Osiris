"use client";
import React from "react";
import { Space, Typography } from "antd";
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
import { ProvinceResponse } from "@/models/Province";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import ProvinceConfigs from "./ProvinceConfigs";

const { Text } = Typography;

function ProvinceManage() {
    useResetManagePageState();
    useInitFilterPanelState(ProvinceConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<ProvinceResponse>,
    } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        undefined,
        undefined,
        {
            refetchOnWindowFocus: false,
            enabled: true,
            staleTime: 30000,
            queryKey: [],
        },
    );

    const { searchToken } = useAppStore();

    const showedPropertiesFragment = (entity: any) => [
        <span key="id">{entity.id}</span>,
        <span key="createdAt">
            {DateUtils.isoDateToString(entity.createdAt)}
        </span>,
        <span key="updatedAt">
            {DateUtils.isoDateToString(entity.updatedAt)}
        </span>,
        <span key="name">
            <Text
                strong={Boolean(
                    searchToken && entity.name?.includes(searchToken),
                )}
                style={
                    searchToken && entity.name?.includes(searchToken)
                        ? { backgroundColor: "#e6f7ff" }
                        : {}
                }
            >
                {entity.name}
            </Text>
        </span>,
        <span key="code">
            <Text
                strong={Boolean(
                    searchToken && entity.code?.includes(searchToken),
                )}
                style={
                    searchToken && entity.code?.includes(searchToken)
                        ? { backgroundColor: "#e6f7ff" }
                        : {}
                }
            >
                {entity.code}
            </Text>
        </span>,
    ];

    // entityDetailTableRowsFragment vẫn giữ nguyên vì nó được sử dụng đúng trong context của nó
    const entityDetailTableRowsFragment = (entity: any) => (
        <>
            <tr>
                <td>{ProvinceConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{ProvinceConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{ProvinceConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{ProvinceConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{ProvinceConfigs.properties.code.label}</td>
                <td>{entity.code}</td>
            </tr>
        </>
    );

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={ProvinceConfigs.manageTitleLinks}
                    title={ProvinceConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={ProvinceConfigs.resourceUrl}
                    resourceKey={ProvinceConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={ProvinceConfigs.properties}
                    resourceUrl={ProvinceConfigs.resourceUrl}
                    resourceKey={ProvinceConfigs.resourceKey}
                    showedPropertiesFragment={showedPropertiesFragment}
                    entityDetailTableRowsFragment={
                        entityDetailTableRowsFragment
                    }
                />
            </ManageMain>

            <ManagePagination listResponse={listResponse} />
        </Space>
    );
}

export default ProvinceManage;
