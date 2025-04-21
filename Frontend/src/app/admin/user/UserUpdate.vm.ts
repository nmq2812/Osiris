import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import { RoleResponse } from "@/models/Role";
import { UserResponse, UserRequest } from "@/models/User";
import useAdminAuthStore from "@/stores/use-admin-auth-store";
import MiscUtils from "@/utils/MiscUtils";
import DistrictConfigs from "../address/district/DistrictConfigs";
import ProvinceConfigs from "../address/province/ProvinceConfigs";
import UserConfigs from "./UserConfigs";
import RoleConfigs from "./role/RoleConfigs";

function useUserUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: UserConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(UserConfigs.createUpdateFormSchema),
    });

    const { user: adminUser, updateUser: updateAdminUser } =
        useAdminAuthStore();

    const [user, setUser] = useState<UserResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);
    const [roleSelectList, setRoleSelectList] = useState<SelectOption[]>([]);

    const updateApi = useUpdateApi<UserRequest, UserResponse>(
        UserConfigs.resourceUrl,
        UserConfigs.resourceKey,
        id,
    );
    useGetByIdApi<UserResponse>(
        UserConfigs.resourceUrl,
        UserConfigs.resourceKey,
        id,
        (userResponse) => {
            setUser(userResponse);
            const formValues: typeof form.values = {
                username: userResponse.username,
                password: "",
                fullname: userResponse.fullname,
                email: userResponse.email,
                phone: userResponse.phone,
                gender: userResponse.gender,
                "address.line": userResponse.address.line || "",
                "address.provinceId": userResponse.address.province
                    ? String(userResponse.address.province.id)
                    : null,
                "address.districtId": userResponse.address.district
                    ? String(userResponse.address.district.id)
                    : null,
                avatar: userResponse.avatar || "",
                status: String(userResponse.status),
                roles: userResponse.roles.map((role) => String(role.id)),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        },
    );
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
    useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
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
    useGetAllApi<RoleResponse>(
        RoleConfigs.resourceUrl,
        RoleConfigs.resourceKey,
        { sort: "id,asc", all: 1 },
        (roleListResponse) => {
            const selectList: SelectOption[] = roleListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setRoleSelectList(selectList);
        },
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        // TODO: Bad code for check admin
        const checkAdmin =
            adminUser &&
            adminUser.roles.map((r) => r.code).includes("ADMIN") &&
            formValues.username === adminUser.username &&
            !formValues.roles.includes("1");

        if (!MiscUtils.isEquals(formValues, prevFormValues) && user) {
            if (checkAdmin) {
                form.setFieldError(
                    "roles",
                    "Người quản trị không được xóa quyền Người quản trị",
                );
            } else {
                const requestBody: UserRequest = {
                    username: formValues.username,
                    password: formValues.password || null,
                    fullname: formValues.fullname,
                    email: formValues.email,
                    phone: formValues.phone,
                    gender: formValues.gender,
                    address: {
                        line: formValues["address.line"],
                        provinceId: Number(formValues["address.provinceId"]),
                        districtId: Number(formValues["address.districtId"]),
                        wardId: null,
                    },
                    avatar: formValues.avatar.trim() || null,
                    status: Number(formValues.status),
                    roles: formValues.roles.map((roleId) => ({
                        id: Number(roleId),
                    })),
                };
                updateApi.mutate(requestBody, {
                    onSuccess: (userResponse) => {
                        if (
                            adminUser &&
                            formValues.username === adminUser.username
                        ) {
                            updateAdminUser(userResponse);
                        }
                    },
                });
            }
        }
    });

    const genderSelectList: SelectOption[] = [
        {
            value: "M",
            label: "Nam",
        },
        {
            value: "F",
            label: "Nữ",
        },
    ];

    const statusSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Đã kích hoạt",
        },
        {
            value: "2",
            label: "Chưa kích hoạt",
        },
    ];

    const isDisabledUpdateButton = MiscUtils.isEquals(
        form.values,
        prevFormValues,
    );

    return {
        user,
        form,
        handleFormSubmit,
        genderSelectList,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        roleSelectList,
        isDisabledUpdateButton,
    };
}

export default useUserUpdateViewModel;
