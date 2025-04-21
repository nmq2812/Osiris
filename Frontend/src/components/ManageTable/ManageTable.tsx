"use client";
import React, { useCallback, useMemo } from "react";
import { Table, Checkbox, Space, Button, Typography } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { EntityPropertySchema } from "@/datas/EntityProperty";
import BaseResponse from "@/models/BaseResponse";
import { ListResponse } from "@/utils/FetchUtils";
import useManageTableViewModel from "./ManageTable.vm";

export interface ManageTableProps<T extends BaseResponse> {
    listResponse: ListResponse<T>;
    properties: EntityPropertySchema;
    resourceUrl: string;
    resourceKey: string;
    showedPropertiesFragment: (entity: T) => React.ReactNode;
    entityDetailTableRowsFragment: (entity: T) => React.ReactNode;
}

function ManageTable<T extends BaseResponse>({
    listResponse,
    properties,
    resourceUrl,
    resourceKey,
    showedPropertiesFragment,
    entityDetailTableRowsFragment,
}: ManageTableProps<T>) {
    // This pattern helps TypeScript better infer the generic type from props
    const {
        listResponse: typedListResponse,
        selection,
        tableHeads,
        handleToggleAllRowsCheckbox,
        handleToggleRowCheckbox,
        handleViewEntityButton,
        handleDeleteEntityButton,
    } = useManageTableViewModel<T>({
        listResponse,
        properties,
        resourceUrl,
        resourceKey,
        showedPropertiesFragment,
        entityDetailTableRowsFragment,
    });

    // Memoize the row className function
    const getRowClassName = useCallback(
        (record: BaseResponse) =>
            selection.includes(record.id) ? "ant-table-row-selected" : "",
        [selection],
    );

    // Memoize column definitions to prevent unnecessary re-renders
    const columns = useMemo(
        () => [
            {
                title: (
                    <Checkbox
                        onChange={handleToggleAllRowsCheckbox}
                        checked={
                            selection.length === listResponse.content.length
                        }
                        indeterminate={
                            selection.length > 0 &&
                            selection.length !== listResponse.content.length
                        }
                    />
                ),
                width: 40,
                render: (_: any, entity: BaseResponse) => (
                    <Checkbox
                        checked={selection.includes(entity.id)}
                        onChange={() => handleToggleRowCheckbox(entity.id)}
                    />
                ),
            },
            ...tableHeads.map((head, index) => ({
                title: head,
                dataIndex: `column_${index}`,
                key: `column_${index}`,
                render: (_: any, entity: T) => {
                    const propertyValues = showedPropertiesFragment(entity);
                    return React.Children.toArray(propertyValues)[index];
                },
            })),
            {
                title: "Thao tác",
                key: "action",
                width: 120,
                render: (_: any, entity: BaseResponse) => (
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
        ],
        [
            handleToggleAllRowsCheckbox,
            handleToggleRowCheckbox,
            handleViewEntityButton,
            handleDeleteEntityButton,
            selection,
            listResponse.content.length,
            tableHeads,
            showedPropertiesFragment,
        ],
    );

    return (
        <Table
            columns={columns}
            dataSource={listResponse.content}
            rowKey="id"
            pagination={false}
            size="middle"
            bordered
            style={{ borderRadius: 8, overflow: "hidden" }}
            rowClassName={getRowClassName}
        />
    );
}

export default React.memo(ManageTable);
