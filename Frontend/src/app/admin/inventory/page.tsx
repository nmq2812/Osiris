"use client";
import React, { useState } from "react";
import { Space, Table, Typography, Button, Modal, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ManageHeader from "@/components/ManageHeader";
import ManageHeaderTitle from "@/components/ManageHeaderTitle";
import ManageMain from "@/components/ManageMain";
import ManagePagination from "@/components/ManagePagination/ManagePagination";
import useGetAllApi from "@/hooks/use-get-all-api";
import useResetManagePageState from "@/hooks/use-reset-manage-page-state";
import { DocketVariantExtendedResponse } from "@/models/DocketVariantExtended";
import { ProductInventoryResponse } from "@/models/ProductInventory";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import InventoryConfigs from "./InventoryConfigs";

const { Link } = Typography;

function InventoryManage() {
    useResetManagePageState();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{
        productName: string;
        transactions: DocketVariantExtendedResponse[];
    }>({ productName: "", transactions: [] });

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<ProductInventoryResponse>,
    } = useGetAllApi<ProductInventoryResponse>(
        InventoryConfigs.productInventoryResourceUrl,
        InventoryConfigs.productInventoryResourceKey,
    );

    const handleTransactionsAnchor = (
        productName: string,
        transactions: DocketVariantExtendedResponse[],
    ) => {
        setModalData({ productName, transactions });
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: "Mã sản phẩm",
            dataIndex: ["product", "code"],
            key: "code",
        },
        {
            title: "Tên sản phẩm",
            dataIndex: ["product", "name"],
            key: "name",
        },
        {
            title: "Nhãn hiệu",
            dataIndex: ["product", "brand", "name"],
            key: "brand",
            render: (text: string, record: ProductInventoryResponse) =>
                record.product.brand?.name || "-",
        },
        {
            title: "Nhà cung cấp",
            dataIndex: ["product", "supplier", "displayName"],
            key: "supplier",
            render: (text: string, record: ProductInventoryResponse) =>
                record.product.supplier?.displayName || "-",
        },
        {
            title: "Tồn thực tế",
            dataIndex: "inventory",
            key: "inventory",
        },
        {
            title: "Chờ xuất",
            dataIndex: "waitingForDelivery",
            key: "waitingForDelivery",
        },
        {
            title: "Có thể bán",
            dataIndex: "canBeSold",
            key: "canBeSold",
        },
        {
            title: "Sắp về",
            dataIndex: "areComing",
            key: "areComing",
        },
        {
            title: "Theo dõi",
            key: "monitor",
            render: () => (
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    title="Thiết lập định mức tồn kho cho sản phẩm"
                    style={{ color: "#1890ff" }}
                />
            ),
        },
        {
            title: "Lịch sử",
            key: "history",
            render: (text: string, record: ProductInventoryResponse) => (
                <Link
                    onClick={() =>
                        handleTransactionsAnchor(
                            record.product.name,
                            record.transactions,
                        )
                    }
                >
                    Giao dịch
                </Link>
            ),
        },
    ];

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={InventoryConfigs.manageTitleLinks}
                    title={InventoryConfigs.manageTitle}
                />
            </ManageHeader>

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <Table
                    columns={columns}
                    dataSource={listResponse.content}
                    rowKey={(record) => record.product.id}
                    pagination={false}
                    size="small"
                    bordered
                    style={{ borderRadius: 8, overflow: "hidden" }}
                />
            </ManageMain>

            <ManagePagination listResponse={listResponse} />

            <Modal
                title={
                    <strong>
                        Lịch sử nhập xuất của sản phẩm "{modalData.productName}"
                    </strong>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                width={1200}
                footer={null}
            >
                <ProductInventoryTransactionsModal
                    transactions={modalData.transactions}
                />
            </Modal>
        </Space>
    );
}

function ProductInventoryTransactionsModal({
    transactions,
}: {
    transactions: DocketVariantExtendedResponse[];
}) {
    const renderDocketTypeBadge = (type: number) => {
        switch (type) {
            case 1:
                return <Tag color="blue">Nhập</Tag>;
            case 2:
                return <Tag color="orange">Xuất</Tag>;
            default:
                return null;
        }
    };

    const renderDocketStatusBadge = (status: number) => {
        switch (status) {
            case 1:
                return <Tag style={{ borderStyle: "solid" }}>Mới</Tag>;
            case 2:
                return (
                    <Tag color="blue" style={{ borderStyle: "solid" }}>
                        Đang xử lý
                    </Tag>
                );
            case 3:
                return (
                    <Tag color="green" style={{ borderStyle: "solid" }}>
                        Hoàn thành
                    </Tag>
                );
            case 4:
                return (
                    <Tag color="red" style={{ borderStyle: "solid" }}>
                        Hủy bỏ
                    </Tag>
                );
            default:
                return null;
        }
    };

    const columns = [
        {
            title: "Phiếu",
            key: "docketType",
            render: (text: string, record: DocketVariantExtendedResponse) =>
                renderDocketTypeBadge(record.docket.type),
        },
        {
            title: "Ngày tạo",
            key: "createdAt",
            render: (text: string, record: DocketVariantExtendedResponse) =>
                DateUtils.isoDateToString(record.docket.createdAt),
        },
        {
            title: "Lý do",
            key: "reason",
            render: (text: string, record: DocketVariantExtendedResponse) =>
                record.docket.reason.name,
        },
        {
            title: "Mã đơn nhập hàng",
            key: "purchaseOrder",
            render: (text: string, record: DocketVariantExtendedResponse) =>
                record.docket.purchaseOrder?.code || "-",
        },
        {
            title: "Mã đơn hàng",
            key: "order",
            render: (text: string, record: DocketVariantExtendedResponse) =>
                record.docket.order?.code || "-",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "SKU",
            key: "sku",
            render: (text: string, record: DocketVariantExtendedResponse) =>
                record.variant.sku,
        },
        {
            title: "Kho",
            key: "warehouse",
            render: (text: string, record: DocketVariantExtendedResponse) =>
                record.docket.warehouse.name,
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (text: string, record: DocketVariantExtendedResponse) =>
                renderDocketStatusBadge(record.docket.status),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={transactions}
            rowKey={(record) => record.docket.code}
            pagination={false}
            size="small"
        />
    );
}

export default InventoryManage;
