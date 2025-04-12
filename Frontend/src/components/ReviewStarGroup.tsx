import React from "react";
import { Space, theme } from "antd";
import { StarFilled } from "@ant-design/icons";

function ReviewStarGroup({ ratingScore }: { ratingScore: number }) {
    const { token } = theme.useToken();

    return (
        <Space size={5}>
            {Array(5)
                .fill(0)
                .map((_, index) => (
                    <StarFilled
                        key={index}
                        style={{
                            color:
                                index < ratingScore
                                    ? token.colorWarning
                                    : token.colorBorderSecondary,
                            fontSize: 14,
                        }}
                    />
                ))}
        </Space>
    );
}

export default ReviewStarGroup;
