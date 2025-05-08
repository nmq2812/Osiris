import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import {
    CustomerGroupRequest,
    CustomerGroupResponse,
} from "@/models/CustomerGroup";
import CustomerGroupConfigs from "./CustomerGroupConfigs";

function useCustomerGroupUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: CustomerGroupConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CustomerGroupConfigs.createUpdateFormSchema),
    });

    const [customerGroup, setCustomerGroup] = useState<CustomerGroupResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<CustomerGroupRequest, CustomerGroupResponse>(
        CustomerGroupConfigs.resourceUrl,
        CustomerGroupConfigs.resourceKey,
        id,
    );

    // Lấy thông tin customer group theo ID
    const { data: customerGroupData } = useGetByIdApi<CustomerGroupResponse>(
        CustomerGroupConfigs.resourceUrl,
        CustomerGroupConfigs.resourceKey,
        id,
        undefined,
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`customer-group-${id}`],
        },
    );

    // Xử lý dữ liệu customer group khi fetch thành công
    useEffect(() => {
        if (customerGroupData) {
            setCustomerGroup(customerGroupData);
            const formValues: typeof form.values = {
                code: customerGroupData.code,
                name: customerGroupData.name,
                description: customerGroupData.description,
                color: customerGroupData.color,
                status: String(customerGroupData.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        }
    }, [customerGroupData, form]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: CustomerGroupRequest = {
                code: formValues.code,
                name: formValues.name,
                description: formValues.description,
                color: formValues.color,
                status: Number(formValues.status),
            };
            updateApi.mutate(requestBody);
        }
    });

    const handleReset = () => {
        if (prevFormValues) {
            form.setValues(prevFormValues);
        }
    };

    const statusSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Có hiệu lực",
        },
        {
            value: "2",
            label: "Vô hiệu lực",
        },
    ];

    const isSubmitDisabled = MiscUtils.isEquals(form.values, prevFormValues);

    return {
        customerGroup,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isSubmitDisabled,
        updateStatus: updateApi.status,
    };
}

export default useCustomerGroupUpdateViewModel;
