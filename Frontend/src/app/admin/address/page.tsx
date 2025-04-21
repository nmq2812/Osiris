"use client";
import React from "react";
import { Space, Typography, Table, Button, Checkbox, Modal } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import useGetAllApi from "@/hooks/use-get-all-api";
import useDeleteByIdApi from "@/hooks/use-delete-by-id-api";
import useInitFilterPanelState from "@/hooks/use-init-filter-panel-state";
import useResetManagePageState from "@/hooks/use-reset-manage-page-state";
import { AddressResponse } from "@/models/Address";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import AddressConfigs from "./AddressConfigs";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import ManageHeader from "@/components/ManageHeader";
import ManageHeaderButtons from "@/components/ManageHeaderButtons";
import ManageHeaderTitle from "@/components/ManageHeaderTitle";
import ManageMain from "@/components/ManageMain";
import ManagePagination from "@/components/ManagePagination/ManagePagination";
import SearchPanel from "@/components/SearchPanel/SearchPanel";
import EntityDetailTable from "@/components/EntityDetailTable";

const { Text } = Typography;

function AddressManage() {
    useResetManagePageState();
    useInitFilterPanelState(AddressConfigs.properties);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<AddressResponse>,
    } = useGetAllApi<AddressResponse>(
        AddressConfigs.resourceUrl,
        AddressConfigs.resourceKey,
    );

    const { searchToken, selection, setSelection } = useAppStore();
    const deleteByIdApi = useDeleteByIdApi(
        AddressConfigs.resourceUrl,
        AddressConfigs.resourceKey,
    );

    // Handle view entity details
    const handleViewEntityButton = (entityId: number) => {
        Modal.info({
            title: <strong>Thông tin chi tiết</strong>,
            content: (
                <EntityDetailTable
                    entityDetailTableRowsFragment={(entity) =>
                        entityDetailTableRowsFragment(entity as AddressResponse)
                    }
                    resourceUrl={AddressConfigs.resourceUrl}
                    resourceKey={AddressConfigs.resourceKey}
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
    const handleDeleteEntityButton = (entityId: number) => {
        Modal.confirm({
            title: <strong>Xác nhận xóa</strong>,
            content: <Text>Xóa phần tử có ID {entityId}?</Text>,
            okText: "Xóa",
            cancelText: "Không xóa",
            okButtonProps: { danger: true },
            width: 400,
            centered: true,
            maskClosable: false,
            onOk: () => deleteByIdApi.mutate(entityId),
        });
    };

    // Handle toggle all checkboxes
    const handleToggleAllRowsCheckbox = () => {
        if (selection.length === listResponse.content.length) {
            setSelection([]);
        } else {
            setSelection(listResponse.content.map((item) => item.id));
        }
    };

    // Handle single row checkbox toggle
    const handleToggleRowCheckbox = (entityId: number) => {
        if (selection.includes(entityId)) {
            setSelection(selection.filter((id) => id !== entityId));
        } else {
            setSelection([...selection, entityId]);
        }
    };

    // Define the columns directly for the Ant Design Table
    const tableHeads = Object.values(AddressConfigs.properties).flatMap(
        (propertySpec) =>
            propertySpec.isShowInTable ? propertySpec.label : [],
    );

    const columns = [
        {
            title: (
                <Checkbox
                    onChange={handleToggleAllRowsCheckbox}
                    checked={
                        selection.length === listResponse.content.length &&
                        listResponse.content.length > 0
                    }
                    indeterminate={
                        selection.length > 0 &&
                        selection.length !== listResponse.content.length
                    }
                />
            ),
            width: 40,
            render: (_: any, entity: AddressResponse) => (
                <Checkbox
                    checked={selection.includes(entity.id)}
                    onChange={() => handleToggleRowCheckbox(entity.id)}
                />
            ),
        },
        {
            title: AddressConfigs.properties.id.label,
            dataIndex: "id",
            key: "id",
            width: 70,
        },
        {
            title: AddressConfigs.properties.createdAt.label,
            key: "createdAt",
            render: (_: any, record: AddressResponse) =>
                DateUtils.isoDateToString(record.createdAt),
            width: 140,
        },
        {
            title: AddressConfigs.properties.updatedAt.label,
            key: "updatedAt",
            render: (_: any, record: AddressResponse) =>
                DateUtils.isoDateToString(record.updatedAt),
            width: 140,
        },
        {
            title: AddressConfigs.properties.line.label,
            dataIndex: "line",
            key: "line",
            render: (text: string) => (
                <Text
                    strong={Boolean(searchToken && text?.includes(searchToken))}
                    style={
                        searchToken && text?.includes(searchToken)
                            ? { backgroundColor: "#e6f7ff" }
                            : {}
                    }
                >
                    {text || ""}
                </Text>
            ),
        },
        {
            title: AddressConfigs.properties["province.name"].label,
            key: "province.name",
            render: (_: any, record: AddressResponse) => (
                <Text
                    strong={Boolean(
                        searchToken &&
                            record.province?.name?.includes(searchToken),
                    )}
                    style={
                        searchToken &&
                        record.province?.name?.includes(searchToken)
                            ? { backgroundColor: "#e6f7ff" }
                            : {}
                    }
                >
                    {record.province?.name || ""}
                </Text>
            ),
        },
        {
            title: AddressConfigs.properties["district.name"].label,
            key: "district.name",
            render: (_: any, record: AddressResponse) => (
                <Text
                    strong={Boolean(
                        searchToken &&
                            record.district?.name?.includes(searchToken),
                    )}
                    style={
                        searchToken &&
                        record.district?.name?.includes(searchToken)
                            ? { backgroundColor: "#e6f7ff" }
                            : {}
                    }
                >
                    {record.district?.name || ""}
                </Text>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            width: 120,
            render: (_: any, entity: AddressResponse) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        shape="circle"
                        onClick={() => handleViewEntityButton(entity.id)}
                        title="Xem"
                    />
                    <Link href={`update/${entity.id}`} passHref>
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
                        onClick={() => handleDeleteEntityButton(entity.id)}
                        title="Xóa"
                    />
                </Space>
            ),
        },
    ];

    // Keep the entity detail table rows fragment for modal display
    const entityDetailTableRowsFragment = (entity: AddressResponse) => (
        <>
            <tr>
                <td>{AddressConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties.line.label}</td>
                <td>{entity.line}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties["province.name"].label}</td>
                <td>{entity.province?.name}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties["province.code"].label}</td>
                <td>{entity.province?.code}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties["district.name"].label}</td>
                <td>{entity.district?.name}</td>
            </tr>
            <tr>
                <td>{AddressConfigs.properties["district.code"].label}</td>
                <td>{entity.district?.code}</td>
            </tr>
        </>
    );

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={AddressConfigs.manageTitleLinks}
                    title={AddressConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={AddressConfigs.resourceUrl}
                    resourceKey={AddressConfigs.resourceKey}
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

export default AddressManage;
