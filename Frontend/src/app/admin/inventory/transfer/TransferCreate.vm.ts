import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { DocketVariantRequest } from "@/models/DocketVariant";
import { TransferRequest, TransferResponse } from "@/models/Transfer";
import { VariantResponse } from "@/models/Variant";
import { WarehouseResponse } from "@/models/Warehouse";
import { useForm, zodResolver } from "@mantine/form";

import { produce } from "immer";
import { useState, useEffect } from "react";
import WarehouseConfigs from "../warehouse/WarehouseConfigs";
import TransferConfigs from "./TransferConfigs";

function useTransferCreateViewModel() {
    const form = useForm({
        initialValues: TransferConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(TransferConfigs.createUpdateFormSchema),
    });

    const [warehouseSelectList, setWarehouseSelectList] = useState<
        SelectOption[]
    >([]);
    const [variants, setVariants] = useState<VariantResponse[]>([]);

    const createApi = useCreateApi<TransferRequest, TransferResponse>(
        TransferConfigs.resourceUrl,
    );

    const { data: warehouseListResponse } = useGetAllApi<WarehouseResponse>(
        WarehouseConfigs.resourceUrl,
        WarehouseConfigs.resourceKey,
        { sort: "id,asc", all: 1 },
    );

    useEffect(() => {
        if (warehouseListResponse?.content) {
            const selectList: SelectOption[] =
                warehouseListResponse.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                }));
            setWarehouseSelectList(selectList);
        }
    }, [warehouseListResponse]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: TransferRequest = {
            code: formValues.code.trim(),
            exportDocket: {
                type: 2,
                code: "EX-" + formValues.code.trim(),
                reasonId: 2,
                warehouseId: Number(formValues["exportDocket.warehouseId"]),
                docketVariants: formValues.docketVariants,
                purchaseOrderId: null,
                orderId: null,
                note: null,
                status: 1,
            },
            importDocket: {
                type: 1,
                code: "IM-" + formValues.code.trim(),
                reasonId: 1,
                warehouseId: Number(formValues["importDocket.warehouseId"]),
                docketVariants: formValues.docketVariants,
                purchaseOrderId: null,
                orderId: null,
                note: null,
                status: 1,
            },
            note: formValues.note || null,
        };
        createApi.mutate(requestBody);
    });

    const handleClickVariantResultItem = (variant: VariantResponse) => {
        setTimeout(() => {
            const docketVariantRequest: DocketVariantRequest = {
                variantId: variant.id,
                quantity: 1,
            };
            const currentDocketVariantRequests = [
                ...form.values.docketVariants,
                docketVariantRequest,
            ];
            form.setFieldValue("docketVariants", currentDocketVariantRequests);
            setVariants((variants) => [...variants, variant]);
        }, 100);
    };

    const handleQuantityInput = (quantity: number, index: number) => {
        const currentDocketVariantRequests = produce(
            form.values.docketVariants,
            (draft) => {
                const variant = draft[index];
                variant.quantity = quantity;
            },
        );
        form.setFieldValue("docketVariants", currentDocketVariantRequests);
    };

    const handleDeleteVariantButton = (index: number) => {
        const currentDocketVariantRequests = form.values.docketVariants.filter(
            (_, i) => i !== index,
        );
        form.setFieldValue("docketVariants", currentDocketVariantRequests);
        setVariants((variants) => variants.filter((_, i) => i !== index));
    };

    const handleWarehouseSelectList = (
        value: string | null,
        type: "export" | "import",
    ) => {
        const formKey =
            type === "export"
                ? "exportDocket.warehouseId"
                : "importDocket.warehouseId";
        form.setFieldValue(formKey, value);
        setWarehouseSelectList(
            warehouseSelectList.map((option) => {
                if (
                    option.disabled === true &&
                    option.value === form.values[formKey]
                ) {
                    return { ...option, disabled: false };
                }
                if (option.value === value) {
                    return { ...option, disabled: true };
                }
                return option;
            }),
        );
    };

    const resetForm = () => {
        form.reset();
        setVariants([]);
        setWarehouseSelectList(
            warehouseSelectList.map((option) => ({
                ...option,
                disabled: false,
            })),
        );
    };

    return {
        form,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleQuantityInput,
        handleDeleteVariantButton,
        handleWarehouseSelectList,
        resetForm,
        warehouseSelectList,
        variants,
    };
}

export default useTransferCreateViewModel;
