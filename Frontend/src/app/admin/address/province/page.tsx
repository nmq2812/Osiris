"use client";
import React, { useState } from "react";
import { Space, Typography, Table, Button, Modal, Checkbox, Tag } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import type { ColumnsType } from "antd/es/table";
import useGetAllApi from "@/hooks/use-get-all-api";
import useInitFilterPanelState from "@/hooks/use-init-filter-panel-state";
import useResetManagePageState from "@/hooks/use-reset-manage-page-state";
import { ProvinceResponse } from "@/models/Province";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import ProvinceConfigs from "./ProvinceConfigs";
import ManageHeader from "@/components/ManageHeader";
import ManageHeaderTitle from "@/components/ManageHeaderTitle";
import ManageHeaderButtons from "@/components/ManageHeaderButtons";
import SearchPanel from "@/components/SearchPanel/SearchPanel";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import ManageMain from "@/components/ManageMain";

import useDeleteByIdApi from "@/hooks/use-delete-by-id-api";
import EntityDetailTable from "@/components/EntityDetailTable";
import ManagePagination from "@/components/ManagePagination/ManagePagination";

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
    );

    const { searchToken, selection, setSelection } = useAppStore();
    const deleteByIdApi = useDeleteByIdApi(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
    );

    // Handle entity detail view
    const showEntityDetail = (entityId: number) => {
        const entity = listResponse.content.find(
            (item) => item.id === entityId,
        );
        if (!entity) return;

        Modal.info({
            title: <strong>Thông tin chi tiết</strong>,
            content: (
                <EntityDetailTable
                    entityDetailTableRowsFragment={(entity) =>
                        entityDetailTableRowsFragment(
                            entity as ProvinceResponse,
                        )
                    }
                    resourceUrl={ProvinceConfigs.resourceUrl}
                    resourceKey={ProvinceConfigs.resourceKey}
                    entityId={entityId}
                />
            ),
            width: 800,
            maskClosable: true,
            centered: true,
            okText: "Đóng",
        });
    };

    // Handle entity deletion
    const showDeleteConfirm = (entityId: number) => {
        Modal.confirm({
            title: <strong>Xác nhận xóa</strong>,
            content: <Text>Xóa phần tử có ID {entityId}?</Text>,
            okText: "Xóa",
            cancelText: "Không xóa",
            okButtonProps: { danger: true },
            onOk: () => deleteByIdApi.mutate(entityId),
        });
    };

    // For backward compatibility, still define the fragment function for modals
    const entityDetailTableRowsFragment = (entity: ProvinceResponse) => {
        return (
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
    };

    // Define columns for Ant Design Table
    const columns: ColumnsType<ProvinceResponse> = [
        {
            title: (
                <Checkbox
                    checked={
                        selection.length === listResponse.content.length &&
                        listResponse.content.length > 0
                    }
                    indeterminate={
                        selection.length > 0 &&
                        selection.length < listResponse.content.length
                    }
                    onChange={() => {
                        if (selection.length === listResponse.content.length) {
                            setSelection([]);
                        } else {
                            setSelection(
                                listResponse.content.map((item) => item.id),
                            );
                        }
                    }}
                />
            ),
            width: 50,
            render: (_, record) => (
                <Checkbox
                    checked={selection.includes(record.id)}
                    onChange={() => {
                        if (selection.includes(record.id)) {
                            setSelection(
                                selection.filter((id) => id !== record.id),
                            );
                        } else {
                            setSelection([...selection, record.id]);
                        }
                    }}
                />
            ),
        },
        {
            title: ProvinceConfigs.properties.id.label,
            dataIndex: "id",
            key: "id",
            width: 70,
        },
        {
            title: ProvinceConfigs.properties.createdAt.label,
            key: "createdAt",
            render: (_, record) => DateUtils.isoDateToString(record.createdAt),
            width: 140,
        },
        {
            title: ProvinceConfigs.properties.updatedAt.label,
            key: "updatedAt",
            render: (_, record) => DateUtils.isoDateToString(record.updatedAt),
            width: 140,
        },
        {
            title: ProvinceConfigs.properties.name.label,
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Text
                    strong={Boolean(searchToken && text.includes(searchToken))}
                    style={
                        searchToken && text.includes(searchToken)
                            ? { backgroundColor: "#e6f7ff" }
                            : {}
                    }
                >
                    {text}
                </Text>
            ),
        },
        {
            title: ProvinceConfigs.properties.code.label,
            dataIndex: "code",
            key: "code",
            render: (text, record) => (
                <Text
                    strong={Boolean(searchToken && text.includes(searchToken))}
                    style={
                        searchToken && text.includes(searchToken)
                            ? { backgroundColor: "#e6f7ff" }
                            : {}
                    }
                >
                    {text}
                </Text>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        shape="circle"
                        onClick={() => showEntityDetail(record.id)}
                        title="Xem"
                    />
                    <Link href={`update/${record.id}`} passHref>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            shape="circle"
                            style={{ backgroundColor: "#13c2c2" }}
                            title="Cập nhật"
                        />
                    </Link>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        shape="circle"
                        onClick={() => showDeleteConfirm(record.id)}
                        title="Xóa"
                    />
                </Space>
            ),
        },
    ];

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
                <Table
                    columns={columns}
                    dataSource={listResponse.content}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    bordered
                    loading={isLoading}
                    style={{ borderRadius: 8, overflow: "hidden" }}
                    rowClassName={(record) =>
                        selection.includes(record.id)
                            ? "ant-table-row-selected"
                            : ""
                    }
                />
            </ManageMain>

            <ManagePagination listResponse={listResponse} />
        </Space>
    );
}

export default ProvinceManage;
