"use client";
import React, { useState } from "react";
import {
    Badge,
    Button,
    Card,
    Form,
    Input,
    Modal,
    Row,
    Col,
    Space,
    Spin,
    Switch,
    Table,
    Typography,
    theme,
} from "antd";
import { FormOutlined } from "@ant-design/icons";
import ManageHeader from "@/components/ManageHeader";
import ManageHeaderTitle from "@/components/ManageHeaderTitle";
import useGetAllApi from "@/hooks/use-get-all-api";
import useResetManagePageState from "@/hooks/use-reset-manage-page-state";
import {
    RewardStrategyResponse,
    RewardStrategyRequest,
} from "@/models/RewardStrategy";
import FetchUtils, { ListResponse, ErrorMessage } from "@/utils/FetchUtils";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import PageConfigs from "@/utils/PageConfigs";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import RewardStrategyConfigs from "./RewardStrategyConfigs";

const { Text } = Typography;
const { useToken } = theme;

function RewardStrategyManage() {
    const { token } = useToken();
    const queryClient = useQueryClient();
    useResetManagePageState();

    // State để thay thế formList của Mantine
    const [statusValues, setStatusValues] = useState<Array<boolean>>([]);

    // State cho modal thay vì useModals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStrategy, setSelectedStrategy] =
        useState<RewardStrategyResponse | null>(null);

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<RewardStrategyResponse>,
    } = useGetAllApi<RewardStrategyResponse>(
        RewardStrategyConfigs.resourceUrl,
        RewardStrategyConfigs.resourceKey,
        { all: 1, sort: "id,asc" },
        (data) => {
            setStatusValues(data.content.map((entity) => entity.status === 1));
        },
        {
            refetchOnWindowFocus: false,
            queryKey: [],
        },
    );

    const updateRewardStrategyApi = useUpdateRewardStrategyApi();

    const handleUpdateButton = async () => {
        try {
            const updateRewardStrategyRequests: UpdateRewardStrategyRequest[] =
                [];

            listResponse.content.forEach((entity, index) => {
                const currentStatus = statusValues[index] ? 1 : 2;

                if (currentStatus !== entity.status) {
                    updateRewardStrategyRequests.push({
                        id: entity.id,
                        body: { formula: null, status: currentStatus },
                    });
                }
            });

            await Promise.all(
                updateRewardStrategyRequests.map(async (request) => {
                    await updateRewardStrategyApi.mutateAsync(request);
                }),
            );

            NotifyUtils.simpleSuccess("Cập nhật thành công");
            void queryClient.invalidateQueries({
                queryKey: [RewardStrategyConfigs.resourceKey, "getAll"],
            });
        } catch (e) {
            NotifyUtils.simpleFailed("Cập nhật không thành công");
        }
    };

    const handleUpdateFormulaButton = (
        rewardStrategy: RewardStrategyResponse,
    ) => {
        setSelectedStrategy(rewardStrategy);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedStrategy(null);
    };

    const handleSwitchChange = (value: boolean, index: number) => {
        const newStatusValues = [...statusValues];
        newStatusValues[index] = value;
        setStatusValues(newStatusValues);
    };

    const rewardStrategyStatusBadgeFragment = (status: number) => {
        switch (status) {
            case 1:
                return <Badge color="blue" text="Đang kích hoạt" />;
            case 2:
                return <Badge color="pink" text="Không kích hoạt" />;
            default:
                return null;
        }
    };

    // Định nghĩa cấu trúc cột cho Ant Design Table
    const columns = [
        {
            title: "Kích hoạt",
            dataIndex: "status",
            key: "status",
            render: (_: any, _record: any, index: number) => (
                <Switch
                    checked={statusValues[index]}
                    onChange={(checked) => handleSwitchChange(checked, index)}
                />
            ),
        },
        {
            title: "Chiến lược điểm thưởng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Mã",
            dataIndex: "code",
            key: "code",
            render: (code: string) => (
                <Text style={{ fontFamily: "monospace" }}>{code}</Text>
            ),
        },
        {
            title: "Công thức tính",
            dataIndex: "formula",
            key: "formula",
            render: (formula: string, record: RewardStrategyResponse) => (
                <Space>
                    <Text style={{ fontFamily: "monospace" }}>{formula}</Text>
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<FormOutlined />}
                        title="Cập nhật công thức mới"
                        onClick={() => handleUpdateFormulaButton(record)}
                    />
                </Space>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "statusBadge",
            render: (status: number) =>
                rewardStrategyStatusBadgeFragment(status),
        },
    ];

    const disabledUpdateButton = MiscUtils.isEquals(
        listResponse.content.map((entity) => ({ status: entity.status === 1 })),
        statusValues.map((status) => ({ status })),
    );

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 850 }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={RewardStrategyConfigs.manageTitleLinks}
                    title={RewardStrategyConfigs.manageTitle}
                />
            </ManageHeader>

            <Card>
                <Spin spinning={isLoading}>
                    <Table
                        columns={columns}
                        dataSource={listResponse.content}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </Spin>
            </Card>

            <div>
                <Button
                    type="primary"
                    disabled={disabledUpdateButton}
                    onClick={handleUpdateButton}
                >
                    Cập nhật
                </Button>
            </div>

            {/* Modal for formula update */}
            {selectedStrategy && (
                <UpdateFormulaModal
                    rewardStrategy={selectedStrategy}
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                />
            )}
        </Space>
    );
}

