import React from "react";
import { Card, Empty, Spin, Typography, theme } from "antd";
import { FileUnknownOutlined } from "@ant-design/icons";
import { ListResponse } from "@/utils/FetchUtils";

const { Text } = Typography;
const { useToken } = theme;

interface ManageMainProps {
    listResponse: ListResponse;
    isLoading: boolean;
    children: React.ReactNode;
}

function ManageMain({ listResponse, isLoading, children }: ManageMainProps) {
    const { token } = useToken();

    let manageMainInnerFragment = (
        <div style={{ overflow: "auto" }}>{children}</div>
    );

    if (listResponse.totalElements === 0) {
        manageMainInnerFragment = (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {!isLoading && (
                    <Empty
                        image={
                            <FileUnknownOutlined
                                style={{
                                    fontSize: 75,
                                    color: token.colorPrimary,
                                }}
                            />
                        }
                        description={
                            <Text style={{ fontSize: 16, fontWeight: 500 }}>
                                Không có nội dung
                            </Text>
                        }
                        style={{
                            margin: token.marginLG,
                            color: token.colorPrimary,
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <Card
            style={{
                position: "relative",
                height: listResponse.totalElements === 0 ? 250 : "auto",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            bodyStyle={{ padding: 0, position: "relative" }}
        >
            {isLoading && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(255, 255, 255, 0.5)",
                        zIndex: 50,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin size="large" />
                </div>
            )}
            {manageMainInnerFragment}
        </Card>
    );
}

export default React.memo(ManageMain);
