import { MessageResponse } from "@/models/Message";
import DateUtils from "@/utils/DateUtils";
import { Avatar, Card, Space } from "antd";
import { Typography } from "antd";

const { Text } = Typography;

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
