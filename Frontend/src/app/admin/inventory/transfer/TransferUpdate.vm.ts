import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";

import { produce } from "immer";
import ResourceURL from "@/constants/ResourceURL";
import { SelectOption } from "@/datas/SelectOption";
import useDeleteByIdsApi from "@/hooks/use-delete-by-ids-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import {
    DocketVariantKeyRequest,
    DocketVariantRequest,
} from "@/models/DocketVariant";
import { TransferResponse, TransferRequest } from "@/models/Transfer";
import { VariantResponse } from "@/models/Variant";
import { WarehouseResponse } from "@/models/Warehouse";
import MiscUtils from "@/utils/MiscUtils";
import WarehouseConfigs from "../warehouse/WarehouseConfigs";
import TransferConfigs from "./TransferConfigs";

function useTransferUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: TransferConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(TransferConfigs.createUpdateFormSchema),
    });

    const [transfer, setTransfer] = useState<TransferResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [warehouseSelectList, setWarehouseSelectList] = useState<
        SelectOption[]
    >([]);
    const [variants, setVariants] = useState<VariantResponse[]>([]);

    const updateApi = useUpdateApi<TransferRequest, TransferResponse>(
        TransferConfigs.resourceUrl,
        TransferConfigs.resourceKey,
        id,
    );

    const { data: transferResponse } = useGetByIdApi<TransferResponse>(
        TransferConfigs.resourceUrl,
        TransferConfigs.resourceKey,
        id,
    );

    const { data: warehouseListResponse } = useGetAllApi<WarehouseResponse>(
        WarehouseConfigs.resourceUrl,
        WarehouseConfigs.resourceKey,
        { sort: "id,asc", all: 1 },
    );

    useEffect(() => {
        if (transferResponse) {
            setTransfer(transferResponse);

            const formValues: typeof form.values = {
                code: transferResponse.code,
                "exportDocket.warehouseId": String(
                    transferResponse.exportDocket.warehouse.id,
                ),
                "importDocket.warehouseId": String(
                    transferResponse.importDocket.warehouse.id,
                ),
                docketVariants:
                    transferResponse.exportDocket.docketVariants.map(
                        (docketVariantResponse) => ({
                            variantId: docketVariantResponse.variant.id,
                            quantity: docketVariantResponse.quantity,
                        }),
                    ),
                note: transferResponse.note || "",
            };

            form.setValues(formValues);
            setPrevFormValues(formValues);
            setVariants(
                transferResponse.exportDocket.docketVariants.map(
                    (docketVariant) => docketVariant.variant,
                ),
            );
        }
    }, [transferResponse, form]);

    useEffect(() => {
        if (warehouseListResponse?.content && transfer) {
            const selectedWarehouseIds = [
                transfer.exportDocket.warehouse.id,
                transfer.importDocket.warehouse.id,
            ];

            const selectList: SelectOption[] =
                warehouseListResponse.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                    disabled: selectedWarehouseIds.includes(item.id),
                }));

            setWarehouseSelectList(selectList);
        } else if (warehouseListResponse?.content) {
            const selectList: SelectOption[] =
                warehouseListResponse.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                }));

            setWarehouseSelectList(selectList);
        }
    }, [warehouseListResponse, transfer]);

    const deleteByIdsApi = useDeleteByIdsApi<DocketVariantKeyRequest>(
        ResourceURL.DOCKET_VARIANT,
        "docket-variants",
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (
            transfer &&
            prevFormValues &&
            !MiscUtils.isEquals(formValues, prevFormValues)
        ) {
            const requestBody: TransferRequest = {
                code: formValues.code.trim(),
                exportDocket: {
                    type: transfer.exportDocket.type,
                    code: "EX-" + formValues.code.trim(),
                    reasonId: transfer.exportDocket.reason.id,
                    warehouseId: Number(formValues["exportDocket.warehouseId"]),
                    docketVariants: formValues.docketVariants,
                    purchaseOrderId: null,
                    orderId: null,
                    note: transfer.exportDocket.note,
                    status: transfer.exportDocket.status,
                },
                importDocket: {
                    type: transfer.importDocket.type,
                    code: "IM-" + formValues.code.trim(),
                    reasonId: transfer.importDocket.reason.id,
                    warehouseId: Number(formValues["importDocket.warehouseId"]),
                    docketVariants: formValues.docketVariants,
                    purchaseOrderId: null,
                    orderId: null,
                    note: transfer.importDocket.note,
                    status: transfer.importDocket.status,
                },
                note: formValues.note || null,
            };
            updateApi.mutate(requestBody);

            const docketIds = [
                transfer.exportDocket.id,
                transfer.importDocket.id,
            ];

            const deletedDocketVariantKeyRequests: DocketVariantKeyRequest[] =
                prevFormValues.docketVariants
                    .map(
                        (docketVariantRequest) =>
                            docketVariantRequest.variantId,
                    )
                    .filter(
                        (variantId) =>
                            !formValues.docketVariants
                                .map((item) => item.variantId)
                                .includes(variantId),
                    )
                    .flatMap((variantId) =>
                        docketIds.map((docketId) => ({
                            docketId: docketId,
                            variantId: variantId,
                        })),
                    );

            if (deletedDocketVariantKeyRequests.length > 0) {
                deleteByIdsApi.mutate(deletedDocketVariantKeyRequests);
            }
        }
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
        transfer,
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

export default useTransferUpdateViewModel;
