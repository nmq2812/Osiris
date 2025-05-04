import { useForm, zodResolver } from "@mantine/form";
import { useState, useEffect } from "react";
import PurchaseOrderConfigs from "@/app/admin/inventory/purchase-order/PurchaseOrderConfigs";
import {
    PurchaseOrderRequest,
    PurchaseOrderResponse,
} from "@/models/PurchaseOrder";
import useCreateApi from "@/hooks/use-create-api";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import { SupplierResponse } from "@/models/Supplier";

import { VariantResponse } from "@/models/Variant";
import { PurchaseOrderVariantRequest } from "@/models/PurchaseOrderVariant";
import { produce } from "immer";
import { DestinationResponse } from "@/models/Destination";
import SupplierConfigs from "../../product/supplier/SupplierConfigs";
import DestinationConfigs from "../destination/DestinationConfigs";

function usePurchaseOrderCreateViewModel() {
    const form = useForm({
        initialValues: PurchaseOrderConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(PurchaseOrderConfigs.createUpdateFormSchema),
    });

    const [supplierSelectList, setSupplierSelectList] = useState<
        SelectOption[]
    >([]);
    const [destinationSelectList, setDestinationSelectList] = useState<
        SelectOption[]
    >([]);
    const [variants, setVariants] = useState<VariantResponse[]>([]);

    const createApi = useCreateApi<PurchaseOrderRequest, PurchaseOrderResponse>(
        PurchaseOrderConfigs.resourceUrl,
    );

    // Lấy danh sách nhà cung cấp - sử dụng destructuring thay vì callback
    const { data: supplierListResponse } = useGetAllApi<SupplierResponse>(
        SupplierConfigs.resourceUrl,
        SupplierConfigs.resourceKey,
        { all: 1 },
        undefined, // Bỏ callback
    );

    // Lấy danh sách điểm đến - sử dụng destructuring thay vì callback
    const { data: destinationListResponse } = useGetAllApi<DestinationResponse>(
        DestinationConfigs.resourceUrl,
        DestinationConfigs.resourceKey,
        { all: 1 },
        undefined, // Bỏ callback
    );

    // Xử lý dữ liệu nhà cung cấp khi có thay đổi
    useEffect(() => {
        if (supplierListResponse && supplierListResponse.content) {
            const selectList: SelectOption[] = supplierListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.displayName,
                }),
            );
            setSupplierSelectList(selectList);
        }
    }, [supplierListResponse]);

    // Xử lý dữ liệu điểm đến khi có thay đổi
    useEffect(() => {
        if (destinationListResponse && destinationListResponse.content) {
            const selectList: SelectOption[] =
                destinationListResponse.content.map((item) => ({
                    value: String(item.id),
                    label: [
                        item.address.line,
                        item.address.district?.name,
                        item.address.province?.name,
                    ]
                        .filter(Boolean)
                        .join(", "),
                }));
            setDestinationSelectList(selectList);
        }
    }, [destinationListResponse]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: PurchaseOrderRequest = {
            code: formValues.code,
            supplierId: Number(formValues.supplierId),
            purchaseOrderVariants: formValues.purchaseOrderVariants,
            destinationId: Number(formValues.destinationId),
            totalAmount: formValues.totalAmount,
            note: formValues.note || null,
            status: Number(formValues.status),
        };
        createApi.mutate(requestBody);
    });

    const calculateTotalAmount = (
        purchaseOrderVariantRequests: PurchaseOrderVariantRequest[],
    ) =>
        purchaseOrderVariantRequests
            .map((item) => item.amount)
            .reduce((a, b) => a + b, 0);

    const handleClickVariantResultItem = (variant: VariantResponse) => {
        setTimeout(() => {
            const purchaseOrderVariantRequest: PurchaseOrderVariantRequest = {
                variantId: variant.id,
                cost: variant.cost,
                quantity: 1,
                amount: variant.cost,
            };
            const currentPurchaseOrderVariantRequests = [
                ...form.values.purchaseOrderVariants,
                purchaseOrderVariantRequest,
            ];
            form.setFieldValue(
                "purchaseOrderVariants",
                currentPurchaseOrderVariantRequests,
            );
            form.setFieldValue(
                "totalAmount",
                calculateTotalAmount(currentPurchaseOrderVariantRequests),
            );
            setVariants((variants) => [...variants, variant]);
        }, 100);
    };

    const handleQuantityInput = (quantity: number, index: number) => {
        const currentPurchaseOrderVariantRequests = produce(
            form.values.purchaseOrderVariants,
            (draft: any[]) => {
                const variant = draft[index];
                variant.quantity = quantity;
                variant.amount = variant.cost * quantity;
            },
        );
        form.setFieldValue(
            "purchaseOrderVariants",
            currentPurchaseOrderVariantRequests,
        );
        form.setFieldValue(
            "totalAmount",
            calculateTotalAmount(currentPurchaseOrderVariantRequests),
        );
    };

    const handleDeleteVariantButton = (index: number) => {
        const currentPurchaseOrderVariantRequests =
            form.values.purchaseOrderVariants.filter((_, i) => i !== index);
        form.setFieldValue(
            "purchaseOrderVariants",
            currentPurchaseOrderVariantRequests,
        );
        form.setFieldValue(
            "totalAmount",
            calculateTotalAmount(currentPurchaseOrderVariantRequests),
        );
        setVariants((variants) => variants.filter((_, i) => i !== index));
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
            label: "Đang chờ duyệt",
        },
        {
            value: "3",
            label: "Đã duyệt",
        },
        {
            value: "4",
            label: "Đang xử lý",
        },
        {
            value: "5",
            label: "Hoàn thành",
        },
        {
            value: "6",
            label: "Không duyệt",
        },
        {
            value: "7",
            label: "Hủy bỏ",
        },
    ];

    return {
        form,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleQuantityInput,
        handleDeleteVariantButton,
        resetForm,
        supplierSelectList,
        destinationSelectList,
        statusSelectList,
        variants,
        isSubmitting: createApi.status === "pending",
    };
}

export default usePurchaseOrderCreateViewModel;
