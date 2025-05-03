import { DistrictSelectOption, SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { CustomerRequest, CustomerResponse } from "@/models/Customer";
import { CustomerGroupResponse } from "@/models/CustomerGroup";
import { CustomerResourceResponse } from "@/models/CustomerResource";
import { CustomerStatusResponse } from "@/models/CustomerStatus";
import { DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import { useForm, zodResolver } from "@mantine/form";
import { useState, useEffect } from "react";
import DistrictConfigs from "../address/district/DistrictConfigs";
import ProvinceConfigs from "../address/province/ProvinceConfigs";
import CustomerConfigs from "./CustomerConfigs";
import CustomerGroupConfigs from "./customer-group/CustomerGroupConfigs";
import CustomerResourceConfigs from "./customer-resource/CustomerResourceConfigs";
import CustomerStatusConfigs from "./customer-status/CustomerStatusConfigs";

function useCustomerCreateViewModel() {
    const form = useForm({
        initialValues: CustomerConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CustomerConfigs.createUpdateFormSchema),
    });

    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        DistrictSelectOption[]
    >([]);
    const [customerGroupSelectList, setCustomerGroupSelectList] = useState<
        SelectOption[]
    >([]);
    const [customerStatusSelectList, setCustomerStatusSelectList] = useState<
        SelectOption[]
    >([]);
    const [customerResourceSelectList, setCustomerResourceSelectList] =
        useState<SelectOption[]>([]);

    const createApi = useCreateApi<CustomerRequest, CustomerResponse>(
        CustomerConfigs.resourceUrl,
    );

    // Lấy dữ liệu province
    const { data: provinceData } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 300000, // Cache trong 5 phút
            queryKey: ["provinces-all"],
        },
    );

    // Lấy dữ liệu district
    const { data: districtData } = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 300000,
            queryKey: ["districts-all"],
        },
    );

    // Lấy dữ liệu customer group
    const { data: customerGroupData } = useGetAllApi<CustomerGroupResponse>(
        CustomerGroupConfigs.resourceUrl,
        CustomerGroupConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 300000,
            queryKey: ["customer-groups-all"],
        },
    );

    // Lấy dữ liệu customer status
    const { data: customerStatusData } = useGetAllApi<CustomerStatusResponse>(
        CustomerStatusConfigs.resourceUrl,
        CustomerStatusConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 300000,
            queryKey: ["customer-status-all"],
        },
    );

    // Lấy dữ liệu customer resource
    const { data: customerResourceData } =
        useGetAllApi<CustomerResourceResponse>(
            CustomerResourceConfigs.resourceUrl,
            CustomerResourceConfigs.resourceKey,
            { all: 1 },
            undefined,
            {
                refetchOnWindowFocus: false,
                staleTime: 300000,
                queryKey: ["customer-resources-all"],
            },
        );

    // Xử lý dữ liệu provinces khi fetch thành công
    useEffect(() => {
        if (provinceData && provinceData.content) {
            const selectList: SelectOption[] = provinceData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setProvinceSelectList(selectList);
        }
    }, [provinceData]);

    // Xử lý dữ liệu districts khi fetch thành công
    useEffect(() => {
        if (districtData && districtData.content) {
            const selectList: DistrictSelectOption[] = districtData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                    provinceId: item.province ? String(item.province.id) : "",
                }),
            );
            setDistrictSelectList(selectList);
        }
    }, [districtData]);

    // Xử lý dữ liệu customer groups khi fetch thành công
    useEffect(() => {
        if (customerGroupData && customerGroupData.content) {
            const selectList: SelectOption[] = customerGroupData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setCustomerGroupSelectList(selectList);
        }
    }, [customerGroupData]);

    // Xử lý dữ liệu customer status khi fetch thành công
    useEffect(() => {
        if (customerStatusData && customerStatusData.content) {
            const selectList: SelectOption[] = customerStatusData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setCustomerStatusSelectList(selectList);
        }
    }, [customerStatusData]);

    // Xử lý dữ liệu customer resources khi fetch thành công
    useEffect(() => {
        if (customerResourceData && customerResourceData.content) {
            const selectList: SelectOption[] = customerResourceData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setCustomerResourceSelectList(selectList);
        }
    }, [customerResourceData]);

    const handleProvinceChange = (provinceId: string | null) => {
        form.setFieldValue("user.address.provinceId", provinceId);
        form.setFieldValue("user.address.districtId", null);
    };

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: CustomerRequest = {
            user: {
                username: formValues["user.username"],
                password: formValues["user.password"],
                fullname: formValues["user.fullname"],
                email: formValues["user.email"],
                phone: formValues["user.phone"],
                gender: formValues["user.gender"],
                address: {
                    line: formValues["user.address.line"],
                    provinceId: Number(formValues["user.address.provinceId"]),
                    districtId: Number(formValues["user.address.districtId"]),
                    wardId: null,
                },
                avatar: formValues["user.avatar"].trim() || null,
                status: Number(formValues["user.status"]),
                roles: [{ id: CustomerConfigs.CUSTOMER_ROLE_ID }],
            },
            customerGroupId: Number(formValues.customerGroupId),
            customerStatusId: Number(formValues.customerStatusId),
            customerResourceId: Number(formValues.customerResourceId),
        };
        createApi.mutate(requestBody);
    });

    const handleReset = () => {
        form.reset();
    };

    const userGenderSelectList: SelectOption[] = [
        {
            value: "M",
            label: "Nam",
        },
        {
            value: "F",
            label: "Nữ",
        },
    ];

    const userStatusSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Đã kích hoạt",
        },
        {
            value: "2",
            label: "Chưa kích hoạt",
        },
    ];

    const userRoleSelectList: SelectOption[] = [
        {
            value: String(CustomerConfigs.CUSTOMER_ROLE_ID),
            label: "Khách hàng",
        },
    ];

    return {
        form,
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
        createStatus: createApi.status,
    };
}

export default useCustomerCreateViewModel;
