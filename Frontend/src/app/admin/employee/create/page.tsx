"use client";
import React, { useEffect } from "react";
import {
    Button,
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
import EmployeeConfigs from "../EmployeeConfigs";
import useEmployeeCreateViewModel from "../EmployeeCreate.vm";

function EmployeeCreate() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

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
        officeSelectList,
        departmentSelectList,
        jobTypeSelectList,
        jobLevelSelectList,
        jobTitleSelectList,
        createStatus,
    } = useEmployeeCreateViewModel();

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
    const officeOptions = officeSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const departmentOptions = departmentSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const jobTypeOptions = jobTypeSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const jobLevelOptions = jobLevelSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));
    const jobTitleOptions = jobTitleSelectList.map((item) => ({
        value: item.value,
        label: item.label,
    }));

    // Xử lý province change để lọc district
    const onProvinceChange = (value: string | null) => {
        handleProvinceChange(value);
        form.setFieldValue("user.address.districtId", null);
    };

    // Lấy districts đã lọc theo province
    const getFilteredDistricts = () => {
        const provinceId = form.getFieldValue("user.address.provinceId");
        if (!provinceId) return [];

        return districtSelectList
            .filter((district) => district.provinceId === provinceId)
            .map((item) => ({ value: item.value, label: item.label }));
    };

    // Theo dõi createStatus để hiển thị thông báo
    useEffect(() => {
        if (createStatus === "success") {
            api.success({
                message: "Thành công",
                description: "Thêm nhân viên mới thành công!",
                onClose: () => router.push(EmployeeConfigs.managerPath),
            });
        } else if (createStatus === "error") {
            api.error({
                message: "Lỗi",
                description:
                    "Có lỗi xảy ra khi thêm nhân viên. Vui lòng thử lại.",
            });
        }
    }, [createStatus, api, router]);

    // Xử lý submit form
    const onFinish = (values: any) => {
        mantineForm.setValues(values);
        handleFormSubmit(new Event("submit") as any);
    };

    // Hiển thị loading state
    if (
        !provinceSelectList.length ||
        !districtSelectList.length ||
        !officeSelectList.length ||
        !departmentSelectList.length ||
        !jobTypeSelectList.length ||
        !jobLevelSelectList.length ||
        !jobTitleSelectList.length
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
                    managerPath={EmployeeConfigs.managerPath}
                    title={EmployeeConfigs.createTitle}
                />

                <DefaultPropertyPanel />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
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
                            String(EmployeeConfigs.EMPLOYEE_ROLE_ID),
                        ],
                        officeId: null,
                        departmentId: null,
                        jobTypeId: null,
                        jobLevelId: null,
                        jobTitleId: null,
                    }}
                >
                    <Card title="Thông tin cá nhân">
                        <Row gutter={16}>
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="user.username"
                                    label={
                                        EmployeeConfigs.properties[
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
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="user.password"
                                    label={
                                        EmployeeConfigs.properties[
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
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="user.fullname"
                                    label={
                                        EmployeeConfigs.properties[
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
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="user.email"
                                    label={
                                        EmployeeConfigs.properties["user.email"]
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
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="user.phone"
                                    label={
                                        EmployeeConfigs.properties["user.phone"]
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
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="user.gender"
                                    label={
                                        EmployeeConfigs.properties[
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
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item
                                    name="user.avatar"
                                    label={
                                        EmployeeConfigs.properties[
                                            "user.avatar"
                                        ].label
                                    }
                                >
                                    <Input placeholder="Nhập URL ảnh đại diện" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Địa chỉ" style={{ marginTop: 16 }}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="user.address.line"
                                    label={
                                        EmployeeConfigs.properties[
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
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.address.provinceId"
                                    label={
                                        EmployeeConfigs.properties[
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
                                        EmployeeConfigs.properties[
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
                        </Row>
                    </Card>

                    <Card title="Thông tin công việc" style={{ marginTop: 16 }}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="officeId"
                                    label={
                                        EmployeeConfigs.properties.officeId
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn văn phòng",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn văn phòng"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={officeOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="departmentId"
                                    label={
                                        EmployeeConfigs.properties.departmentId
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn phòng ban",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn phòng ban"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={departmentOptions}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="jobTypeId"
                                    label={
                                        EmployeeConfigs.properties.jobTypeId
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng chọn loại công việc",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn loại công việc"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={jobTypeOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="jobLevelId"
                                    label={
                                        EmployeeConfigs.properties.jobLevelId
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn cấp độ",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn cấp độ"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={jobLevelOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="jobTitleId"
                                    label={
                                        EmployeeConfigs.properties.jobTitleId
                                            .label
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn chức danh",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn chức danh"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={jobTitleOptions}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="user.status"
                                    label={
                                        EmployeeConfigs.properties[
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
                                        EmployeeConfigs.properties["user.roles"]
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
                        </Row>
                    </Card>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 16,
                        }}
                    >
                        <Space>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    handleReset && handleReset();
                                }}
                            >
                                Mặc định
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Thêm mới
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Space>
        </>
    );
}

export default EmployeeCreate;
