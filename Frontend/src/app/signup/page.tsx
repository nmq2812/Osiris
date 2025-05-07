"use client";
import React, { useEffect, useState, Suspense } from "react";
import {
    Button,
    Card,
    Layout,
    Divider,
    Space,
    Input,
    Select,
    Flex,
    Steps,
    Typography,
    Form,
    Modal,
    Spin,
} from "antd";

import {
    CheckOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import ResourceURL from "@/constants/ResourceURL";
import { RegistrationResponse, RegistrationRequest } from "@/datas/ClientUI";
import { SelectOption } from "@/datas/SelectOption";
import { Empty } from "@/datas/Utility";
import useGetAllApi from "@/hooks/use-get-all-api";
import useTitle from "@/hooks/use-title";
import { DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import { UserRequest } from "@/models/User";
import { WardResponse } from "@/models/Ward";
import { useAuthStore } from "@/stores/authStore";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import MessageUtils from "@/utils/MessageUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import ProvinceConfigs from "../admin/address/province/ProvinceConfigs";
import DistrictConfigs from "../admin/address/district/DistrictConfigs";
import WardConfigs from "../admin/address/ward/WardConfigs";

const { Text, Title } = Typography;
const { Content } = Layout;

const genderSelectList: SelectOption[] = [
    { value: "M", label: "Nam" },
    { value: "F", label: "Nữ" },
];

// Component chính - không sử dụng useSearchParams trực tiếp
function ClientSignup() {
    useTitle();
    const router = useRouter();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [router, user]);

    return (
        <main>
            <Layout>
                <Content
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        padding: "0 20px",
                    }}
                >
                    <Flex vertical align="center" gap={50}>
                        <Title level={2}>Đăng ký tài khoản</Title>

                        <div style={{ width: "100%", maxWidth: 800 }}>
                            <Suspense
                                fallback={
                                    <div
                                        style={{
                                            padding: 40,
                                            textAlign: "center",
                                        }}
                                    >
                                        <Spin size="large" />
                                        <div style={{ marginTop: 16 }}>
                                            Đang tải...
                                        </div>
                                    </div>
                                }
                            >
                                <SignupContent />
                            </Suspense>
                        </div>
                    </Flex>
                </Content>
            </Layout>
        </main>
    );
}

// Component con sử dụng useSearchParams - được bọc trong Suspense
function SignupContent() {
    const searchParams = useSearchParams();
    const { currentSignupUserId } = useAuthStore();

    const userId = searchParams.get("userId") || currentSignupUserId;
    const currentStep = userId ? 1 : 0; // Nếu có userId thì nhảy sang bước 2
    const [active, setActive] = useState(currentStep);

    const nextStep = () =>
        setActive((current) =>
            current < 1 ? current + 1 : current === 1 ? 3 : current,
        );

    return (
        <>
            <Steps
                current={active}
                onChange={setActive}
                items={[
                    {
                        title: "Bước 1",
                        description: "Tạo tài khoản",
                        icon: <UserOutlined />,
                    },
                    {
                        title: "Bước 2",
                        description: "Xác nhận email",
                        icon: <MailOutlined />,
                    },
                    {
                        title: "Bước 3",
                        description: "Đăng ký thành công",
                        icon: <SafetyCertificateOutlined />,
                    },
                ]}
            />
            <div style={{ marginTop: 50 }}>
                {active === 0 && <ClientSignupStepOne nextStep={nextStep} />}
                {active === 1 && (
                    <ClientSignupStepTwo
                        nextStep={nextStep}
                        userId={Number(userId) || null}
                    />
                )}
                {active === 3 && <ClientSignupStepThree />}
            </div>
        </>
    );
}