function UpdateFormulaModal({
    rewardStrategy,
    isOpen,
    onClose,
}: {
    rewardStrategy: RewardStrategyResponse;
    isOpen: boolean;
    onClose: () => void;
}) {
    const queryClient = useQueryClient();
    const [currentFormula, setCurrentFormula] = useState(
        rewardStrategy.formula,
    );
    const [form] = Form.useForm();

    const updateRewardStrategyApi = useUpdateRewardStrategyApi();

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();

            const requestBody: RewardStrategyRequest = {
                formula: values.formula,
                status: null,
            };

            await updateRewardStrategyApi.mutateAsync({
                id: rewardStrategy.id,
                body: requestBody,
            });

            NotifyUtils.simpleSuccess("Cập nhật thành công");
            void queryClient.invalidateQueries({
                queryKey: [RewardStrategyConfigs.resourceKey, "getAll"],
            });

            setCurrentFormula(values.formula);
            onClose();
        } catch (e) {
            NotifyUtils.simpleFailed("Cập nhật không thành công");
        }
    };

    // Set form values when modal opens
    React.useEffect(() => {
        if (isOpen) {
            form.setFieldsValue({
                formula: currentFormula,
            });
        }
    }, [form, currentFormula, isOpen]);

    const isFormulaChanged = form.getFieldValue("formula") !== currentFormula;

    return (
        <Modal
            title={<Text strong>Sửa công thức tính</Text>}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Đóng
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleFormSubmit}
                    disabled={!isFormulaChanged}
                >
                    Cập nhật
                </Button>,
            ]}
        >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Text type="secondary">
                    Công thức tính của chiến lược &quot;{rewardStrategy.name}
                    &quot;
                </Text>

                <Form form={form} layout="vertical">
                    <Form.Item
                        name="formula"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập công thức tính",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập công thức tính" autoFocus />
                    </Form.Item>
                </Form>
            </Space>
        </Modal>
    );
}

type UpdateRewardStrategyRequest = { id: number; body: RewardStrategyRequest };

function useUpdateRewardStrategyApi() {
    return useMutation<
        RewardStrategyResponse,
        ErrorMessage,
        UpdateRewardStrategyRequest
    >({
        mutationFn: (request) =>
            FetchUtils.update(
                RewardStrategyConfigs.resourceUrl,
                request.id,
                request.body,
            ),
    });
}

export default RewardStrategyManage;
