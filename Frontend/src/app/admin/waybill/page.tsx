"use client";
import React, { useState } from "react";
import {
    Badge,
    Table,
    Typography,
    Space,
    Modal,
    Button,
    theme,
    Spin,
    Row,
    Col,
    Divider,
} from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    PlusOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import EntityDetailTable from "@/components/EntityDetailTable";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import ManageHeader from "@/components/ManageHeader";
import ManageHeaderButtons from "@/components/ManageHeaderButtons";
import ManageHeaderTitle from "@/components/ManageHeaderTitle";
import ManageMain from "@/components/ManageMain";
import ManagePagination from "@/components/ManagePagination/ManagePagination";
import ManageTable from "@/components/ManageTable/ManageTable";
import SearchPanel from "@/components/SearchPanel/SearchPanel";
import useGetAllApi from "@/hooks/use-get-all-api";
import useInitFilterPanelState from "@/hooks/use-init-filter-panel-state";
import useResetManagePageState from "@/hooks/use-reset-manage-page-state";
import { WaybillResponse } from "@/models/Waybill";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import MiscUtils from "@/utils/MiscUtils";
import PageConfigs from "@/utils/PageConfigs";
import OrderConfigs from "../order/OrderConfigs";
import WaybillConfigs from "./WaybillConfigs";

const { Title, Text, Link } = Typography;
const { useToken } = theme;

