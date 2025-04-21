"use client";
import React from "react";
import {
    Space,
    Typography,
    Table,
    Button,
    Modal,
    Checkbox,
    Tooltip,
} from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import type { ColumnsType } from "antd/es/table";
import useGetAllApi from "@/hooks/use-get-all-api";
import useInitFilterPanelState from "@/hooks/use-init-filter-panel-state";
import useResetManagePageState from "@/hooks/use-reset-manage-page-state";
import useDeleteByIdApi from "@/hooks/use-delete-by-id-api";
import { DistrictResponse } from "@/models/District";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import DistrictConfigs from "./DistrictConfigs";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import ManageHeader from "@/components/ManageHeader";
import ManageHeaderButtons from "@/components/ManageHeaderButtons";
import ManageHeaderTitle from "@/components/ManageHeaderTitle";
import ManageMain from "@/components/ManageMain";
import ManagePagination from "@/components/ManagePagination/ManagePagination";
import SearchPanel from "@/components/SearchPanel/SearchPanel";
import EntityDetailTable from "@/components/EntityDetailTable";

const { Text } = Typography;

function DistrictManage() {
    useResetManagePageState();
    useInitFilterPanelState(DistrictConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<DistrictResponse>,
    } = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
    );

    const { searchToken, selection, setSelection } = useAppStore();
    const deleteByIdApi = useDeleteByIdApi(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
    );

    // Entity detail view handler
    const showEntityDetail = (entityId: number) => {
        Modal.info({
            title: <strong>Thông tin chi tiết</strong>,
            content: (
                <EntityDetailTable
                    entityDetailTableRowsFragment={(entity) =>
                        entityDetailTableRowsFragment(
                            entity as DistrictResponse,
                        )
                    }
                    resourceUrl={DistrictConfigs.resourceUrl}
                    resourceKey={DistrictConfigs.resourceKey}
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

    // For backward compatibility, keep the fragment function for modals
    const entityDetailTableRowsFragment = (entity: DistrictResponse) => (
        <>
            <tr>
                <td>{DistrictConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{DistrictConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{DistrictConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{DistrictConfigs.properties.name.label}</td>
                <td>{entity.name}</td>
            </tr>
            <tr>
                <td>{DistrictConfigs.properties.code.label}</td>
                <td>{entity.code}</td>
            </tr>
            <tr>
                <td>{DistrictConfigs.properties["province.name"].label}</td>
                <td>{entity.province.name}</td>
            </tr>
            <tr>
                <td>{DistrictConfigs.properties["province.code"].label}</td>
                <td>{entity.province.code}</td>
            </tr>
        </>
    );

    // Define columns for Ant Design Table
    const columns: ColumnsType<DistrictResponse> = [
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
            title: DistrictConfigs.properties.id.label,
            dataIndex: "id",
            key: "id",
            width: 70,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: DistrictConfigs.properties.createdAt.label,
            key: "createdAt",
            render: (_, record) => DateUtils.isoDateToString(record.createdAt),
            width: 140,
            sorter: (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            responsive: ["md"],
        },
        {
            title: DistrictConfigs.properties.updatedAt.label,
            key: "updatedAt",
            render: (_, record) => DateUtils.isoDateToString(record.updatedAt),
            width: 140,
            sorter: (a, b) =>
                new Date(a.updatedAt).getTime() -
                new Date(b.updatedAt).getTime(),
            responsive: ["lg"],
        },
        {
            title: DistrictConfigs.properties.name.label,
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
            title: DistrictConfigs.properties.code.label,
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
            title: DistrictConfigs.properties["province.name"].label,
            dataIndex: ["province", "name"],
            key: "province.name",
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
            title: DistrictConfigs.properties["province.code"].label,
            dataIndex: ["province", "code"],
            key: "province.code",
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
                    <Tooltip title="Xem">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            size="small"
                            shape="circle"
                            onClick={() => showEntityDetail(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Cập nhật">
                        <Link href={`update/${record.id}`} passHref>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                size="small"
                                shape="circle"
                                style={{ backgroundColor: "#13c2c2" }}
                            />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            shape="circle"
                            onClick={() => showDeleteConfirm(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={DistrictConfigs.manageTitleLinks}
                    title={DistrictConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={DistrictConfigs.resourceUrl}
                    resourceKey={DistrictConfigs.resourceKey}
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

export default DistrictManage;
