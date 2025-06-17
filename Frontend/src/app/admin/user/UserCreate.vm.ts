import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import { RoleResponse } from "@/models/Role";
import { UserRequest, UserResponse } from "@/models/User";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import DistrictConfigs from "../address/district/DistrictConfigs";
import ProvinceConfigs from "../address/province/ProvinceConfigs";
import UserConfigs from "./UserConfigs";
import RoleConfigs from "./role/RoleConfigs";

function useUserCreateViewModel() {
    const form = useForm({
        initialValues: UserConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(UserConfigs.createUpdateFormSchema),
    });

    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);
    const [roleSelectList, setRoleSelectList] = useState<SelectOption[]>([]);

    const createApi = useCreateApi<UserRequest, UserResponse>(
        UserConfigs.resourceUrl,
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
        const requestBody: UserRequest = {
            username: formValues.username,
            password: formValues.password,
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
            roles: formValues.roles.map((roleId) => ({ id: Number(roleId) })),
        };
        createApi.mutate(requestBody);
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

    return {
        form,
        handleFormSubmit,
        genderSelectList,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        roleSelectList,
    };
}

export default useUserCreateViewModel;
