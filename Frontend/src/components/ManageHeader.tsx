import React from "react";
import { Row } from "antd";

interface ManageHeaderProps {
    children: React.ReactNode;
}

function ManageHeader({ children }: ManageHeaderProps) {
    return (
        <Row justify="space-between" align="middle">
            {children}
        </Row>
    );
}

export default ManageHeader;
