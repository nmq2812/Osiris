import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { CustomerResourceResponse } from "@/models/CustomerResource";
import {
    OrderResourceResponse,
    OrderResourceRequest,
} from "@/models/OrderResource";
import MiscUtils from "@/utils/MiscUtils";
import CustomerResourceConfigs from "../../customer/resource/CustomerResourceConfigs";
import OrderResourceConfigs from "./OrderResourceConfigs";

function useOrderResourceUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: OrderResourceConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(OrderResourceConfigs.createUpdateFormSchema),
    });

    const [orderResource, setOrderResource] = useState<OrderResourceResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [customerResourceSelectList, setCustomerResourceSelectList] =
        useState<SelectOption[]>([]);

    const updateApi = useUpdateApi<OrderResourceRequest, OrderResourceResponse>(
        OrderResourceConfigs.resourceUrl,
        OrderResourceConfigs.resourceKey,
        id,
    );

    const { data: orderResourceResponse } =
        useGetByIdApi<OrderResourceResponse>(
            OrderResourceConfigs.resourceUrl,
            OrderResourceConfigs.resourceKey,
            id,
        );

    const { data: customerResourceListResponse } =
        useGetAllApi<CustomerResourceResponse>(
            CustomerResourceConfigs.resourceUrl,
            CustomerResourceConfigs.resourceKey,
            { all: 1 },
        );

    useEffect(() => {
        if (orderResourceResponse) {
            setOrderResource(orderResourceResponse);
            const formValues: typeof form.values = {
                code: orderResourceResponse.code,
                name: orderResourceResponse.name,
                color: orderResourceResponse.color,
                customerResourceId: orderResourceResponse.customerResource
                    ? String(orderResourceResponse.customerResource.id)
                    : null,
                status: String(orderResourceResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        }
    }, [orderResourceResponse, form]);

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
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: OrderResourceRequest = {
                code: formValues.code,
                name: formValues.name,
                color: formValues.color,
                customerResourceId:
                    Number(formValues.customerResourceId) || null,
                status: Number(formValues.status),
            };
            updateApi.mutate(requestBody);
        }
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
        orderResource,
        form,
        handleFormSubmit,
        customerResourceSelectList,
        statusSelectList,
    };
}

export default useOrderResourceUpdateViewModel;
