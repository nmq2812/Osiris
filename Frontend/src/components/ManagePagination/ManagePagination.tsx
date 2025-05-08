"use client";
import React, { forwardRef } from "react";
import { Group, Pagination, Select, Text } from "@mantine/core";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import useManagePaginationViewModel from "./ManagePagination.vm";

interface ManagePaginationProps {
    listResponse: ListResponse;
}

// Sử dụng forwardRef để xử lý ref đúng cách trong React 19
const ManagePagination = forwardRef<HTMLDivElement, ManagePaginationProps>(
    function ManagePagination({ listResponse }, ref) {
        const {
            activePage,
            activePageSize,
            handlePaginationButton,
            handlePageSizeSelect,
        } = useManagePaginationViewModel();

        const pageSizeSelectList = PageConfigs.initialPageSizeSelectList.map(
            (pageSize) =>
                Number(pageSize.value) > listResponse.totalElements
                    ? { ...pageSize, disabled: true }
                    : pageSize,
        );

        if (listResponse.totalElements === 0) {
            return null;
        }

        return (
            <div ref={ref}>
                <Group position="apart">
                    <Text>
                        <Text component="span" weight={500}>
                            Trang {activePage}
                        </Text>
                        <span> / {listResponse.totalPages} </span>
                        <Text component="span" color="gray" size="sm">
                            ({listResponse.totalElements})
                        </Text>
                    </Text>
                    <Pagination
                        page={activePage}
                        total={listResponse.totalPages}
                        onChange={handlePaginationButton}
                    />
                    <Group>
                        <Text size="sm">Số hàng trên trang</Text>
                        <Select
                            sx={{ width: 72 }}
                            variant="filled"
                            data={pageSizeSelectList}
                            value={String(activePageSize)}
                            onChange={handlePageSizeSelect}
                        />
                    </Group>
                </Group>
            </div>
        );
    },
);

export default React.memo(ManagePagination);
