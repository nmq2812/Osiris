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
import { ToMessage } from "@/components/ToMessage";
import { FromMessage } from "@/components/FromMessage";
import { MessageInput } from "@/components/MessageInput";

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
