"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Divider,
    Row,
    Col,
    Card,
    Input,
    Form,
    Select,
    Space,
    Spin,
    notification,
} from "antd";
import { useRouter } from "next/navigation";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import CustomerConfigs from "../CustomerConfigs";
import useCustomerCreateViewModel from "../CustomerCreate.vm";

function CustomerCreate() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const [isFormChanged, setIsFormChanged] = useState(false);

    const {
        form: mantineForm,
        handleFormSubmit,
        handleReset,
        handleProvinceChange,
        userGenderSelectList,
        provinceSelectList,
        districtSelectList,
        userStatusSelectList,
        userRoleSelectList,
        customerGroupSelectList,
        customerStatusSelectList,
        customerResourceSelectList,
        createStatus,
    } = useCustomerCreateViewModel();

    // Chuyển đổi dữ liệu cho Ant Design Select
    const genderOptions = userGenderSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const provinceOptions = provinceSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const statusOptions = userStatusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const roleOptions = userRoleSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const customerGroupOptions = customerGroupSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const customerStatusOptions = customerStatusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const customerResourceOptions = customerResourceSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Lấy districts đã lọc theo province
    const getFilteredDistricts = () => {
        const provinceId = form.getFieldValue("user.address.provinceId");
        if (!provinceId) return [];

        return districtSelectList
            .filter((district) => district.provinceId === provinceId)
            .map((item) => ({ value: item.value, label: item.label }));
    };

    // Xử lý province change để lọc district
    const onProvinceChange = (value: string | null) => {
        handleProvinceChange(value);
        form.setFieldValue("user.address.districtId", null);
    };

    // Xử lý thay đổi form
    const onFieldsChange = () => {
        setIsFormChanged(true);
    };

    // Xử lý submit form
    const onFinish = (
        values: React.SetStateAction<{
            "user.username": string;
            "user.password": string;
            "user.fullname": string;
            "user.email": string;
            "user.phone": string;
            "user.gender": "M" | "F";
            "user.address.line": string;
            "user.address.provinceId": string | null;
            "user.address.districtId": string | null;
            "user.avatar": string;
            "user.status": string;
            "user.roles": string[];
            customerGroupId: string | null;
            customerStatusId: string | null;
            customerResourceId: string | null;
        }>,
    ) => {
        mantineForm.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    // Theo dõi createStatus để hiển thị thông báo
    useEffect(() => {
        if (createStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Thêm khách hàng mới thành công!",
                onClose: () => router.push(CustomerConfigs.managerPath),
            });
        } else if (createStatus === "error") {
            api.error({
                message: "Lỗi",
                description:
                    "Có lỗi xảy ra khi thêm khách hàng. Vui lòng thử lại.",
            });
        }
    }, [createStatus, api, router]);

    // Hiển thị loading state
    if (
        !provinceSelectList.length ||
        !districtSelectList.length ||
        !customerGroupSelectList.length ||
        !customerStatusSelectList.length ||
        !customerResourceSelectList.length
    ) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <div>Đang tải dữ liệu...</div>
                </Space>
            </div>
        );
    }

    return (
        <>
            {contextHolder}
            <Space
                direction="vertical"
                style={{ width: "100%", maxWidth: 1000 }}
            >
                <CreateUpdateTitle
                    managerPath={CustomerConfigs.managerPath}
                    title={CustomerConfigs.createTitle}
                />

                <DefaultPropertyPanel />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFieldsChange={onFieldsChange}
                    initialValues={{
                        "user.username": "",
                        "user.password": "",
                        "user.fullname": "",
                        "user.email": "",
                        "user.phone": "",
                        "user.gender": "M",
                        "user.address.line": "",
                        "user.address.provinceId": null,
                        "user.address.districtId": null,
                        "user.avatar": "",
                        "user.status": "1",
                        "user.roles": [
                            String(CustomerConfigs.CUSTOMER_ROLE_ID),
                        ],
                        customerGroupId: null,
                        customerStatusId: null,
                        customerResourceId: null,
                    }}
                >
                    <Card>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.username"
                                    label={
                                        CustomerConfigs.properties[
                                            "user.username"
                                        ].label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập tên đăng nhập",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.password"
                                    label={
                                        CustomerConfigs.properties[
                                            "user.password"
                                        ].label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mật khẩu",
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.fullname"
                                    label={
                                        CustomerConfigs.properties[
                                            "user.fullname"
                                        ].label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập họ tên",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.email"
                                    label={
                                        CustomerConfigs.properties["user.email"]
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập email",
                                        },
                                        {
                                            type: "email",
                                            message: "Email không hợp lệ",
                                        },
                                    ]}
                                >
                                    <Input type="email" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.phone"
                                    label={
                                        CustomerConfigs.properties["user.phone"]
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập số điện thoại",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.gender"
                                    label={
                                        CustomerConfigs.properties[
                                            "user.gender"
                                        ].label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn giới tính",
                                        },
                                    ]}
                                >
                                    <Select options={genderOptions} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="user.address.line"
                                    label={
                                        CustomerConfigs.properties[
                                            "user.address.line"
                                        ].label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập địa chỉ",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.address.provinceId"
                                    label={
                                        CustomerConfigs.properties[
                                            "user.address.provinceId"
                                        ].label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng chọn tỉnh/thành phố",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn tỉnh/thành phố"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={provinceOptions}
                                        onChange={onProvinceChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.address.districtId"
                                    label={
                                        CustomerConfigs.properties[
                                            "user.address.districtId"
                                        ].label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn quận/huyện",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn quận/huyện"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={getFilteredDistricts()}
                                        disabled={
                                            !form.getFieldValue(
                                                "user.address.provinceId",
                                            )
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="user.avatar"
                                    label={
                                        CustomerConfigs.properties[
                                            "user.avatar"
                                        ].label
                                    }
                                >
                                    <Input placeholder="Nhập URL ảnh đại diện" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.status"
                                    label={
                                        CustomerConfigs.properties[
                                            "user.status"
                                        ].label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn trạng thái",
                                        },
                                    ]}
                                >
                                    <Select options={statusOptions} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.roles"
                                    label={
                                        CustomerConfigs.properties["user.roles"]
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn vai trò",
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        options={roleOptions}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="customerGroupId"
                                    label={
                                        CustomerConfigs.properties
                                            .customerGroupId.label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng chọn nhóm khách hàng",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn nhóm khách hàng"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={customerGroupOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="customerStatusId"
                                    label={
                                        CustomerConfigs.properties
                                            .customerStatusId.label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng chọn trạng thái khách hàng",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn trạng thái khách hàng"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={customerStatusOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="customerResourceId"
                                    label={
                                        CustomerConfigs.properties
                                            .customerResourceId.label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng chọn nguồn khách hàng",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn nguồn khách hàng"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={customerResourceOptions}
                                    />
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
                            <Button
                                onClick={() => {
                                    handleReset();
                                    form.resetFields();
                                }}
                            >
                                Mặc định
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </div>
                    </Card>
                </Form>
            </Space>
        </>
    );
}

export default CustomerCreate;
