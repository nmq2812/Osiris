"use client";
import React, { useEffect } from "react";
import {
    Button,
    Divider,
    Row,
    Col,
    Space,
    Card,
    Input,
    Form,
    Select,
    Spin,
    Typography,
    Result,
} from "antd";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import { useParams } from "next/navigation";
import UserConfigs from "../../UserConfigs";
import useUserUpdateViewModel from "../../UserUpdate.vm";

const { Text } = Typography;
const { Password } = Input;

function UserUpdate() {
    const param = useParams();
    const id = typeof param.slug === "string" ? parseInt(param.slug) : 0;

    // Form instance của Ant Design
    const [form] = Form.useForm();

    const {
        user,
        form: mantineForm, // Giữ lại để sử dụng logic ViewModel
        handleFormSubmit,
        genderSelectList,
        provinceSelectList,
        districtSelectList,
        wardSelectList, // Thêm wardSelectList
        statusSelectList,
        roleSelectList,
        isDisabledUpdateButton,
        isLoading,
        isError,
    } = useUserUpdateViewModel(Number(id));

    // Chuyển đổi dữ liệu cho Ant Design Select
    const genderOptions = genderSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    const provinceOptions = provinceSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    const districtOptions = districtSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Thêm wardOptions
    const wardOptions = wardSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    const statusOptions = statusSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    const roleOptions = roleSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Cập nhật form khi user thay đổi
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                password: "",
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                "address.line": user.address?.line || "",
                "address.provinceId": user.address?.province
                    ? String(user.address.province.id)
                    : undefined,
                "address.districtId": user.address?.district
                    ? String(user.address.district.id)
                    : undefined,
                // Thêm giá trị cho ward
                "address.wardId": user.address?.ward
                    ? String(user.address.ward.id)
                    : undefined,
                avatar: user.avatar || "",
                status: String(user.status),
                roles: user.roles?.map((role) => String(role.id)) || [],
            });
        }
    }, [form, user]);

    // Xử lý khi thay đổi tỉnh/thành phố
    const handleProvinceChange = (value: any) => {
        form.setFieldValue("address.provinceId", value);
        form.setFieldValue("address.districtId", undefined);
        form.setFieldValue("address.wardId", undefined); // Reset ward khi province thay đổi
    };

    // Thêm xử lý khi thay đổi quận/huyện
    const handleDistrictChange = (value: any) => {
        form.setFieldValue("address.districtId", value);
        form.setFieldValue("address.wardId", undefined); // Reset ward khi district thay đổi
    };

    // Xử lý submit form
    const onFinish = (values: any) => {
        // Cập nhật vào Mantine form để sử dụng logic ViewModel
        mantineForm.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    // Hiển thị loading state
    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <Text>Đang tải dữ liệu người dùng...</Text>
                </Space>
            </div>
        );
    }

    // Hiển thị lỗi
    if (isError || !user) {
        return (
            <Result
                status="error"
                title="Không thể tải thông tin người dùng"
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

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={UserConfigs.managerPath}
                title={UserConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={user.id}
                createdAt={user.createdAt}
                updatedAt={user.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    username: user.username,
                    password: "",
                    fullname: user.fullname,
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender,
                    "address.line": user.address?.line || "",
                    "address.provinceId": user.address?.province
                        ? String(user.address.province.id)
                        : undefined,
                    "address.districtId": user.address?.district
                        ? String(user.address.district.id)
                        : undefined,
                    // Thêm ward vào initialValues
                    "address.wardId": user.address?.ward
                        ? String(user.address.ward.id)
                        : undefined,
                    avatar: user.avatar || "",
                    status: String(user.status),
                    roles: user.roles?.map((role) => String(role.id)) || [],
                }}
            >
                <Card>
                    <Row gutter={16}>
                        {/* Các field hiện có giữ nguyên */}
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="username"
                                label={UserConfigs.properties.username.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên đăng nhập",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="password"
                                label={UserConfigs.properties.password.label}
                            >
                                <Password placeholder="Nhập mật khẩu mới hoặc để trống" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="fullname"
                                label={UserConfigs.properties.fullname.label}
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
                                name="email"
                                label={UserConfigs.properties.email.label}
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
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="phone"
                                label={UserConfigs.properties.phone.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số điện thoại",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="gender"
                                label={UserConfigs.properties.gender.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn giới tính",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--"
                                    options={genderOptions}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="address.line"
                                label={
                                    UserConfigs.properties["address.line"].label
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
                                name="address.provinceId"
                                label={
                                    UserConfigs.properties["address.provinceId"]
                                        .label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn tỉnh/thành phố",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--"
                                    showSearch
                                    options={provinceOptions}
                                    onChange={handleProvinceChange}
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="address.districtId"
                                label={
                                    UserConfigs.properties["address.districtId"]
                                        .label
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn quận/huyện",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--"
                                    showSearch
                                    options={districtOptions}
                                    onChange={handleDistrictChange} // Thêm handler
                                    disabled={
                                        !form.getFieldValue(
                                            "address.provinceId",
                                        )
                                    }
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>

                        {/* Thêm field cho ward */}
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="address.wardId"
                                label={
                                    UserConfigs.properties["address.wardId"]
                                        ?.label || "Phường/Xã"
                                }
                                rules={[
                                    {
                                        required: false,
                                        message: "Vui lòng chọn phường/xã",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--"
                                    showSearch
                                    options={wardOptions}
                                    disabled={
                                        !form.getFieldValue(
                                            "address.districtId",
                                        )
                                    }
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="avatar"
                                label={UserConfigs.properties.avatar.label}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="status"
                                label={UserConfigs.properties.status.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn trạng thái",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="--"
                                    options={statusOptions}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="roles"
                                label={UserConfigs.properties.roles.label}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn vai trò",
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="--"
                                    options={roleOptions}
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
                        <Button onClick={() => form.resetFields()}>
                            Mặc định
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={isDisabledUpdateButton}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </Card>
            </Form>
        </Space>
    );
}

export default UserUpdate;
