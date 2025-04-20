import React from "react";
import {
    Button,
    Card,
    Space,
    Select,
    Input,
    Tooltip,
    Row,
    Col,
    InputRef,
} from "antd";
import {
    SearchOutlined,
    SettingOutlined,
    EditOutlined,
    ClearOutlined,
    FilterOutlined,
} from "@ant-design/icons";
import useSearchPanelViewModel from "./SearchPanel.vm";

function SearchPanel() {
    const {
        searchInputRef,
        filterSelectList,
        activeFilterId,
        handleSearchInput,
        handleFilterSelect,
        handleAddFilterButton,
        handleResetButton,
        handleSearchButton,
    } = useSearchPanelViewModel();

    return (
        <Card
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
            bodyStyle={{ padding: 16 }}
        >
            <Row justify="space-between" align="middle">
                <Space size="small">
                    <Input
                        placeholder="Từ khóa"
                        prefix={<SearchOutlined />}
                        style={{ width: 250 }}
                        ref={searchInputRef as React.Ref<InputRef>}
                        onKeyDown={handleSearchInput}
                    />
                    <Select
                        placeholder="Chọn bộ lọc"
                        allowClear
                        style={{ width: 200 }}
                        options={filterSelectList}
                        value={activeFilterId}
                        onChange={handleFilterSelect}
                        suffixIcon={<SettingOutlined />}
                    />
                    <Tooltip title="Sửa bộ lọc">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            shape="circle"
                            style={{ color: "#1890ff" }}
                        />
                    </Tooltip>
                    <Button
                        type="default"
                        icon={<FilterOutlined />}
                        onClick={handleAddFilterButton}
                    >
                        Thêm bộ lọc
                    </Button>
                </Space>

                <Space size="small">
                    <Tooltip title="Đặt mặc định">
                        <Button
                            type="primary"
                            danger
                            icon={<ClearOutlined />}
                            shape="circle"
                            onClick={handleResetButton}
                        />
                    </Tooltip>
                    <Button type="primary" onClick={handleSearchButton}>
                        Tìm kiếm
                    </Button>
                </Space>
            </Row>
        </Card>
    );
}

export default React.memo(SearchPanel);
