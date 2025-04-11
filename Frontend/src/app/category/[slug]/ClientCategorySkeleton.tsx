import React from "react";

import { Skeleton, Space } from "antd";

function ClientCategorySkeleton() {
    return (
        <main>
            <div
                style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                active
                                title={false}
                                paragraph={{ rows: 1 }}
                                style={{ height: 50, borderRadius: 8 }}
                            />
                        ))}
                </Space>
            </div>
        </main>
    );
}

export default ClientCategorySkeleton;
