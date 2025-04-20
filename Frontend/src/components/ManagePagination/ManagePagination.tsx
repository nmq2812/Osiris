import React from "react";
import { Row, Pagination, Select, Typography, Space } from "antd";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import useManagePaginationViewModel from "./ManagePagination.vm";

const { Text } = Typography;

interface ManagePaginationProps {
    listResponse: ListResponse;
}

function ManagePagination({ listResponse }: ManagePaginationProps) {
    const {
        activePage,
        activePageSize,
        handlePaginationButton,
        handlePageSizeSelect,
    } = useManagePaginationViewModel();

    const pageSizeSelectOptions = PageConfigs.initialPageSizeSelectList.map(
        (pageSize) => ({
            value: pageSize.value,
            label: pageSize.label,
            disabled: Number(pageSize.value) > listResponse.totalElements,
        }),
    );

    if (listResponse.totalElements === 0) {
        return null;
    }

    return (
        <Row justify="space-between" align="middle">
            <Text>
                <Text strong style={{ marginRight: 4 }}>
                    Trang {activePage}
                </Text>
                <span>/ {listResponse.totalPages} </span>
                <Text type="secondary" style={{ fontSize: 14 }}>
                    ({listResponse.totalElements})
                </Text>
            </Text>

            <Pagination
                current={activePage}
                total={listResponse.totalElements}
                pageSize={activePageSize}
                onChange={handlePaginationButton}
                showSizeChanger={false}
                size="small"
            />

            <Space>
                <Text style={{ fontSize: 14 }}>Số hàng trên trang</Text>
                <Select
                    style={{ width: 72 }}
                    options={pageSizeSelectOptions}
                    value={String(activePageSize)}
                    onChange={handlePageSizeSelect}
                    size="small"
                />
            </Space>
        </Row>
    );
}

export default React.memo(ManagePagination);
