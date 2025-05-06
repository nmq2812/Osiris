"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Table,
    Typography,
    Space,
    Modal,
    Input,
    Badge,
    Row,
    Col,
    Tooltip,
    theme,
} from "antd";
import {
    SearchOutlined,
    ClockCircleOutlined,
    UserOutlined,
    BoxPlotOutlined,
    StarOutlined,
    MessageOutlined,
    DeleteOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import ManageHeader from "@/components/ManageHeader";
import ManageHeaderTitle from "@/components/ManageHeaderTitle";
import ManageMain from "@/components/ManageMain";
import ManagePagination from "@/components/ManagePagination/ManagePagination";
import ReviewStarGroup from "@/components/ReviewStarGroup";
import useDeleteByIdApi from "@/hooks/use-delete-by-id-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import useResetManagePageState from "@/hooks/use-reset-manage-page-state";
import useUpdateApi from "@/hooks/use-update-api";
import { ReviewResponse, ReviewRequest } from "@/models/Review";
import useAppStore from "@/stores/use-app-store";
import DateUtils from "@/utils/DateUtils";
import { ListResponse } from "@/utils/FetchUtils";
import PageConfigs from "@/utils/PageConfigs";
import { useDebouncedValue } from "@mantine/hooks";
import ReviewConfigs from "./ReviewConfigs";

const { Title, Text, Link } = Typography;
const { TextArea } = Input;
const { useToken } = theme;

function ReviewManage() {
    useResetManagePageState();
    const { token } = useToken();

    // State for modals
    const [isCheckReviewModalOpen, setIsCheckReviewModalOpen] = useState(false);
    const [isReplyReviewModalOpen, setIsReplyReviewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(
        null,
    );
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(
        null,
    );

    const {
        isLoading,
        data: listResponse = PageConfigs.initialListResponse as ListResponse<ReviewResponse>,
    } = useGetAllApi<ReviewResponse>(
        ReviewConfigs.resourceUrl,
        ReviewConfigs.resourceKey,
    );

    const deleteByIdApi = useDeleteByIdApi(
        ReviewConfigs.resourceUrl,
        ReviewConfigs.resourceKey,
    );

    const { searchToken } = useAppStore();

    // Handle delete button click
    const handleDeleteEntityButton = (entityId: number) => {
        setSelectedDeleteId(entityId);
        setIsDeleteModalOpen(true);
    };

    // Confirm delete action
    const handleConfirmDelete = () => {
        if (selectedDeleteId) {
            deleteByIdApi.mutate(selectedDeleteId);
            setIsDeleteModalOpen(false);
        }
    };

    // Handle check review button click
    const handleCheckReviewButton = (review: ReviewResponse) => {
        setSelectedReview(review);
        setIsCheckReviewModalOpen(true);
    };

    // Handle reply review button click
    const handleReplyReviewButton = (review: ReviewResponse) => {
        setSelectedReview(review);
        setIsReplyReviewModalOpen(true);
    };

    // Status badge rendering
    const reviewStatusBadgeFragment = (status: number) => {
        switch (status) {
            case 1:
                return <Badge status="default" text="Chưa duyệt" />;
            case 2:
                return <Badge status="success" text="Đã duyệt" />;
            case 3:
                return <Badge status="error" text="Không duyệt" />;
            default:
                return null;
        }
    };

    // Table columns
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => DateUtils.isoDateToString(date),
        },
        {
            title: "Người dùng",
            dataIndex: "user",
            key: "user",
            render: (user: any) => (
                <Space direction="vertical" size={1}>
                    <Text
                        strong
                        style={{
                            backgroundColor: searchToken
                                ? "#e6f7ff"
                                : undefined,
                        }}
                    >
                        {user.fullname}
                    </Text>
                    <Text
                        type="secondary"
                        style={{
                            fontSize: 12,
                            backgroundColor: searchToken
                                ? "#e6f7ff"
                                : undefined,
                        }}
                    >
                        {user.username}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Sản phẩm",
            dataIndex: "product",
            key: "product",
            render: (product: any) => (
                <Link href={`/product/${product.slug}`} target="_blank">
                    <Text
                        style={{
                            backgroundColor: searchToken
                                ? "#e6f7ff"
                                : undefined,
                        }}
                    >
                        {product.name}
                    </Text>
                </Link>
            ),
        },
        {
            title: "Số sao",
            dataIndex: "ratingScore",
            key: "ratingScore",
            render: (score: number) => <ReviewStarGroup ratingScore={score} />,
        },
        {
            title: "Tóm lược nội dung",
            dataIndex: "content",
            key: "content",
            render: (content: string) => (
                <Text
                    style={{
                        maxWidth: 300,
                        backgroundColor: searchToken ? "#e6f7ff" : undefined,
                    }}
                >
                    {content.length > 120
                        ? content.substring(0, 120).concat("...")
                        : content}
                </Text>
            ),
        },
        {
            title: "Có phản hồi?",
            dataIndex: "reply",
            key: "reply",
            render: (reply: string) =>
                reply && (
                    <CheckOutlined style={{ color: token.colorSuccess }} />
                ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: number) => reviewStatusBadgeFragment(status),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 120,
            render: (_: any, record: ReviewResponse) => (
                <Space>
                    <Tooltip title="Xem xét">
                        <Button
                            type="primary"
                            size="small"
                            icon={<SearchOutlined />}
                            onClick={() => handleCheckReviewButton(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Phản hồi">
                        <Button
                            type="primary"
                            size="small"
                            icon={<MessageOutlined />}
                            onClick={() => handleReplyReviewButton(record)}
                            disabled={record.status === 1}
                            style={{ backgroundColor: token.colorPrimary }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteEntityButton(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <ManageHeader>
                <ManageHeaderTitle
                    titleLinks={ReviewConfigs.manageTitleLinks}
                    title={ReviewConfigs.manageTitle}
                />
            </ManageHeader>

            <ReviewSearchPanel />

            <ManageMain listResponse={listResponse} isLoading={isLoading}>
                <Table
                    columns={columns}
                    dataSource={listResponse.content}
                    rowKey="id"
                    pagination={false}
                    bordered
                    scroll={{ x: "max-content" }}
                />
            </ManageMain>

            <ManagePagination listResponse={listResponse} />

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalOpen}
                onOk={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Xóa"
                cancelText="Không xóa"
                okButtonProps={{ danger: true }}
            >
                <p>Xóa phần tử có ID {selectedDeleteId}?</p>
            </Modal>

            {/* Check Review Modal */}
            {selectedReview && (
                <CheckReviewModal
                    review={selectedReview}
                    isOpen={isCheckReviewModalOpen}
                    onClose={() => setIsCheckReviewModalOpen(false)}
                />
            )}

            {/* Reply Review Modal */}
            {selectedReview && (
                <ReplyReviewModal
                    review={selectedReview}
                    isOpen={isReplyReviewModalOpen}
                    onClose={() => setIsReplyReviewModalOpen(false)}
                />
            )}
        </Space>
    );
}

function ReviewSearchPanel() {
    const { setSearchToken } = useAppStore();

    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebouncedValue(search, 400);

    useEffect(
        () => setSearchToken(debouncedSearch),
        [debouncedSearch, setSearchToken],
    );

    return (
        <Card size="small">
            <Input
                placeholder="Từ khóa"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </Card>
    );
}

function CheckReviewModal({
    review,
    isOpen,
    onClose,
}: {
    review: ReviewResponse;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { token } = useToken();

    const updateReviewApi = useUpdateApi<ReviewRequest, ReviewResponse>(
        ReviewConfigs.resourceUrl,
        ReviewConfigs.resourceKey,
        review.id,
    );

    const handleCheckReviewButton = () => {
        const requestBody: ReviewRequest = {
            userId: review.user.id,
            productId: review.product.id,
            ratingScore: review.ratingScore,
            content: review.content,
            reply: review.reply,
            status: 2,
        };
        updateReviewApi.mutate(requestBody);
        onClose();
    };

    const handleUncheckReviewButton = () => {
        const requestBody: ReviewRequest = {
            userId: review.user.id,
            productId: review.product.id,
            ratingScore: review.ratingScore,
            content: review.content,
            reply: review.reply,
            status: 3,
        };
        updateReviewApi.mutate(requestBody);
        onClose();
    };

    return (
        <Modal
            title={<Text strong>Xem xét Đánh giá ID {review.id}</Text>}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Row gutter={16}>
                    <Col span={8}>
                        <Space size="small">
                            <ClockCircleOutlined />
                            <Text>
                                {DateUtils.isoDateToString(review.createdAt)}
                            </Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space size="small">
                            <UserOutlined />
                            <Text>{review.user.fullname}</Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space size="small">
                            <BoxPlotOutlined />
                            <Text>{review.product.name}</Text>
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Space size="small">
                            <StarOutlined />
                            <ReviewStarGroup ratingScore={review.ratingScore} />
                        </Space>
                    </Col>
                </Row>
                <Card>
                    <Text>{review.content}</Text>
                </Card>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Space>
                        <Button onClick={onClose}>Đóng</Button>
                        <Button
                            type="primary"
                            style={{ backgroundColor: token.colorSuccess }}
                            onClick={handleCheckReviewButton}
                            disabled={review.status === 2}
                        >
                            Duyệt
                        </Button>
                        <Button
                            danger
                            onClick={handleUncheckReviewButton}
                            disabled={review.status === 3}
                        >
                            Không duyệt
                        </Button>
                    </Space>
                </div>
            </Space>
        </Modal>
    );
}

function ReplyReviewModal({
    review,
    isOpen,
    onClose,
}: {
    review: ReviewResponse;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [reply, setReply] = useState(review.reply || "");

    const updateReviewApi = useUpdateApi<ReviewRequest, ReviewResponse>(
        ReviewConfigs.resourceUrl,
        ReviewConfigs.resourceKey,
        review.id,
    );

    const handleReplyReviewButton = () => {
        const requestBody: ReviewRequest = {
            userId: review.user.id,
            productId: review.product.id,
            ratingScore: review.ratingScore,
            content: review.content,
            reply: reply.trim() || null,
            status: review.status,
        };
        updateReviewApi.mutate(requestBody);
        onClose();
    };

    return (
        <Modal
            title={<Text strong>Phản hồi Đánh giá ID {review.id}</Text>}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Row gutter={16}>
                    <Col span={8}>
                        <Space size="small">
                            <ClockCircleOutlined />
                            <Text>
                                {DateUtils.isoDateToString(review.createdAt)}
                            </Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space size="small">
                            <UserOutlined />
                            <Text>{review.user.fullname}</Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space size="small">
                            <BoxPlotOutlined />
                            <Text>{review.product.name}</Text>
                        </Space>
                    </Col>
                </Row>
                <TextArea
                    autoFocus
                    placeholder="Nhập nội dung phản hồi"
                    autoSize={{ minRows: 4 }}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Space>
                        <Button onClick={onClose}>Đóng</Button>
                        <Button
                            type="primary"
                            onClick={handleReplyReviewButton}
                            disabled={
                                (!review.reply && reply.length === 0) ||
                                (!!review.reply && review.reply === reply)
                            }
                        >
                            {!review.reply
                                ? "Thêm phản hồi"
                                : reply.length === 0
                                ? "Xóa phản hồi"
                                : "Sửa phản hồi"}
                        </Button>
                    </Space>
                </div>
            </Space>
        </Modal>
    );
}

export default ReviewManage;
