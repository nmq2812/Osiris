"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Row,
    Col,
    Select,
    Space,
    Input,
    Typography,
    Form,
    theme,
} from "antd";
import DistrictConfigs from "@/app/admin/district/DistrictConfigs";
import ProvinceConfigs from "@/app/admin/province/ProvinceConfigs";
import WardConfigs from "@/app/admin/ward/WardConfigs";
import ClientUserNavbar from "@/components/ClientUserNavbar";
import ResourceURL from "@/constants/ResourceURL";
import { ClientPersonalSettingUserRequest } from "@/datas/ClientUI";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import useTitle from "@/hooks/use-title";
import { DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import { UserResponse } from "@/models/User";
import { WardResponse } from "@/models/Ward";
import { useAuthStore } from "@/stores/authStore";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import MessageUtils from "@/utils/MessageUtils";
import MiscUtils from "@/utils/MiscUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation } from "react-query";
import { z } from "zod";

const { Title } = Typography;
const { useToken } = theme;

// Zod schema for validation
const formSchema = z.object({
    username: z
        .string({ invalid_type_error: "Vui lòng không bỏ trống" })
        .min(2, MessageUtils.min("Tên tài khoản", 2)),
    fullname: z.string({ invalid_type_error: "Vui lòng không bỏ trống" }),
    gender: z.string({ invalid_type_error: "Vui lòng không bỏ trống" }),
    "address.line": z.string({ invalid_type_error: "Vui lòng không bỏ trống" }),
    "address.provinceId": z.string({
        invalid_type_error: "Vui lòng không bỏ trống",
    }),
    "address.districtId": z.string({
        invalid_type_error: "Vui lòng không bỏ trống",
    }),
    "address.wardId": z.string({
        invalid_type_error: "Vui lòng không bỏ trống",
    }),
});

// Gender select options
const genderSelectList = [
    {
        value: "M",
        label: "Nam",
    },
    {
        value: "F",
        label: "Nữ",
    },
];

function ClientSettingPersonal() {
    useTitle("Cập nhật thông tin cá nhân");
    const { token } = useToken();
    const { user, updateUser } = useAuthStore();
    const [form] = Form.useForm();
    const [formChanged, setFormChanged] = useState(false);

    // State for select options
    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);
    const [wardSelectList, setWardSelectList] = useState<SelectOption[]>([]);

    // Set initial values - đảm bảo form có giá trị mặc định
    const initialValues = {
        username: user?.username || "",
        fullname: user?.fullname || "",
        gender: user?.gender || "",
        "address.line": user?.address?.line || "",
        "address.provinceId": user?.address?.province?.id
            ? String(user.address.province.id)
            : undefined,
        "address.districtId": user?.address?.district?.id
            ? String(user.address.district.id)
            : undefined,
        "address.wardId": user?.address?.ward?.id
            ? String(user.address.ward.id)
            : undefined,
    };

    // Sử dụng useEffect để cập nhật form values khi user thay đổi
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                fullname: user.fullname || "",
                gender: user.gender || "",
                "address.line": user.address?.line || "",
                "address.provinceId": user.address?.province?.id
                    ? String(user.address.province.id)
                    : undefined,
                "address.districtId": user.address?.district?.id
                    ? String(user.address.district.id)
                    : undefined,
                "address.wardId": user.address?.ward?.id
                    ? String(user.address.ward.id)
                    : undefined,
            });
        }
    }, [user, form]);

    // Fetch provinces
    useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        (provinceListResponse) => {
            const selectList: SelectOption[] = provinceListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setProvinceSelectList(selectList);
        },
    );

    // Handle province change
    const handleProvinceChange = (value: string) => {
        form.setFieldValue("address.provinceId", value);
        form.setFieldValue("address.districtId", undefined);
        form.setFieldValue("address.wardId", undefined);
        setFormChanged(true);
    };

    // Fetch districts based on selected province
    useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        {
            all: 1,
            filter: `province.id==${
                form.getFieldValue("address.provinceId") || 0
            }`,
        },
        (districtListResponse) => {
            const selectList: SelectOption[] = districtListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setDistrictSelectList(selectList);
        },
    );

    // Handle district change
    const handleDistrictChange = (value: string) => {
        form.setFieldValue("address.districtId", value);
        form.setFieldValue("address.wardId", undefined);
        setFormChanged(true);
    };

    // Fetch wards based on selected district
    useGetAllApi<WardResponse>(
        WardConfigs.resourceUrl,
        WardConfigs.resourceKey,
        {
            all: 1,
            filter: `district.id==${
                form.getFieldValue("address.districtId") || 0
            }`,
        },
        (wardListResponse) => {
            const selectList: SelectOption[] = wardListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setWardSelectList(selectList);
        },
    );

    // Handle ward change
    const handleWardChange = () => {
        setFormChanged(true);
    };

    // Handle field changes
    const handleFieldChange = () => {
        setFormChanged(true);
    };

    // API mutation for updating user info
    const updatePersonalSettingApi = useMutation<
        UserResponse,
        ErrorMessage,
        ClientPersonalSettingUserRequest
    >(
        (requestBody) =>
            FetchUtils.postWithToken(
                ResourceURL.CLIENT_USER_PERSONAL_SETTING,
                requestBody,
            ),
        {
            onSuccess: (userResponse) => {
                updateUser(userResponse);
                NotifyUtils.simpleSuccess("Cập nhật thành công");
                setFormChanged(false);
            },
            onError: () =>
                NotifyUtils.simpleFailed("Cập nhật không thành công"),
        },
    );

    // Handle form submission
    const handleFormSubmit = async (values: any) => {
        try {
            // Validate form with Zod
            formSchema.parse(values);

            const requestBody: ClientPersonalSettingUserRequest = {
                username: values.username,
                fullname: values.fullname,
                gender: values.gender,
                address: {
                    line: values["address.line"],
                    provinceId: Number(values["address.provinceId"]),
                    districtId: Number(values["address.districtId"]),
                    wardId: Number(values["address.wardId"]),
                },
            };

            updatePersonalSettingApi.mutate(requestBody);
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    // Hiển thị lỗi trên form fields
                    form.setFields([
                        {
                            name: err.path,
                            errors: [err.message],
                        },
                    ]);
                });
            }
        }
    };

    return (
        <main>
            <div className="container mx-auto px-4" style={{ maxWidth: 1200 }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <ClientUserNavbar />
                    </Col>

                    <Col xs={24} md={18}>
                        <Card
                            bordered={false}
                            style={{
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                borderRadius: token.borderRadiusLG,
                            }}
                        >
                            <Space
                                direction="vertical"
                                size="large"
                                style={{ width: "100%" }}
                            >
                                <Title level={2}>
                                    Cập nhật thông tin cá nhân
                                </Title>

                                <Row>
                                    <Col xs={24} lg={12}>
                                        <Form
                                            form={form}
                                            layout="vertical"
                                            onFinish={handleFormSubmit}
                                            onValuesChange={handleFieldChange}
                                            requiredMark
                                            initialValues={initialValues}
                                        >
                                            <Space
                                                direction="vertical"
                                                size="middle"
                                                style={{ width: "100%" }}
                                            >
                                                <Form.Item
                                                    label="Tên tài khoản"
                                                    name="username"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                        {
                                                            min: 2,
                                                            message:
                                                                MessageUtils.min(
                                                                    "Tên tài khoản",
                                                                    2,
                                                                ),
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Nhập tên tài khoản của bạn"
                                                        disabled
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Họ và tên"
                                                    name="fullname"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Nhập họ và tên của bạn" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Giới tính"
                                                    name="gender"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Chọn giới tính"
                                                        options={
                                                            genderSelectList
                                                        }
                                                        onChange={
                                                            handleFieldChange
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Tỉnh thành"
                                                    name="address.provinceId"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Chọn tỉnh thành"
                                                        options={
                                                            provinceSelectList
                                                        }
                                                        onChange={
                                                            handleProvinceChange
                                                        }
                                                        showSearch
                                                        filterOption={(
                                                            input,
                                                            option,
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ""
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase(),
                                                                )
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Quận huyện"
                                                    name="address.districtId"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Chọn quận huyện"
                                                        options={
                                                            districtSelectList
                                                        }
                                                        disabled={
                                                            !form.getFieldValue(
                                                                "address.provinceId",
                                                            )
                                                        }
                                                        onChange={
                                                            handleDistrictChange
                                                        }
                                                        showSearch
                                                        filterOption={(
                                                            input,
                                                            option,
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ""
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase(),
                                                                )
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Phường xã"
                                                    name="address.wardId"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Chọn phường xã"
                                                        options={wardSelectList}
                                                        disabled={
                                                            !form.getFieldValue(
                                                                "address.districtId",
                                                            )
                                                        }
                                                        onChange={
                                                            handleWardChange
                                                        }
                                                        showSearch
                                                        filterOption={(
                                                            input,
                                                            option,
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ""
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase(),
                                                                )
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Địa chỉ"
                                                    name="address.line"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Nhập địa chỉ của bạn" />
                                                </Form.Item>

                                                <Form.Item>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        disabled={!formChanged}
                                                        loading={
                                                            updatePersonalSettingApi.isLoading
                                                        }
                                                    >
                                                        Cập nhật
                                                    </Button>
                                                </Form.Item>
                                            </Space>
                                        </Form>
                                    </Col>
                                </Row>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </main>
    );
}

export default ClientSettingPersonal;
