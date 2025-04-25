"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Input,
    Layout,
    Row,
    Space,
    Spin,
    Typography,
} from "antd";
import { SendOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import ResourceURL from "@/constants/ResourceURL";
import { ClientRoomExistenceResponse } from "@/datas/ClientUI";
import useTitle from "@/hooks/use-title";
import { MessageResponse } from "@/models/Message";
import { RoomResponse } from "@/models/Room";
import { useAuthStore } from "@/stores/authStore";
import DateUtils from "@/utils/DateUtils";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useStompClient, useSubscription } from "react-stomp-hooks";

const { Text, Title } = Typography;

function ClientChat() {
    useTitle();

    const viewport = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const { user } = useAuthStore();

    const {
        roomExistenceResponse,
        isLoadingRoomExistenceResponse,
        isErrorRoomExistenceResponse,
    } = useGetRoomApi();

    const createRoomApi = useCreateRoomApi();

    useSubscription(
        roomExistenceResponse && roomExistenceResponse.roomExistence
            ? ["/chat/receive/" + roomExistenceResponse.roomResponse.id]
            : [],
        (message) =>
            setMessages((messages) => [...messages, JSON.parse(message.body)]),
    );

    useEffect(() => {
        viewport.current?.scrollTo({
            top: viewport.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages.length]);

    useEffect(() => {
        if (roomExistenceResponse) {
            setMessages(roomExistenceResponse.roomRecentMessages);
        }
    }, [roomExistenceResponse]);

    const handleCreateRoomButton = () => createRoomApi.mutate();

    return (
        <Layout.Content style={{ padding: "24px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Row gutter={[24, 24]}>
                    <Col md={6} lg={5} xl={4}>
                        <ClientUserNavbar />
                    </Col>

                    <Col md={18} lg={19} xl={20}>
                        <Card>
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <Title level={2}>Yêu cầu tư vấn</Title>

                                <div
                                    style={{
                                        height: 550,
                                        border: "1px solid #f0f0f0",
                                        borderRadius: "8px",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    {isLoadingRoomExistenceResponse && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background:
                                                    "rgba(255, 255, 255, 0.8)",
                                                zIndex: 10,
                                            }}
                                        >
                                            <Spin size="large" />
                                        </div>
                                    )}

                                    {(isErrorRoomExistenceResponse ||
                                        (roomExistenceResponse &&
                                            !roomExistenceResponse.roomExistence)) && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background:
                                                    "rgba(255, 255, 255, 0.8)",
                                                backdropFilter: "blur(3px)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                zIndex: 5,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {isErrorRoomExistenceResponse && (
                                                    <Space
                                                        direction="vertical"
                                                        align="center"
                                                        style={{
                                                            color: "#ff4d4f",
                                                        }}
                                                    >
                                                        <ExclamationCircleOutlined
                                                            style={{
                                                                fontSize: 125,
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 20,
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            Đã có lỗi xảy ra
                                                        </Text>
                                                    </Space>
                                                )}

                                                {roomExistenceResponse &&
                                                    !roomExistenceResponse.roomExistence && (
                                                        <Button
                                                            type="primary"
                                                            size="large"
                                                            onClick={
                                                                handleCreateRoomButton
                                                            }
                                                        >
                                                            Gửi yêu cầu tư vấn!
                                                        </Button>
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                    {roomExistenceResponse &&
                                        roomExistenceResponse.roomResponse &&
                                        user && (
                                            <div
                                                style={{
                                                    position: "relative",
                                                    height: "100%",
                                                }}
                                            >
                                                <div
                                                    ref={viewport}
                                                    style={{
                                                        height: "calc(100% - 68px)",
                                                        overflow: "auto",
                                                        padding: "16px 0 0 0",
                                                    }}
                                                >
                                                    <Space
                                                        direction="vertical"
                                                        style={{
                                                            width: "100%",
                                                            margin: 0,
                                                        }}
                                                        size={0}
                                                    >
                                                        {messages.map(
                                                            (
                                                                message: MessageResponse,
                                                            ) =>
                                                                message.user
                                                                    .id ===
                                                                user?.id ? (
                                                                    <ToMessage
                                                                        key={
                                                                            message.id
                                                                        }
                                                                        message={
                                                                            message
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <FromMessage
                                                                        key={
                                                                            message.id
                                                                        }
                                                                        message={
                                                                            message
                                                                        }
                                                                    />
                                                                ),
                                                        )}
                                                    </Space>
                                                </div>
                                                <MessageInput
                                                    roomId={
                                                        roomExistenceResponse
                                                            .roomResponse.id
                                                    }
                                                    userId={user.id}
                                                />
                                            </div>
                                        )}
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Layout.Content>
    );
}
export const FromMessage: React.FC<{ message: MessageResponse }> = ({
    message,
}) => {
    return (
        <Space
            style={{
                padding: "0 16px 16px 16px",
                flexWrap: "nowrap",
                alignItems: "flex-end",
                display: "flex",
            }}
            size={8}
        >
            <Avatar style={{ backgroundColor: "#13c2c2" }}>
                {message.user.username.toUpperCase().charAt(0)}
            </Avatar>
            <div>
                <Text strong style={{ fontSize: 12, display: "block" }}>
                    {message.user.fullname}
                </Text>
                <Space align="end" size={8}>
                    <Card
                        size="small"
                        style={{
                            maxWidth: 500,
                            backgroundColor: "#f0f0f0",
                            borderRadius: 8,
                            margin: 0,
                        }}
                        bodyStyle={{ padding: "8px 16px" }}
                    >
                        <Text>{message.content}</Text>
                    </Card>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {DateUtils.isoDateToString(message.createdAt)}
                    </Text>
                </Space>
            </div>
        </Space>
    );
};

export const ToMessage: React.FC<{ message: MessageResponse }> = ({
    message,
}) => {
    return (
        <div
            style={{
                padding: "0 16px 16px 16px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
            }}
        >
            <Space align="end" size={8}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {DateUtils.isoDateToString(message.createdAt)}
                </Text>
                <Card
                    size="small"
                    style={{
                        maxWidth: 500,
                        backgroundColor: "#1890ff",
                        borderRadius: 8,
                        margin: 0,
                    }}
                    bodyStyle={{ padding: "8px 16px" }}
                >
                    <Text style={{ color: "white" }}>{message.content}</Text>
                </Card>
            </Space>
        </div>
    );
};

export function MessageInput({
    roomId,
    userId,
}: {
    roomId: number;
    userId: number;
}) {
    const [message, setMessage] = useState("");
    const stompClient = useStompClient();

    const handleSendMessageButton = () => {
        if (message.trim() !== "" && stompClient) {
            stompClient.publish({
                destination: "/chat/send/" + roomId,
                body: JSON.stringify({
                    content: message.trim(),
                    status: 1,
                    userId: userId,
                    roomId: roomId,
                }),
            });
            setMessage("");
        }
    };

    const handleSendMessageInput = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === "Enter") {
            handleSendMessageButton();
        }
    };

    return (
        <div
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: 16,
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                gap: 8,
            }}
        >
            <Input
                placeholder="Nhập tin nhắn"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleSendMessageInput}
                style={{ flexGrow: 1 }}
            />
            <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessageButton}
                title="Gửi tin nhắn"
            />
        </div>
    );
}

function useGetRoomApi() {
    const { data, isLoading, isError } = useQuery<
        ClientRoomExistenceResponse,
        ErrorMessage
    >({
        queryKey: ["client-api", "chat", "getRoom"],
        queryFn: () =>
            FetchUtils.getWithToken(ResourceURL.CLIENT_CHAT_GET_ROOM),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    });

    useEffect(() => {
        if (isError) {
            NotifyUtils.simpleFailed("Lấy dữ liệu không thành công");
        }
    }, [isError]);

    return {
        roomExistenceResponse: data as ClientRoomExistenceResponse | undefined,
        isLoadingRoomExistenceResponse: isLoading,
        isErrorRoomExistenceResponse: isError,
    };
}

function useCreateRoomApi() {
    const queryClient = useQueryClient();

    return useMutation<RoomResponse, ErrorMessage, void>({
        mutationFn: () =>
            FetchUtils.postWithToken(ResourceURL.CLIENT_CHAT_CREATE_ROOM, {}),

        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["client-api", "chat", "getRoom"],
            }),
        onError: () =>
            NotifyUtils.simpleFailed(
                "Khởi tạo yêu cầu tư vấn không thành công",
            ),
    });
}

export default ClientChat;
