"use client";
import React from "react";
import { Space, Typography, Badge, Tag } from "antd";
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
import { RoleResponse } from "@/models/Role";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import RoleConfigs from "./RoleConfigs";
import BaseResponse from "@/models/BaseResponse";

const { Text } = Typography;

function RoleManage() {
    useResetManagePageState();
    useInitFilterPanelState(RoleConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<RoleResponse>,
    } = useGetAllApi<RoleResponse>(
        RoleConfigs.resourceUrl,
        RoleConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const getRoleStatusBadge = (status: number) => {
        if (status === 1) {
            return <Badge status="success" text="Có hiệu lực" />;
        }

        return <Badge status="error" text="Vô hiệu lực" />;
    };

    const showedPropertiesFragment = (entity: any) => [
        <div key="id">{entity.id}</div>,
        <div key="createdAt">
            {DateUtils.isoDateToString(entity.createdAt)}
        </div>,
        <div key="updatedAt">
            {DateUtils.isoDateToString(entity.updatedAt)}
        </div>,
        <div key="code">
            <Text
                strong={Boolean(
                    searchToken && entity.code.includes(searchToken),
                )}
                style={
                    searchToken && entity.code.includes(searchToken)
                        ? { backgroundColor: "#e6f7ff" }
                        : {}
                }
            >
                {entity.code}
            </Text>
        </div>,
        <div key="name">
            <Text
                strong={Boolean(
                    searchToken && entity.name.includes(searchToken),
                )}
                style={
                    searchToken && entity.name.includes(searchToken)
                        ? { backgroundColor: "#e6f7ff" }
                        : {}
                }
            >
                {entity.name}
            </Text>
        </div>,
        <div key="status">{getRoleStatusBadge(entity.status)}</div>,
    ];

    const entityDetailTableRowsFragment = (entity: any) => (
        <>
            <tr>
                <td>{RoleConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{RoleConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{RoleConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{RoleConfigs.properties.code.label}</td>
                <td>
                    <Typography.Text code>{entity.code}</Typography.Text>
                </td>
            </tr>
            <tr>
                <td>{RoleConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{RoleConfigs.properties.status.label}</td>
                <td>{getRoleStatusBadge(entity.status)}</td>
            </tr>
        </>
    );

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={RoleConfigs.manageTitleLinks}
                    title={RoleConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={
                        listResponse as unknown as ListResponse<unknown>
                    }
                    resourceUrl={RoleConfigs.resourceUrl}
                    resourceKey={RoleConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain
                listResponse={listResponse as unknown as ListResponse<unknown>}
                isLoading={isLoading}
            >
                <ManageTable
                    listResponse={
                        listResponse as unknown as ListResponse<BaseResponse>
                    }
                    properties={RoleConfigs.properties}
                    resourceUrl={RoleConfigs.resourceUrl}
                    resourceKey={RoleConfigs.resourceKey}
                    showedPropertiesFragment={showedPropertiesFragment}
                    entityDetailTableRowsFragment={
                        entityDetailTableRowsFragment
                    }
                />
            </ManageMain>

            <ManagePagination
                listResponse={listResponse as unknown as ListResponse<unknown>}
            />
        </Space>
    );
}

export default RoleManage;
