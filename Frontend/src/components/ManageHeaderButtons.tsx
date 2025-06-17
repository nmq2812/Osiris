"use client";
import React, { use } from "react";
import { Button, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ListResponse } from "@/utils/FetchUtils";
import useManageHeaderButtonsViewModel from "./ManageHeaderButtons.vm";
import { usePathname } from "next/navigation";

export interface ManageHeaderButtonsProps {
    listResponse: ListResponse;
    resourceUrl: string;
    resourceKey: string;
}

function ManageHeaderButtons(props: ManageHeaderButtonsProps) {
    const { handleDeleteBatchEntitiesButton } =
        useManageHeaderButtonsViewModel(props);

    const pathName = usePathname();
    return (
        <Space size="small">
            <Link href={`${pathName}/create`} passHref>
                <Button type="default" icon={<PlusOutlined />}>
                    Thêm mới
                </Button>
            </Link>
            <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteBatchEntitiesButton}
            >
                Xóa hàng loạt
            </Button>
        </Space>
    );
}

export default React.memo(ManageHeaderButtons);
