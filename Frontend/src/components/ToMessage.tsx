import { MessageResponse } from "@/models/Message";
import DateUtils from "@/utils/DateUtils";
import { Card, Space, Typography } from "antd";

const { Text, Title } = Typography;

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