// Fix ClientSignupStepOne component
function ClientSignupStepOne({ nextStep }: { nextStep: () => void }) {
    const { updateCurrentSignupUserId } = useAuthStore();
    const [form] = Form.useForm();

    const initialFormValues = {
        username: "",
        password: "",
        fullname: "",
        email: "",
        phone: "",
        gender: "M" as "M" | "F",
        "address.line": "",
        "address.provinceId": null as string | null,
        "address.districtId": null as string | null,
        "address.wardId": null as string | null,
        avatar: null,
        status: "2",
        roles: [] as string[],
    };

    // Address selection handling
    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);
    const [wardSelectList, setWardSelectList] = useState<SelectOption[]>([]);

    // Track selected province and district IDs for dependency triggers
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(
        null,
    );
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(
        null,
    );

    // Get province data
    const { data: provinceListResponse } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
    );

    // Get district data based on selected province
    const { data: districtListResponse } = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        {
            all: 1,
            filter: `province.id==${selectedProvinceId || 0}`,
        },
    );

    // Get ward data based on selected district
    const { data: wardListResponse } = useGetAllApi<WardResponse>(
        WardConfigs.resourceUrl,
        WardConfigs.resourceKey,
        {
            all: 1,
            filter: `district.id==${selectedDistrictId || 0}`,
        },
    );

    // Process province data
    useEffect(() => {
        if (provinceListResponse?.content) {
            const selectList: SelectOption[] = provinceListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setProvinceSelectList(selectList);
        }
    }, [provinceListResponse]);

    // Process district data
    useEffect(() => {
        if (districtListResponse?.content) {
            const selectList: SelectOption[] = districtListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setDistrictSelectList(selectList);
        }
    }, [districtListResponse]);

    // Process ward data
    useEffect(() => {
        if (wardListResponse?.content) {
            const selectList: SelectOption[] = wardListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setWardSelectList(selectList);
        }
    }, [wardListResponse]);

    // Handle province change to load districts
    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
        form.setFieldValue("address.districtId", null);
        form.setFieldValue("address.wardId", null);
        setSelectedDistrictId(null);
    };

    // Handle district change to load wards
    const handleDistrictChange = (districtId: string) => {
        setSelectedDistrictId(districtId);
        form.setFieldValue("address.wardId", null);
    };

    const registerUserApi = useMutation<
        RegistrationResponse,
        ErrorMessage,
        UserRequest
    >({
        mutationFn: (requestBody) =>
            FetchUtils.post(ResourceURL.CLIENT_REGISTRATION, requestBody),

        onSuccess: (registrationResponse) => {
            NotifyUtils.simpleSuccess("Tạo tài khoản thành công");
            updateCurrentSignupUserId(registrationResponse.userId);
            nextStep();
        },
        onError: () =>
            NotifyUtils.simpleFailed("Tạo tài khoản không thành công"),
    });

    const handleFormSubmit = (values: any) => {
        const requestBody: UserRequest = {
            username: values.username,
            password: values.password,
            fullname: values.fullname,
            email: values.email,
            phone: values.phone,
            gender: values.gender,
            address: {
                line: values["address.line"],
                provinceId: Number(values["address.provinceId"]),
                districtId: Number(values["address.districtId"]),
                wardId: Number(values["address.wardId"]),
            },
            avatar: values.avatar,
            status: Number(values.status),
            roles: [],
        };

        registerUserApi.mutate(requestBody);
    };

    // Form validation rules
    const validateEmail = (_: any, value: string) => {
        if (!value) return Promise.reject("Vui lòng không bỏ trống");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return Promise.reject("Nhập email đúng định dạng");
        }
        return Promise.resolve();
    };

    const validatePhone = (_: any, value: string) => {
        if (!value) return Promise.reject("Vui lòng không bỏ trống");
        if (!/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(value)) {
            return Promise.reject("Nhập số điện thoại đúng định dạng");
        }
        return Promise.resolve();
    };

    return (
        <Card
            style={{
                maxWidth: 500,
                margin: "auto",
                border: "1px solid #d9d9d9",
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialFormValues}
                onFinish={handleFormSubmit}
            >
                <Form.Item
                    name="username"
                    label="Tên tài khoản"
                    rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                        {
                            min: 2,
                            message: MessageUtils.min("Tên tài khoản", 2),
                        },
                    ]}
                >
                    <Input placeholder="Nhập tên tài khoản mong muốn" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                        { min: 1, message: MessageUtils.min("Mật khẩu", 1) },
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu mong muốn" />
                </Form.Item>

                <Form.Item
                    name="fullname"
                    label="Họ và tên"
                    rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                    ]}
                >
                    <Input placeholder="Nhập họ và tên của bạn" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ validator: validateEmail }]}
                >
                    <Input placeholder="Nhập email của bạn" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ validator: validatePhone }]}
                >
                    <Input placeholder="Nhập số điện thoại của bạn" />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                    ]}
                >
                    <Select
                        placeholder="Chọn giới tính"
                        options={genderSelectList}
                    />
                </Form.Item>

                <Form.Item
                    name="address.provinceId"
                    label="Tỉnh thành"
                    rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                    ]}
                >
                    <Select
                        placeholder="Chọn tỉnh thành"
                        options={provinceSelectList}
                        onChange={handleProvinceChange}
                    />
                </Form.Item>

                <Form.Item
                    name="address.districtId"
                    label="Quận huyện"
                    rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                    ]}
                >
                    <Select
                        placeholder="Chọn quận huyện"
                        options={districtSelectList}
                        disabled={!form.getFieldValue("address.provinceId")}
                        onChange={handleDistrictChange}
                    />
                </Form.Item>

                <Form.Item
                    name="address.wardId"
                    label="Phường xã"
                    rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                    ]}
                >
                    <Select
                        placeholder="Chọn phường xã"
                        options={wardSelectList}
                        disabled={!form.getFieldValue("address.districtId")}
                    />
                </Form.Item>

                <Form.Item
                    name="address.line"
                    label="Địa chỉ"
                    rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                    ]}
                >
                    <Input placeholder="Nhập địa chỉ của bạn" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={registerUserApi.isPending}
                    >
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

