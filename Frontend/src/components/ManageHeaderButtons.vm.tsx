"use client";
import React from "react";
import { Modal, Typography, theme } from "antd";
import useDeleteByIdsApi from "@/hooks/use-delete-by-ids-api";
import useAppStore from "@/stores/use-app-store";
import NotifyUtils from "@/utils/NotifyUtils";
import { ManageHeaderButtonsProps } from "./ManageHeaderButtons";

const { Text } = Typography;
const { useToken } = theme;

function useManageHeaderButtonsViewModel({
    listResponse,
    resourceUrl,
    resourceKey,
}: ManageHeaderButtonsProps) {
    const { token } = useToken();
    const deleteByIdsApi = useDeleteByIdsApi(resourceUrl, resourceKey);
    const { selection, setSelection, activePage, setActivePage } =
        useAppStore();

    const handleDeleteBatchEntitiesButton = () => {
        if (selection.length > 0) {
            Modal.confirm({
                title: <strong>Xác nhận xóa</strong>,
                content: (
                    <Text>Xóa (các) phần tử có ID {selection.join(", ")}?</Text>
                ),
                okText: "Xóa",
                cancelText: "Không xóa",
                okButtonProps: { danger: true },
                width: 400,
                centered: true,
                maskClosable: false,
                onOk: () => handleConfirmedDeleteBatchEntitiesButton(selection),
            });
        } else {
            NotifyUtils.simple("Vui lòng chọn ít nhất một phần tử để xóa");
        }
    };

    const handleConfirmedDeleteBatchEntitiesButton = (entityIds: number[]) => {
        if (entityIds.length > 0) {
            deleteByIdsApi.mutate(entityIds, {
                onSuccess: () => {
                    if (listResponse.content.length === selection.length) {
                        setActivePage(activePage - 1 || 1);
                    }
                    setSelection([]);
                },
            });
        }
    };

    return { handleDeleteBatchEntitiesButton };
}

export default useManageHeaderButtonsViewModel;
