import { Input, Button } from "antd";
import { useState } from "react";
import { useStompClient } from "react-stomp-hooks";
import { SendOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

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
