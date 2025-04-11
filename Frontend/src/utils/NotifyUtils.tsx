import React from "react";
import { notification } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";

class NotifyUtils {
    static simple = (message: React.ReactNode) => {
        notification.info({
            message: "Thông báo",
            description: message,
            duration: 5,
            icon: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
        });
    };

    static simpleSuccess = (message: React.ReactNode) => {
        notification.success({
            message: "Thông báo",
            description: message,
            duration: 5,
            icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
    };

    static simpleFailed = (message: React.ReactNode) => {
        notification.error({
            message: "Thông báo",
            description: message,
            duration: 5,
            icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        });
    };
}

export default NotifyUtils;
