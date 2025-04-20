import React from "react";
import { Button, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ListResponse } from "@/utils/FetchUtils";
import useManageHeaderButtonsViewModel from "./ManageHeaderButtons.vm";

export interface ManageHeaderButtonsProps {
    listResponse: ListResponse;
    resourceUrl: string;
    resourceKey: string;
}

function ManageHeaderButtons(props: ManageHeaderButtonsProps) {
    const { handleDeleteBatchEntitiesButton } =
        useManageHeaderButtonsViewModel(props);

    return (
        <Space size="small">
            <Link href="create" passHref>
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
