"use client";
import React from "react";
import { Typography, theme, Modal as AntModal } from "antd"; // Giữ lại Typography của Ant Design
import { Modal } from "@mantine/core"; // Thay đổi sang Modal của Mantine
import useDeleteByIdApi from "@/hooks/use-delete-by-id-api";
import BaseResponse from "@/models/BaseResponse";
import useAppStore from "@/stores/use-app-store";
import { ManageTableProps } from "./ManageTable";
import EntityDetailTable from "../EntityDetailTable";
import { useDisclosure } from "@mantine/hooks";

const { Text } = Typography;
const { useToken } = theme;

function useManageTableViewModel<T extends BaseResponse>({
    listResponse,
    properties,
    resourceUrl,
    resourceKey,
    entityDetailTableRowsFragment,
}: ManageTableProps<T>) {
    const { token } = useToken();
    const deleteByIdApi = useDeleteByIdApi(resourceUrl, resourceKey);

    // State cho Modal của Mantine
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedEntityId, setSelectedEntityId] = React.useState<
        number | null
    >(null);

    const { selection, setSelection, activePage, setActivePage } =
        useAppStore();

    const tableHeads = Object.values(properties).flatMap((propertySpec) =>
        propertySpec.isShowInTable ? propertySpec.label : [],
    );

    const handleToggleAllRowsCheckbox = () => {
        setSelection((current) => {
            return current.length === listResponse.content.length
                ? []
                : listResponse.content.map((entity) => entity.id);
        });
    };

    const handleToggleRowCheckbox = (entityId: number) => {
        setSelection((current) => {
            return current.includes(entityId)
                ? current.filter((item) => item !== entityId)
                : [...current, entityId];
        });
    };

    const handleViewEntityButton = (entityId: number) => {
        // Lưu ID và mở modal
        setSelectedEntityId(entityId);
        open();
    };

    const handleDeleteEntityButton = (entityId: number) => {
        AntModal.confirm({
            title: <strong>Xác nhận xóa</strong>,
            content: <Text>Xóa phần tử có ID {entityId}?</Text>,
            okText: "Xóa",
            cancelText: "Không xóa",
            okButtonProps: { danger: true },
            width: 400,
            centered: true,
            maskClosable: false,
            onOk: () => handleConfirmedDeleteEntityButton(entityId),
        });
    };

    const handleConfirmedDeleteEntityButton = (entityId: number) => {
        deleteByIdApi.mutate(entityId, {
            onSuccess: () => {
                if (listResponse.content.length === 1) {
                    setActivePage(activePage - 1 || 1);
                }
            },
        });
    };

    return {
        listResponse,
        selection,
        tableHeads,
        handleToggleAllRowsCheckbox,
        handleToggleRowCheckbox,
        handleViewEntityButton,
        handleDeleteEntityButton,
        modalProps: {
            opened,
            onClose: close,
            selectedEntityId,
            entityDetailTableRowsFragment,
            resourceUrl,
            resourceKey,
        },
    };
}

export default useManageTableViewModel;
