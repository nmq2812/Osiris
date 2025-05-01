"use client";
import React from "react";
import { Badge, Typography, Space } from "antd"; // Thay thế Mantine bằng Ant Design
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

const { Text } = Typography;

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
            return <Badge status="success" text="Đang hoạt động" />;
        }

        if (status === 2) {
            return <Badge status="warning" text="Ít hoạt động" />;
        }

        return <Badge status="error" text="Không hoạt động" />;
    };

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
        <span key="address-line">
            <Text
                strong={Boolean(
                    searchToken && entity.address?.line?.includes(searchToken),
                )}
                style={
                    searchToken && entity.address?.line?.includes(searchToken)
                        ? { backgroundColor: "#e6f7ff" }
                        : {}
                }
            >
                {entity.address?.line || ""}
            </Text>
        </span>,
        <span key="province-name">
            <Text
                strong={Boolean(
                    searchToken &&
                        entity.address?.province?.name?.includes(searchToken),
                )}
                style={
                    searchToken &&
                    entity.address?.province?.name?.includes(searchToken)
                        ? { backgroundColor: "#e6f7ff" }
                        : {}
                }
            >
                {entity.address?.province?.name || ""}
            </Text>
        </span>,
        <span key="status">{officeStatusBadgeFragment(entity.status)}</span>,
    ];

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
                <td>{officeStatusBadgeFragment(entity.status)}</td>
            </tr>
        </>
    );

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
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
        </Space>
    );
}

export default OfficeManage;
