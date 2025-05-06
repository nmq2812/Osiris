"use client";
import { EntityPropertySchema } from "@/datas/EntityProperty";
import BaseResponse from "@/models/BaseResponse";
import { ListResponse } from "@/utils/FetchUtils";
import {
    Group,
    ActionIcon,
    Checkbox,
    Table,
    Modal,
    Title,
} from "@mantine/core";
import React from "react";
import { Eye, Link, Edit, Trash } from "tabler-icons-react";
import useManageTableViewModel from "./ManageTable.vm";
import useManageTableStyles from "./ManageTable.styles";
import { usePathname, useRouter } from "next/navigation";
import EntityDetailTable from "../EntityDetailTable";

export interface ManageTableProps<T> {
    listResponse: ListResponse<T>;
    properties: EntityPropertySchema;
    resourceUrl: string;
    resourceKey: string;
    showedPropertiesFragment: (entity: T) => React.ReactNode;
    entityDetailTableRowsFragment: (entity: T) => React.ReactNode;
}

function ManageTable<T extends BaseResponse>(props: ManageTableProps<T>) {
    const { classes, cx } = useManageTableStyles();
    const pathname = usePathname();
    const route = useRouter();

    const {
        listResponse,
        selection,
        tableHeads,
        handleToggleAllRowsCheckbox,
        handleToggleRowCheckbox,
        handleViewEntityButton,
        handleDeleteEntityButton,
        modalProps,
    } = useManageTableViewModel<T>(props);

    const entitiesTableHeadsFragment = (
        <tr>
            <th style={{ width: 40 }}>
                <Checkbox
                    onChange={handleToggleAllRowsCheckbox}
                    checked={selection.length === listResponse.content.length}
                    indeterminate={
                        selection.length > 0 &&
                        selection.length !== listResponse.content.length
                    }
                    transitionDuration={0}
                />
            </th>
            {tableHeads.map((item) => (
                <th key={item}>{item}</th>
            ))}
            <th style={{ width: 120 }}>Thao tác</th>
        </tr>
    );

    const entitiesTableRowsFragment = listResponse.content.map((entity) => {
        const selected = selection.includes(entity.id);

        return (
            <tr
                key={entity.id}
                className={cx({
                    [classes.rowSelected]: selected,
                })}
            >
                <td>
                    <Checkbox
                        checked={selection.includes(entity.id)}
                        onChange={() => handleToggleRowCheckbox(entity.id)}
                        transitionDuration={0}
                    />
                </td>
                {props.showedPropertiesFragment(entity as T)}
                <td>
                    <Group spacing="xs">
                        <ActionIcon
                            color="blue"
                            variant="outline"
                            size={24}
                            title="Xem"
                            onClick={() => handleViewEntityButton(entity.id)}
                        >
                            <Eye size={16} />
                        </ActionIcon>
                        <ActionIcon
                            component={Link}
                            onClick={() => {
                                route.replace(
                                    `${pathname}/update/${entity.id}`,
                                );
                            }}
                            color="teal"
                            variant="outline"
                            size={24}
                            title="Cập nhật"
                        >
                            <Edit size={16} />
                        </ActionIcon>
                        <ActionIcon
                            color="red"
                            variant="outline"
                            size={24}
                            title="Xóa"
                            onClick={() => handleDeleteEntityButton(entity.id)}
                        >
                            <Trash size={16} />
                        </ActionIcon>
                    </Group>
                </td>
            </tr>
        );
    });

    return (
        <>
            <Table
                horizontalSpacing="sm"
                verticalSpacing="sm"
                highlightOnHover
                striped
                sx={(theme) => ({
                    borderRadius: theme.radius.sm,
                    overflow: "hidden",
                })}
            >
                <thead>{entitiesTableHeadsFragment}</thead>
                <tbody>{entitiesTableRowsFragment}</tbody>
            </Table>

            {/* Mantine Modal */}
            <Modal
                opened={modalProps.opened}
                onClose={modalProps.onClose}
                title={<Title order={4}>Thông tin chi tiết</Title>}
                size="xl"
                centered
            >
                {modalProps.selectedEntityId && (
                    <EntityDetailTable
                        entityDetailTableRowsFragment={
                            modalProps.entityDetailTableRowsFragment
                        }
                        resourceUrl={modalProps.resourceUrl}
                        resourceKey={modalProps.resourceKey}
                        entityId={modalProps.selectedEntityId}
                    />
                )}
            </Modal>
        </>
    );
}

export default ManageTable;
