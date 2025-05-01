"use client";
import React from "react";
import { Avatar, Badge, Tag, Space, Typography } from "antd";
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
import { UserResponse } from "@/models/User";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import UserConfigs from "./UserConfigs";

function UserManage() {
    const { Text } = Typography;
    useResetManagePageState();
    useInitFilterPanelState(UserConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<UserResponse>,
    } = useGetAllApi<UserResponse>(
        UserConfigs.resourceUrl,
        UserConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const userStatusBadgeFragment = (status: number) => {
        if (status === 1) {
            return <Badge status="success" text="Đã kích hoạt" />;
        }
        return <Badge status="error" text="Chưa kích hoạt" />;
    };

    const showedPropertiesFragment = (entity: any) => [
        // Trả về mảng các phần tử React thay vì <td>
        <span key="id">{entity.id}</span>,
        <span key="username">
            <Text
                strong={Boolean(
                    searchToken && entity.username?.includes(searchToken),
                )}
                style={
                    searchToken && entity.username?.includes(searchToken)
                        ? { backgroundColor: "#e6f7ff" }
                        : {}
                }
            >
                {entity.username}
            </Text>
        </span>,
        <span key="fullname">
            <Text
                strong={Boolean(
                    searchToken && entity.fullname?.includes(searchToken),
                )}
                style={
                    searchToken && entity.fullname?.includes(searchToken)
                        ? { backgroundColor: "#e6f7ff" }
                        : {}
                }
            >
                {entity.fullname}
            </Text>
        </span>,
        <span key="phone">
            <Text
                strong={Boolean(
                    searchToken && entity.phone?.includes(searchToken),
                )}
                style={
                    searchToken && entity.phone?.includes(searchToken)
                        ? { backgroundColor: "#e6f7ff" }
                        : {}
                }
            >
                {entity.phone}
            </Text>
        </span>,
        <span key="gender">{entity.gender === "M" ? "Nam" : "Nữ"}</span>,
        <span key="avatar">
            <Avatar src={entity.avatar} alt={entity.fullname} size="small" />
        </span>,
        <span key="status">{userStatusBadgeFragment(entity.status)}</span>,
        <span key="roles">
            <Space
                direction="vertical"
                size="small"
                style={{ display: "flex" }}
            >
                {entity.roles.map((role: any, index: React.Key) => (
                    <Tag key={index} color="blue">
                        {role.name}
                    </Tag>
                ))}
            </Space>
        </span>,
    ];
    const entityDetailTableRowsFragment = (entity: any) => (
        <>
            <tr>
                <td>{UserConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.username.label}</td>
                <td>{entity.username}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.fullname.label}</td>
                <td>{entity.fullname}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.email.label}</td>
                <td>{entity.email}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.phone.label}</td>
                <td>{entity.phone}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.gender.label}</td>
                <td>{entity.gender === "M" ? "Nam" : "Nữ"}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties["address.line"].label}</td>
                <td>{entity.address.line}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties["address.province.name"].label}</td>
                <td>{entity.address.province?.name}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties["address.province.code"].label}</td>
                <td>{entity.address.province?.code}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties["address.district.name"].label}</td>
                <td>{entity.address.district?.name}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties["address.district.code"].label}</td>
                <td>{entity.address.district?.code}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.avatar.label}</td>
                <td>
                    <Avatar
                        src={entity.avatar}
                        alt={entity.fullname}
                        shape="circle"
                        size="small"
                    />
                </td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.status.label}</td>
                <td>{userStatusBadgeFragment(entity.status)}</td>
            </tr>
            <tr>
                <td>{UserConfigs.properties.roles.label}</td>
                <td>
                    <Space
                        direction="vertical"
                        size="small"
                        style={{ width: "100%" }}
                    >
                        {entity.roles.map(
                            (
                                role: {
                                    name:
                                        | string
                                        | number
                                        | bigint
                                        | boolean
                                        | React.ReactElement<
                                              unknown,
                                              | string
                                              | React.JSXElementConstructor<any>
                                          >
                                        | Iterable<React.ReactNode>
                                        | React.ReactPortal
                                        | Promise<
                                              | string
                                              | number
                                              | bigint
                                              | boolean
                                              | React.ReactPortal
                                              | React.ReactElement<
                                                    unknown,
                                                    | string
                                                    | React.JSXElementConstructor<any>
                                                >
                                              | Iterable<React.ReactNode>
                                              | null
                                              | undefined
                                          >
                                        | null
                                        | undefined;
                                },
                                index: React.Key | null | undefined,
                            ) => (
                                <Badge
                                    key={index}
                                    status="default"
                                    text={role.name}
                                ></Badge>
                            ),
                        )}
                    </Space>
                </td>
            </tr>
        </>
    );

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={UserConfigs.manageTitleLinks}
                    title={UserConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={UserConfigs.resourceUrl}
                    resourceKey={UserConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={UserConfigs.properties}
                    resourceUrl={UserConfigs.resourceUrl}
                    resourceKey={UserConfigs.resourceKey}
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

export default UserManage;