// Fix ClientSignupStepTwo component
function ClientSignupStepTwo({
    nextStep,
    userId,
}: {
    nextStep: () => void;
    userId: number | null;
}) {
    const [form] = Form.useForm();
    const [changeEmailForm] = Form.useForm();
    const { updateCurrentSignupUserId } = useAuthStore();

    const initialFormValues = {
        token: "",
    };

    const confirmRegistrationApi = useMutation<
        void,
        ErrorMessage,
        RegistrationRequest
    >({
        mutationFn: (requestBody) =>
            FetchUtils.post(
                ResourceURL.CLIENT_REGISTRATION_CONFIRM,
                requestBody,
            ),

        onSuccess: () => {
            NotifyUtils.simpleSuccess("Xác nhận tài khoản thành công");
            updateCurrentSignupUserId(null);
            nextStep();
        },
        onError: () =>
            NotifyUtils.simpleFailed("Xác nhận tài khoản không thành công"),
    });

    const resendRegistrationTokenApi = useMutation<
        Empty,
        ErrorMessage,
        { userId: number }
    >({
        mutationFn: (request) =>
            FetchUtils.get(
                ResourceURL.CLIENT_REGISTRATION_RESEND_TOKEN(request.userId),
            ),

        onSuccess: () => {
            NotifyUtils.simpleSuccess("Đã gửi lại mã xác nhận thành công");
            Modal.destroyAll();
        },
        onError: () =>
            NotifyUtils.simpleFailed("Gửi lại mã xác nhận không thành công"),
    });

    const changeRegistrationEmailApi = useMutation<
        Empty,
        ErrorMessage,
        { userId: number; email: string }
    >({
        mutationFn: (request) =>
            FetchUtils.put(
                ResourceURL.CLIENT_REGISTRATION_CHANGE_EMAIL(request.userId),
                {},
                { email: request.email },
            ),

        onSuccess: () => {
            NotifyUtils.simpleSuccess(
                "Đã đổi email thành công và đã gửi lại mã xác nhận mới",
            );
            Modal.destroyAll();
        },
        onError: () =>
            NotifyUtils.simpleFailed("Thay đổi email không thành công"),
    });

    const handleFormSubmit = (values: any) => {
        if (userId) {
            const requestBody: RegistrationRequest = {
                userId: userId,
                token: values.token,
            };

            confirmRegistrationApi.mutate(requestBody);
        }
    };

    const handleResendTokenButton = () => {
        if (userId) {
            Modal.confirm({
                title: "Gửi lại mã xác nhận",
                content:
                    "Bạn có muốn gửi lại mã xác nhận đến email đã nhập trước đó?",
                onOk: () =>
                    resendRegistrationTokenApi.mutate({ userId: userId }),
                okText: "Gửi",
                cancelText: "Đóng",
                okButtonProps: {
                    loading: resendRegistrationTokenApi.isPending,
                },
            });
        }
    };

    const handleResendTokenWithNewEmailButton = () => {
        // Reset form khi mở modal
        changeEmailForm.resetFields();

        Modal.confirm({
            title: "Thay đổi email",
            content: (
                <Form
                    form={changeEmailForm}
                    layout="vertical"
                    initialValues={{ email: "" }}
                >
                    <Form.Item
                        name="email"
                        label="Email mới"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng không bỏ trống",
                            },
                            {
                                type: "email",
                                message: "Nhập email đúng định dạng",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập email mới" />
                    </Form.Item>
                </Form>
            ),
            okText: "Thay đổi và Gửi",
            cancelText: "Đóng",
            onOk: async () => {
                try {
                    // Validate form trước
                    const values = await changeEmailForm.validateFields();

                    // Chỉ tiến hành nếu validation thành công và userId tồn tại
                    if (userId) {
                        return changeRegistrationEmailApi.mutateAsync({
                            userId: userId,
                            email: values.email,
                        });
                    }
                } catch (error) {
                    // Validation thất bại
                    return Promise.reject("Vui lòng nhập email hợp lệ");
                }
            },
            okButtonProps: {
                loading: changeRegistrationEmailApi.isPending,
            },
        });
    };

    return (
        <Card
            style={{ width: 500, margin: "auto", border: "1px solid #d9d9d9" }}
        >
            <Space direction="vertical" size="large">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialFormValues}
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="token"
                        label="Mã xác nhận"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng không bỏ trống",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập mã xác nhận đã gửi" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={confirmRegistrationApi.isPending}
                        >
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>

                <Divider>hoặc</Divider>

                <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                >
                    <Button type="default" onClick={handleResendTokenButton}>
                        Gửi mã xác nhận lần nữa
                    </Button>

                    <Button
                        type="default"
                        onClick={handleResendTokenWithNewEmailButton}
                    >
                        Gửi mã xác nhận lần nữa với email mới
                    </Button>
                </Space>
            </Space>
        </Card>
    );
}

function ClientSignupStepThree() {
    return (
        <Space direction="vertical" align="center" style={{ color: "#52c41a" }}>
            <CheckOutlined style={{ fontSize: 100 }} />
            <Text strong>Đã tạo tài khoản và xác nhận thành công!</Text>
            <Button type="primary" size="large" href="/signin">
                Đăng nhập
            </Button>
        </Space>
    );
}

export default ClientSignup;
