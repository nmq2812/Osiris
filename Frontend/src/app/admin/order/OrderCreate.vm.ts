import { useForm, zodResolver } from "@mantine/form";
import { useState, useEffect } from "react";
import { produce } from "immer";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { OrderRequest, OrderResponse } from "@/models/Order";
import { OrderCancellationReasonResponse } from "@/models/OrderCancellationReason";
import { OrderResourceResponse } from "@/models/OrderResource";
import { OrderVariantRequest } from "@/models/OrderVariant";
import { PaymentMethodResponse } from "@/models/PaymentMethod";
import { VariantResponse } from "@/models/Variant";
import OrderConfigs from "./OrderConfigs";
import OrderResourceConfigs from "./resource/OrderResourceConfigs";
import OrderCancellationReasonConfigs from "./cancellation-reason/OrderCancellationReasonConfigs";
import PaymentMethodConfigs from "../payment-method/PaymentMethodConfigs";

function useOrderCreateViewModel() {
    const form = useForm({
        initialValues: OrderConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(OrderConfigs.createUpdateFormSchema),
    });

    const [orderResourceSelectList, setOrderResourceSelectList] = useState<
        SelectOption[]
    >([]);
    const [
        orderCancellationReasonSelectList,
        setOrderCancellationReasonSelectList,
    ] = useState<SelectOption[]>([]);
    const [paymentMethodSelectList, setPaymentMethodSelectList] = useState<
        SelectOption[]
    >([]);

    const [variants, setVariants] = useState<VariantResponse[]>([]);

    const createApi = useCreateApi<OrderRequest, OrderResponse>(
        OrderConfigs.resourceUrl,
    );

    const { data: orderResourceListResponse } =
        useGetAllApi<OrderResourceResponse>(
            OrderResourceConfigs.resourceUrl,
            OrderResourceConfigs.resourceKey,
            { sort: "id,asc", all: 1 },
        );

    const { data: orderCancellationReasonListResponse } =
        useGetAllApi<OrderCancellationReasonResponse>(
            OrderCancellationReasonConfigs.resourceUrl,
            OrderCancellationReasonConfigs.resourceKey,
            { sort: "id,asc", all: 1 },
        );

    const { data: paymentMethodListResponse } =
        useGetAllApi<PaymentMethodResponse>(
            PaymentMethodConfigs.resourceUrl,
            PaymentMethodConfigs.resourceKey,
            { sort: "id,asc", all: 1 },
        );

    useEffect(() => {
        if (orderResourceListResponse?.content) {
            const selectList: SelectOption[] =
                orderResourceListResponse.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                }));
            setOrderResourceSelectList(selectList);
        }
    }, [orderResourceListResponse]);

    useEffect(() => {
        if (orderCancellationReasonListResponse?.content) {
            const selectList: SelectOption[] =
                orderCancellationReasonListResponse.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                }));
            setOrderCancellationReasonSelectList(selectList);
        }
    }, [orderCancellationReasonListResponse]);

    useEffect(() => {
        if (paymentMethodListResponse?.content) {
            const selectList: SelectOption[] =
                paymentMethodListResponse.content.map((item) => ({
                    value: item.code,
                    label: item.name,
                }));
            setPaymentMethodSelectList(selectList);
        }
    }, [paymentMethodListResponse]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: OrderRequest = {
            code: formValues.code,
            status: Number(formValues.status),
            toName: formValues.toName,
            toPhone: formValues.toPhone,
            toAddress: formValues.toAddress,
            toWardName: formValues.toWardName,
            toDistrictName: formValues.toDistrictName,
            toProvinceName: formValues.toProvinceName,
            orderResourceId: Number(formValues.orderResourceId),
            orderCancellationReasonId:
                Number(formValues.orderCancellationReasonId) || null,
            note: formValues.note || null,
            userId: Number(formValues.userId),
            orderVariants: formValues.orderVariants,
            totalAmount: formValues.totalAmount,
            tax: formValues.tax,
            shippingCost: formValues.shippingCost,
            totalPay: formValues.totalPay,
            paymentMethodType: formValues.paymentMethodType,
            paymentStatus: Number(formValues.paymentStatus),
        };
        createApi.mutate(requestBody);
    });

    const calculateTotalAmount = (
        orderVariantRequests: OrderVariantRequest[],
    ) =>
        orderVariantRequests
            .map((item) => item.amount)
            .reduce((a, b) => a + b, 0);

    const calculateTotalPayByTotalAmount = (totalAmount: number) => {
        return Number(
            (
                totalAmount +
                totalAmount * form.values.tax +
                form.values.shippingCost
            ).toFixed(0),
        );
    };

    const calculateTotalPayByShippingCost = (shippingCost: number) => {
        return Number(
            (
                form.values.totalAmount +
                form.values.totalAmount * form.values.tax +
                shippingCost
            ).toFixed(0),
        );
    };

    const handleClickVariantResultItem = (variant: VariantResponse) => {
        setTimeout(() => {
            const orderVariantRequest: OrderVariantRequest = {
                variantId: variant.id,
                price: variant.price,
                quantity: 1,
                amount: variant.price,
            };
            const currentOrderVariantRequests = [
                ...form.values.orderVariants,
                orderVariantRequest,
            ];
            form.setFieldValue("orderVariants", currentOrderVariantRequests);
            const totalAmount = calculateTotalAmount(
                currentOrderVariantRequests,
            );
            form.setFieldValue("totalAmount", totalAmount);
            form.setFieldValue(
                "totalPay",
                calculateTotalPayByTotalAmount(totalAmount),
            );
            setVariants((variants) => [...variants, variant]);
        }, 100);
    };

    const handleQuantityInput = (quantity: number, index: number) => {
        const currentOrderVariantRequests = produce(
            form.values.orderVariants,
            (draft) => {
                const variant = draft[index];
                variant.quantity = quantity;
                variant.amount = variant.price * quantity;
            },
        );
        form.setFieldValue("orderVariants", currentOrderVariantRequests);
        const totalAmount = calculateTotalAmount(currentOrderVariantRequests);
        form.setFieldValue("totalAmount", totalAmount);
        form.setFieldValue(
            "totalPay",
            calculateTotalPayByTotalAmount(totalAmount),
        );
    };

    const handleDeleteVariantButton = (index: number) => {
        const currentOrderVariantRequests = form.values.orderVariants.filter(
            (_, i) => i !== index,
        );
        form.setFieldValue("orderVariants", currentOrderVariantRequests);
        const totalAmount = calculateTotalAmount(currentOrderVariantRequests);
        form.setFieldValue("totalAmount", totalAmount);
        form.setFieldValue(
            "totalPay",
            calculateTotalPayByTotalAmount(totalAmount),
        );
        setVariants((variants) => variants.filter((_, i) => i !== index));
    };

    const handleShippingCostInput = (value: number) => {
        form.setFieldValue("shippingCost", value);
        form.setFieldValue("totalPay", calculateTotalPayByShippingCost(value));
    };

    const resetForm = () => {
        form.reset();
        setVariants([]);
    };

    const statusSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Đơn hàng mới",
        },
        {
            value: "2",
            label: "Đang xử lý",
        },
        {
            value: "3",
            label: "Đang giao hàng",
        },
        {
            value: "4",
            label: "Đã giao hàng",
        },
        {
            value: "5",
            label: "Hủy bỏ",
        },
    ];

    const paymentStatusSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Chưa thanh toán",
        },
        {
            value: "2",
            label: "Đã thanh toán",
        },
    ];

    return {
        form,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleQuantityInput,
        handleDeleteVariantButton,
        handleShippingCostInput,
        resetForm,
        orderResourceSelectList,
        orderCancellationReasonSelectList,
        paymentMethodSelectList,
        statusSelectList,
        paymentStatusSelectList,
        variants,
    };
}

export default useOrderCreateViewModel;
