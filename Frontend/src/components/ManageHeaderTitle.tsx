import React from "react";
import { Button, Space, Dropdown, Typography } from "antd";
import { NumberOutlined } from "@ant-design/icons";
import Link from "next/link";
import type { MenuProps } from "antd";
import { TitleLink } from "@/datas/TitleLink";

const { Title } = Typography;

interface ManageHeaderTitleProps {
    titleLinks: TitleLink[];
    title: string;
}

function ManageHeaderTitle({ titleLinks, title }: ManageHeaderTitleProps) {
    // Convert title links to Ant Design menu items
    const items: MenuProps["items"] = titleLinks.map((titleLink) => ({
        key: titleLink.label,
        label: <Link href={titleLink.link}>{titleLink.label}</Link>,
    }));

    return (
        <Space size="small" align="center">
            <Dropdown menu={{ items }} placement="bottomLeft">
                <Button
                    type="primary"
                    icon={<NumberOutlined />}
                    shape="circle"
                    size="small"
                />
            </Dropdown>
            <Title level={3} style={{ margin: 0 }}>
                {title}
            </Title>
        </Space>
    );
}

export default React.memo(ManageHeaderTitle);
