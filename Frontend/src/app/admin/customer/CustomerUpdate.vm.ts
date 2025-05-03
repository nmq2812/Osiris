import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { DistrictSelectOption, SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { CustomerResponse, CustomerRequest } from "@/models/Customer";
import { CustomerGroupResponse } from "@/models/CustomerGroup";
import { CustomerResourceResponse } from "@/models/CustomerResource";
import { CustomerStatusResponse } from "@/models/CustomerStatus";
import { DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import MiscUtils from "@/utils/MiscUtils";
import DistrictConfigs from "../address/district/DistrictConfigs";
import ProvinceConfigs from "../address/province/ProvinceConfigs";
import CustomerGroupConfigs from "./customer-group/CustomerGroupConfigs";
import CustomerResourceConfigs from "./resource/CustomerResourceConfigs";
import CustomerStatusConfigs from "./status/CustomerStatusConfigs";
import CustomerConfigs from "./CustomerConfigs";

function useCustomerUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: CustomerConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CustomerConfigs.createUpdateFormSchema),
    });

    const [customer, setCustomer] = useState<CustomerResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
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

    const updateApi = useUpdateApi<CustomerRequest, CustomerResponse>(
        CustomerConfigs.resourceUrl,
        CustomerConfigs.resourceKey,
        id,
    );

    // Lấy thông tin customer theo ID
    const { data: customerData } = useGetByIdApi<CustomerResponse>(
        CustomerConfigs.resourceUrl,
        CustomerConfigs.resourceKey,
        id,
        undefined,
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`customer-${id}`],
        },
    );

    // Xử lý dữ liệu customer khi fetch thành công
    useEffect(() => {
        if (customerData) {
            setCustomer(customerData);
            const formValues: typeof form.values = {
                "user.username": customerData.user.username,
                "user.password": "",
                "user.fullname": customerData.user.fullname,
                "user.email": customerData.user.email,
                "user.phone": customerData.user.phone,
                "user.gender": customerData.user.gender,
                "user.address.line": customerData.user.address.line || "",
                "user.address.provinceId": customerData.user.address.province
                    ? String(customerData.user.address.province.id)
                    : null,
                "user.address.districtId": customerData.user.address.district
                    ? String(customerData.user.address.district.id)
                    : null,
                "user.avatar": customerData.user.avatar || "",
                "user.status": String(customerData.user.status),
                "user.roles": [String(CustomerConfigs.CUSTOMER_ROLE_ID)],
                customerGroupId: String(customerData.customerGroup.id),
                customerStatusId: String(customerData.customerStatus.id),
                customerResourceId: String(customerData.customerResource.id),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        }
    }, [customerData, form]);

    // Lấy dữ liệu province
    const { data: provinceData } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 300000,
            queryKey: ["provinces-all"],
        },
    );

    // Xử lý dữ liệu province khi fetch thành công
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

    // Xử lý dữ liệu district khi fetch thành công
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

    // Xử lý dữ liệu customer group khi fetch thành công
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

    // Xử lý dữ liệu customer resource khi fetch thành công
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

    // Handle province change
    const handleProvinceChange = (provinceId: string | null) => {
        form.setFieldValue("user.address.provinceId", provinceId);
        form.setFieldValue("user.address.districtId", null);
    };

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: CustomerRequest = {
                user: {
                    username: formValues["user.username"],
                    password: formValues["user.password"] || null,
                    fullname: formValues["user.fullname"],
                    email: formValues["user.email"],
                    phone: formValues["user.phone"],
                    gender: formValues["user.gender"],
                    address: {
                        line: formValues["user.address.line"],
                        provinceId: Number(
                            formValues["user.address.provinceId"],
                        ),
                        districtId: Number(
                            formValues["user.address.districtId"],
                        ),
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
            updateApi.mutate(requestBody);
        }
    });

    const handleReset = () => {
        if (prevFormValues) {
            form.setValues(prevFormValues);
        }
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

    const isSubmitDisabled = MiscUtils.isEquals(form.values, prevFormValues);

    return {
        customer,
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
        isSubmitDisabled,
        updateStatus: updateApi.status,
    };
}

export default useCustomerUpdateViewModel;
