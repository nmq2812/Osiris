import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { CustomerResourceResponse } from "@/models/CustomerResource";
import {
    OrderResourceRequest,
    OrderResourceResponse,
} from "@/models/OrderResource";
import { useForm, zodResolver } from "@mantine/form";
import { useState, useEffect } from "react";
import CustomerResourceConfigs from "../../customer/resource/CustomerResourceConfigs";
import OrderResourceConfigs from "./OrderResourceConfigs";

function useOrderResourceCreateViewModel() {
    const form = useForm({
        initialValues: OrderResourceConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(OrderResourceConfigs.createUpdateFormSchema),
    });

    const [customerResourceSelectList, setCustomerResourceSelectList] =
        useState<SelectOption[]>([]);

    const createApi = useCreateApi<OrderResourceRequest, OrderResourceResponse>(
        OrderResourceConfigs.resourceUrl,
    );

    const { data: customerResourceListResponse } =
        useGetAllApi<CustomerResourceResponse>(
            CustomerResourceConfigs.resourceUrl,
            CustomerResourceConfigs.resourceKey,
            { all: 1 },
        );

    useEffect(() => {
        if (customerResourceListResponse?.content) {
            const selectList: SelectOption[] =
                customerResourceListResponse.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                }));
            setCustomerResourceSelectList(selectList);
        }
    }, [customerResourceListResponse]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: OrderResourceRequest = {
            code: formValues.code,
            name: formValues.name,
            color: formValues.color,
            customerResourceId: Number(formValues.customerResourceId) || null,
            status: Number(formValues.status),
        };
        createApi.mutate(requestBody);
    });

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

    return {
        form,
        handleFormSubmit,
        customerResourceSelectList,
        statusSelectList,
    };
}

export default useOrderResourceCreateViewModel;
