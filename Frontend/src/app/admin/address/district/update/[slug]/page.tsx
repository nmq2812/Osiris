"use client";
import React, { useEffect } from "react";
import {
    Button,
    Divider,
    Row,
    Col,
    Space,
    Card,
    Select,
    Input,
    Form,
    Spin,
    Typography,
    Result,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import { useParams } from "next/navigation";
import DistrictConfigs from "../../DistrictConfigs";
import useDistrictUpdateViewModel from "../../DistrictUpdate.vm";

const { Text, Title } = Typography;

function DistrictUpdate() {
    // Lấy slug và chuyển đổi thành id
    const params = useParams();
    const id = typeof params.slug === "string" ? parseInt(params.slug) : 0;

    // Form instance của Ant Design
    const [form] = Form.useForm();

    // Lấy thêm isLoading và isError từ view model
    const {
        district,
        form: mantineForm, // Giữ lại để sử dụng logic ViewModel
        handleFormSubmit,
        provinceSelectList,
        isLoading,
        isError,
    } = useDistrictUpdateViewModel(id);

    // Cập nhật form khi district thay đổi
    useEffect(() => {
        if (district) {
            form.setFieldsValue({
                name: district.name,
                code: district.code,
                provinceId: String(district.province?.id || ""),
            });
        }
    }, [district, form]);

    // Xử lý reset form
    const handleReset = () => {
        if (district) {
            form.setFieldsValue({
                name: district.name,
                code: district.code,
                provinceId: String(district.province?.id || ""),
            });
        } else {
            form.resetFields();
        }
    };

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{
            name: string;
            code: string;
            provinceId: string | null;
        }>,
    ) => {
        mantineForm.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    // Hiển thị loading state
    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <Text>Đang tải dữ liệu...</Text>
                </Space>
            </div>
        );
    }

    // Hiển thị error state
    if (isError || !district) {
        return (
            <Result
                status="error"
                title="Không thể tải dữ liệu quận/huyện"
                subTitle="Có thể do ID không hợp lệ hoặc đã xảy ra lỗi khi truy vấn dữ liệu."
                extra={[
                    <Button key="back" onClick={() => window.history.back()}>
                        Quay lại
                    </Button>,
                    <Button
                        key="reload"
                        type="primary"
                        onClick={() => window.location.reload()}
                    >
                        Tải lại trang
                    </Button>,
                ]}
            />
        );
    }

    // Chuyển đổi provinceSelectList sang format của Ant Design
    const provinceOptions = provinceSelectList.map((item) => ({
        label: item.label,
        value: item.value,
    }));

    console.log("provinceOptions", provinceOptions);

    // UI chính khi đã có dữ liệu
    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={DistrictConfigs.managerPath}
                title={DistrictConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={district.id}
                createdAt={district.createdAt}
                updatedAt={district.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    name: district.name,
                    code: district.code,
                    provinceId: String(district.province?.id || ""),
                }}
            >
                <Card>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={DistrictConfigs.properties.name.label}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên quận/huyện",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên quận/huyện" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={DistrictConfigs.properties.code.label}
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã quận/huyện",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập mã quận/huyện" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label={
                                    DistrictConfigs.properties.provinceId.label
                                }
                                name="provinceId"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn tỉnh/thành",
                                    },
                                ]}
                            >
                                {/* <Select
                                    placeholder="Chọn tỉnh/thành"
                                    showSearch
                                    options={provinceOptions}
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                /> */}
                                <Input placeholder="Nhập mã tỉnh/thành"></Input>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button onClick={handleReset}>Mặc định</Button>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </div>
                </Card>
            </Form>
        </Space>
    );
}

export default DistrictUpdate;
