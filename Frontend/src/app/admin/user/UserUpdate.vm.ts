import { useState, useEffect } from "react";
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
import { WardResponse } from "@/models/Ward";
import WardConfigs from "../address/ward/WardConfigs";

function useUserUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: UserConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(UserConfigs.createUpdateFormSchema),
    });

    const { user: adminUser, updateUser: updateAdminUser } =
        useAdminAuthStore();

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);
    const [wardSelectList, setWardSelectList] = useState<SelectOption[]>([]);
    const [roleSelectList, setRoleSelectList] = useState<SelectOption[]>([]);

    const provincesQuery = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["provinces-all"],
        },
    );

    const districtsQuery = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["districts-all"],
        },
    );

    const wardQuery = useGetAllApi<WardResponse>(
        WardConfigs.resourceUrl,
        WardConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["wards-all"],
        },
    );

    const rolesQuery = useGetAllApi<RoleResponse>(
        RoleConfigs.resourceUrl,
        RoleConfigs.resourceKey,
        { sort: "id,asc", all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["roles-all"],
        },
    );

    useEffect(() => {
        if (provincesQuery.data) {
            const selectList: SelectOption[] = provincesQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            console.log("Setting province select list:", selectList);
            setProvinceSelectList(selectList);
        }
    }, [provincesQuery.data]);

    useEffect(() => {
        if (districtsQuery.data) {
            const selectList: SelectOption[] = districtsQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                    provinceId: String(item.province?.id || ""),
                }),
            );
            console.log("Setting district select list:", selectList);
            setDistrictSelectList(selectList);
        }
    }, [districtsQuery.data]);

    useEffect(() => {
        if (wardQuery.data) {
            const selectList: SelectOption[] = wardQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                    districtId: String(item.district?.id || ""),
                }),
            );
            console.log("Setting ward select list:", selectList);
            setWardSelectList(selectList);
        }
    }, [wardQuery.data]);

    useEffect(() => {
        if (rolesQuery.data) {
            const selectList: SelectOption[] = rolesQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            console.log("Setting role select list:", selectList);
            setRoleSelectList(selectList);
        }
    }, [rolesQuery.data]);

    useEffect(() => {
        if (form.values["address.provinceId"]) {
            if (districtsQuery.data) {
                const filteredDistricts = districtsQuery.data.content
                    .filter(
                        (district) =>
                            district.province &&
                            String(district.province.id) ===
                                form.values["address.provinceId"],
                    )
                    .map((item) => ({
                        value: String(item.id),
                        label: item.name,
                    }));

                console.log(
                    "Filtered districts by province:",
                    filteredDistricts,
                );
                setDistrictSelectList(filteredDistricts);
            }
        }
    }, [form.values["address.provinceId"], districtsQuery.data]);

    useEffect(() => {
        if (form.values["address.districtId"]) {
            if (wardQuery.data) {
                const filteredWards = wardQuery.data.content
                    .filter(
                        (ward) =>
                            ward.district &&
                            String(ward.district.id) ===
                                form.values["address.districtId"],
                    )
                    .map((item) => ({
                        value: String(item.id),
                        label: item.name,
                    }));

                console.log("Filtered wards by district:", filteredWards);
                setWardSelectList(filteredWards);
            }
        }
    }, [form.values["address.districtId"], wardQuery.data]);

    const updateApi = useUpdateApi<UserRequest, UserResponse>(
        UserConfigs.resourceUrl,
        UserConfigs.resourceKey,
        id,
    );

    const {
        data: user,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useGetByIdApi<UserResponse>(
        UserConfigs.resourceUrl,
        UserConfigs.resourceKey,
        id,
        (userResponse) => {
            if (!userResponse) return;

            const formValues: typeof form.values = {
                username: userResponse.username,
                password: "",
                fullname: userResponse.fullname,
                email: userResponse.email,
                phone: userResponse.phone,
                gender: userResponse.gender,
                "address.line": userResponse.address?.line || "",
                "address.provinceId": userResponse.address?.province
                    ? String(userResponse.address.province.id)
                    : null,
                "address.districtId": userResponse.address?.district
                    ? String(userResponse.address.district.id)
                    : null,
                "address.wardId": userResponse.address?.ward
                    ? String(userResponse.address.ward.id)
                    : null,
                avatar: userResponse.avatar || "",
                status: String(userResponse.status),
                roles: userResponse.roles?.map((role) => String(role.id)) || [],
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        },
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`user-${id}`],
        },
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        if (!user) return;

        const checkAdmin =
            adminUser &&
            adminUser.roles.map((r) => r.code).includes("ADMIN") &&
            formValues.username === adminUser.username &&
            !formValues.roles.includes("1");

        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
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
                        wardId: Number(formValues["address.wardId"]) || null,
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

    const isLoading =
        isUserLoading ||
        provincesQuery.isLoading ||
        districtsQuery.isLoading ||
        wardQuery.isLoading ||
        rolesQuery.isLoading;

    return {
        user,
        form,
        handleFormSubmit,
        genderSelectList,
        provinceSelectList,
        districtSelectList,
        wardSelectList,
        statusSelectList,
        roleSelectList,
        isDisabledUpdateButton,
        isLoading,
        isError: isUserError,
    };
}

export default useUserUpdateViewModel;
