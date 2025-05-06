import React from "react";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Space,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import DocketReasonConfigs from "../DocketReasonConfigs";
import useDocketReasonCreateViewModel from "../DocketReasonCreate.vm";

function DocketReasonCreate() {
    const {
        form: mantineForm, // Đổi tên để tránh xung đột với Ant Design Form
        handleFormSubmit,
        statusSelectList,
    } = useDocketReasonCreateViewModel();

    // Chuyển đổi giá trị form từ Mantine sang Ant Design
    const initialValues = {
        name: mantineForm.values.name,
        status: mantineForm.values.status,
    };

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", maxWidth: 800 }}
        >
            <CreateUpdateTitle
                managerPath={DocketReasonConfigs.managerPath}
                title={DocketReasonConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={handleFormSubmit}
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={
                                    DocketReasonConfigs.properties.name.label
                                }
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên lý do",
                                    },
                                ]}
                                validateStatus={
                                    mantineForm.errors.name ? "error" : ""
                                }
                                help={mantineForm.errors.name}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={
                                    DocketReasonConfigs.properties.status.label
                                }
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn trạng thái",
                                    },
                                ]}
                                validateStatus={
                                    mantineForm.errors.status ? "error" : ""
                                }
                                help={mantineForm.errors.status}
                            >
                                <Select
                                    placeholder="--"
                                    options={statusSelectList}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Space
                        style={{
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button onClick={() => mantineForm.reset()}>
                            Mặc định
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </Space>
                </Form>
            </Card>
        </Space>
    );
}

export default DocketReasonCreate;
