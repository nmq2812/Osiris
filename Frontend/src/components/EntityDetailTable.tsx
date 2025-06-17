"use client";
import React, { useMemo } from "react";
import { Table, Spin, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useGetByIdApi from "@/hooks/use-get-by-id-api";

// Use the same queryClient instance that's in layout.tsx
const queryClient = new QueryClient();

interface EntityDetailTableProps<T> {
    entityDetailTableRowsFragment: (entity: T) => React.ReactNode;
    resourceUrl: string;
    resourceKey: string;
    entityId: number;
}

interface EntityDetailData {
    key: string;
    property: React.ReactNode;
    value: React.ReactNode;
}

// Inner component that uses React Query
function EntityDetailTableInner<T>({
    entityDetailTableRowsFragment,
    resourceUrl,
    resourceKey,
    entityId,
}: EntityDetailTableProps<T>) {
    const { isLoading, isError, data } = useGetByIdApi<T>(
        resourceUrl,
        resourceKey,
        entityId,
    );

    // Convert table rows to data source format
    const dataSource = useMemo(() => {
        if (!data) return [];

        // Get the fragment content
        const rowsFragment = entityDetailTableRowsFragment(data as T);

        // Convert the fragment to an array of components
        const rows = React.Children.toArray(rowsFragment);

        // Extract data from each row
        return rows
            .map((row, index) => {
                // Safely handle the row structure
                if (React.isValidElement(row)) {
                    const rowElement = row as React.ReactElement<{
                        children: React.ReactNode;
                    }>;
                    const cells = React.Children.toArray(
                        rowElement.props.children,
                    );
                    return {
                        key: `row-${index}`,
                        property: React.isValidElement(cells[0])
                            ? (
                                  cells[0] as React.ReactElement<{
                                      children: React.ReactNode;
                                  }>
                              ).props.children
                            : cells[0],
                        value: React.isValidElement(cells[1])
                            ? (
                                  cells[1] as React.ReactElement<{
                                      children: React.ReactNode;
                                  }>
                              ).props.children
                            : cells[1],
                    };
                }
                return { key: `row-${index}`, property: null, value: null };
            })
            .filter((item) => item); // Remove any undefined items
    }, [data, entityDetailTableRowsFragment]);

    // Define columns for Ant Design Table
    const columns: ColumnsType<EntityDetailData> = [
        {
            title: "Thuộc tính",
            dataIndex: "property",
            key: "property",
            width: "30%",
        },
        {
            title: "Giá trị",
            dataIndex: "value",
            key: "value",
        },
    ];

    if (isLoading) {
        return <Spin tip="Đang tải..." />;
    }

    if (isError) {
        return <Alert message="Đã có lỗi truy vấn" type="error" />;
    }

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
            size="middle"
        />
    );
}

// Wrapper component that provides QueryClient
function EntityDetailTable<T>(props: EntityDetailTableProps<T>) {
    return (
        <QueryClientProvider client={queryClient}>
            <EntityDetailTableInner<T> {...props} />
        </QueryClientProvider>
    );
}

export default EntityDetailTable;
