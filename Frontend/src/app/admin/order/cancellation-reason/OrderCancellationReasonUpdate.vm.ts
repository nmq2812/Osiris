import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import {
    OrderCancellationReasonResponse,
    OrderCancellationReasonRequest,
} from "@/models/OrderCancellationReason";
import MiscUtils from "@/utils/MiscUtils";
import OrderCancellationReasonConfigs from "./OrderCancellationReasonConfigs";

function useOrderCancellationReasonUpdateViewModel(id: number) {
    const form = useForm({
        initialValues:
            OrderCancellationReasonConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(
            OrderCancellationReasonConfigs.createUpdateFormSchema,
        ),
    });

    const [orderCancellationReason, setOrderCancellationReason] =
        useState<OrderCancellationReasonResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<
        OrderCancellationReasonRequest,
        OrderCancellationReasonResponse
    >(
        OrderCancellationReasonConfigs.resourceUrl,
        OrderCancellationReasonConfigs.resourceKey,
        id,
    );

    const { data: orderCancellationReasonResponse } =
        useGetByIdApi<OrderCancellationReasonResponse>(
            OrderCancellationReasonConfigs.resourceUrl,
            OrderCancellationReasonConfigs.resourceKey,
            id,
        );

    useEffect(() => {
        if (orderCancellationReasonResponse) {
            setOrderCancellationReason(orderCancellationReasonResponse);
            const formValues: typeof form.values = {
                name: orderCancellationReasonResponse.name,
                note: orderCancellationReasonResponse.note || "",
                status: String(orderCancellationReasonResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        }
    }, [orderCancellationReasonResponse, form]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: OrderCancellationReasonRequest = {
                name: formValues.name,
                note: formValues.note || null,
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
        orderCancellationReason,
        form,
        handleFormSubmit,
        statusSelectList,
    };
}

export default useOrderCancellationReasonUpdateViewModel;
