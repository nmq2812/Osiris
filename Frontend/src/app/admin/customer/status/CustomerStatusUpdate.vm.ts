import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import {
    CustomerStatusRequest,
    CustomerStatusResponse,
} from "@/models/CustomerStatus";
import CustomerStatusConfigs from "./CustomerStatusConfigs";

function useCustomerStatusUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: CustomerStatusConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CustomerStatusConfigs.createUpdateFormSchema),
    });

    const [customerStatus, setCustomerStatus] =
        useState<CustomerStatusResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<
        CustomerStatusRequest,
        CustomerStatusResponse
    >(CustomerStatusConfigs.resourceUrl, CustomerStatusConfigs.resourceKey, id);

    // Lấy dữ liệu trạng thái khách hàng theo ID
    const { data: customerStatusData, isLoading } =
        useGetByIdApi<CustomerStatusResponse>(
            CustomerStatusConfigs.resourceUrl,
            CustomerStatusConfigs.resourceKey,
            id,
            undefined,
            {
                enabled: id > 0,
                refetchOnWindowFocus: false,
                staleTime: 30000,
                queryKey: [`customer-status-${id}`],
            },
        );

    // Xử lý dữ liệu khi fetch thành công
    useEffect(() => {
        if (customerStatusData) {
            setCustomerStatus(customerStatusData);
            const formValues: typeof form.values = {
                code: customerStatusData.code,
                name: customerStatusData.name,
                description: customerStatusData.description,
                color: customerStatusData.color,
                status: String(customerStatusData.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        }
    }, [customerStatusData, form]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: CustomerStatusRequest = {
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
        customerStatus,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isSubmitDisabled,
        updateStatus: updateApi.status,
        isLoading, // Thêm isLoading vào đây
    };
}

export default useCustomerStatusUpdateViewModel;