function WaybillManage() {
    useResetManagePageState();
    useInitFilterPanelState(WaybillConfigs.properties);

    const { token } = useToken();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<WaybillResponse>,
    } = useGetAllApi<WaybillResponse>(
        WaybillConfigs.resourceUrl,
        WaybillConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    const waybillStatusBadgeFragment = (status: number) => {
        switch (status) {
            case 1:
                return <Badge color="default" text="Đợi lấy hàng" />;
            case 2:
                return <Badge color="blue" text="Đang giao" />;
            case 3:
                return <Badge color="green" text="Đã giao" />;
            case 4:
                return <Badge color="red" text="Hủy" />;
            default:
                return null;
        }
    };

    const handleViewOrderAnchor = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    const showedPropertiesFragment = (entity: WaybillResponse) => {
        const PaymentMethodIcon =
            PageConfigs.paymentMethodIconMap[entity.order.paymentMethodType];

        return (
            <>
                <td>{entity.id}</td>
                <td>
                    <Text
                        style={{
                            fontFamily: "monospace",
                            backgroundColor: searchToken
                                ? "#e6f7ff"
                                : undefined,
                        }}
                    >
                        {entity.code}
                    </Text>
                </td>
                <td>
                    <Space direction="vertical" size={2.5}>
                        <Link
                            onClick={() =>
                                handleViewOrderAnchor(entity.order.id)
                            }
                        >
                            <Text
                                style={{
                                    fontFamily: "monospace",
                                    backgroundColor: searchToken
                                        ? "#e6f7ff"
                                        : undefined,
                                }}
                            >
                                {entity.order.code}
                            </Text>
                        </Link>
                        <PaymentMethodIcon
                            style={{ color: token.colorTextSecondary }}
                        />
                    </Space>
                </td>
                <td>
                    {DateUtils.isoDateToString(
                        entity.shippingDate,
                        "DD/MM/YYYY",
                    )}
                </td>
                <td>
                    {DateUtils.isoDateToString(
                        entity.expectedDeliveryTime,
                        "DD/MM/YYYY",
                    )}
                </td>
                <td>{waybillStatusBadgeFragment(entity.status)}</td>
                <td style={{ textAlign: "right" }}>
                    {MiscUtils.formatPrice(entity.codAmount) + " ₫"}
                </td>
                <td style={{ textAlign: "right" }}>
                    {MiscUtils.formatPrice(entity.shippingFee) + " ₫"}
                </td>
                <td>
                    <Space direction="vertical" size={0}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Khối lượng:{" "}
                            <Text strong style={{ fontSize: 12 }}>
                                {entity.weight}
                            </Text>{" "}
                            (gram)
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Chiều dài:{" "}
                            <Text strong style={{ fontSize: 12 }}>
                                {entity.length}
                            </Text>{" "}
                            (cm)
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Chiều rộng:{" "}
                            <Text strong style={{ fontSize: 12 }}>
                                {entity.width}
                            </Text>{" "}
                            (cm)
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Chiều cao:{" "}
                            <Text strong style={{ fontSize: 12 }}>
                                {entity.height}
                            </Text>{" "}
                            (cm)
                        </Text>
                    </Space>
                </td>
            </>
        );
    };

    const entityDetailTableRowsFragment = (entity: WaybillResponse) => (
        <>
            <tr>
                <td>{WaybillConfigs.properties.id.label}</td>
                <td>{entity.id}</td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties.createdAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties.updatedAt.label}</td>
                <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties.code.label}</td>
                <td>{entity.code}</td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties["order.code"].label}</td>
                <td>{entity.order.code}</td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties.shippingDate.label}</td>
                <td>
                    {DateUtils.isoDateToString(
                        entity.shippingDate,
                        "DD/MM/YYYY",
                    )}
                </td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties.expectedDeliveryTime.label}</td>
                <td>
                    {DateUtils.isoDateToString(
                        entity.expectedDeliveryTime,
                        "DD/MM/YYYY",
                    )}
                </td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties.status.label}</td>
                <td>{waybillStatusBadgeFragment(entity.status)}</td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties.codAmount.label}</td>
                <td>{MiscUtils.formatPrice(entity.codAmount) + " ₫"}</td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties.shippingFee.label}</td>
                <td>{MiscUtils.formatPrice(entity.shippingFee) + " ₫"}</td>
            </tr>
            <tr>
                <td>{WaybillConfigs.properties.size.label}</td>
                <td>
                    <Space direction="vertical" size={0}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Khối lượng:{" "}
                            <Text strong style={{ fontSize: 12 }}>
                                {entity.weight}
                            </Text>{" "}
                            (gram)
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Chiều dài:{" "}
                            <Text strong style={{ fontSize: 12 }}>
                                {entity.length}
                            </Text>{" "}
                            (cm)
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Chiều rộng:{" "}
                            <Text strong style={{ fontSize: 12 }}>
                                {entity.width}
                            </Text>{" "}
                            (cm)
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Chiều cao:{" "}
                            <Text strong style={{ fontSize: 12 }}>
                                {entity.height}
                            </Text>{" "}
                            (cm)
                        </Text>
                    </Space>
                </td>
            </tr>
            <tr>
                <td>Ghi chú vận đơn</td>
                <td style={{ maxWidth: 300 }}>{entity.note}</td>
            </tr>
            <tr>
                <td>Người trả phí dịch vụ GHN</td>
                <td>
                    {
                        WaybillConfigs.ghnPaymentTypeIdMap[
                            entity.ghnPaymentTypeId
                        ]
                    }
                </td>
            </tr>
            <tr>
                <td>Ghi chú cho dịch vụ GHN</td>
                <td>
                    {WaybillConfigs.ghnRequiredNoteMap[entity.ghnRequiredNote]}
                </td>
            </tr>
        </>
    );

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={WaybillConfigs.manageTitleLinks}
                    title={WaybillConfigs.manageTitle}
                />
                <ManageHeaderButtons
                    listResponse={listResponse}
                    resourceUrl={WaybillConfigs.resourceUrl}
                    resourceKey={WaybillConfigs.resourceKey}
                />
            </ManageHeader>

            <SearchPanel />

            <FilterPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <ManageTable
                    listResponse={listResponse}
                    properties={WaybillConfigs.properties}
                    resourceUrl={WaybillConfigs.resourceUrl}
                    resourceKey={WaybillConfigs.resourceKey}
                    showedPropertiesFragment={showedPropertiesFragment}
                    entityDetailTableRowsFragment={
                        entityDetailTableRowsFragment
                    }
                />
            </ManageMain>

            <ManagePagination listResponse={listResponse} />

            <Modal
                title={<Text strong>Thông tin đơn hàng</Text>}
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width={800}
            >
                {selectedOrderId && (
                    <EntityDetailTable
                        entityDetailTableRowsFragment={
                            OrderConfigs.entityDetailTableRowsFragment
                        }
                        resourceUrl={OrderConfigs.resourceUrl}
                        resourceKey={OrderConfigs.resourceKey}
                        entityId={selectedOrderId}
                    />
                )}
            </Modal>
        </Space>
    );
}

export default WaybillManage;
