import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import {
    CustomerResourceRequest,
    CustomerResourceResponse,
} from "@/models/CustomerResource";
import CustomerResourceConfigs from "./CustomerResourceConfigs";

function useCustomerResourceUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: CustomerResourceConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CustomerResourceConfigs.createUpdateFormSchema),
    });

    const [customerResource, setCustomerResource] =
        useState<CustomerResourceResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<
        CustomerResourceRequest,
        CustomerResourceResponse
    >(
        CustomerResourceConfigs.resourceUrl,
        CustomerResourceConfigs.resourceKey,
        id,
    );

    // Lấy dữ liệu nguồn khách hàng theo ID
    const { data: customerResourceData } =
        useGetByIdApi<CustomerResourceResponse>(
            CustomerResourceConfigs.resourceUrl,
            CustomerResourceConfigs.resourceKey,
            id,
            undefined,
            {
                enabled: id > 0,
                refetchOnWindowFocus: false,
                staleTime: 30000,
                queryKey: [`customer-resource-${id}`],
            },
        );

    // Xử lý dữ liệu khi fetch thành công
    useEffect(() => {
        if (customerResourceData) {
            setCustomerResource(customerResourceData);
            const formValues: typeof form.values = {
                code: customerResourceData.code,
                name: customerResourceData.name,
                description: customerResourceData.description,
                color: customerResourceData.color,
                status: String(customerResourceData.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        }
    }, [customerResourceData, form]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: CustomerResourceRequest = {
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
        customerResource,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isSubmitDisabled,
        updateStatus: updateApi.status,
    };
}

export default useCustomerResourceUpdateViewModel;
