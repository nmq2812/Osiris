import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import ResourceURL from "@/constants/ResourceURL";
import { SelectOption } from "@/datas/SelectOption";
import useDeleteByIdsApi from "@/hooks/use-delete-by-ids-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { DocketResponse, DocketRequest } from "@/models/Docket";
import { DocketReasonResponse } from "@/models/DocketReason";
import {
    DocketVariantKeyRequest,
    DocketVariantRequest,
} from "@/models/DocketVariant";
import { VariantResponse } from "@/models/Variant";
import { WarehouseResponse } from "@/models/Warehouse";
import MiscUtils from "@/utils/MiscUtils";
import { produce } from "immer";
import DocketReasonConfigs from "../docket-reason/DocketReasonConfigs";
import WarehouseConfigs from "../warehouse/WarehouseConfigs";
import DocketConfigs from "./DocketConfigs";

function useDocketUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: DocketConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(DocketConfigs.createUpdateFormSchema),
    });

    const [docket, setDocket] = useState<DocketResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const [reasonSelectList, setReasonSelectList] = useState<SelectOption[]>(
        [],
    );
    const [warehouseSelectList, setWarehouseSelectList] = useState<
        SelectOption[]
    >([]);
    const [variants, setVariants] = useState<VariantResponse[]>([]);

    const updateApi = useUpdateApi<DocketRequest, DocketResponse>(
        DocketConfigs.resourceUrl,
        DocketConfigs.resourceKey,
        id,
    );

    // Thay thế callback bằng việc lấy data trực tiếp
    const { data: docketResponse } = useGetByIdApi<DocketResponse>(
        DocketConfigs.resourceUrl,
        DocketConfigs.resourceKey,
        id,
    );

    const { data: docketReasonListResponse } =
        useGetAllApi<DocketReasonResponse>(
            DocketReasonConfigs.resourceUrl,
            DocketReasonConfigs.resourceKey,
            { sort: "id,asc", all: 1 },
        );

    const { data: warehouseListResponse } = useGetAllApi<WarehouseResponse>(
        WarehouseConfigs.resourceUrl,
        WarehouseConfigs.resourceKey,
        { sort: "id,asc", all: 1 },
    );

    // Xử lý dữ liệu docket thông qua useEffect
    useEffect(() => {
        if (docketResponse) {
            setDocket(docketResponse);

            const formValues: typeof form.values = {
                type: String(docketResponse.type),
                code: docketResponse.code,
                reasonId: String(docketResponse.reason.id),
                warehouseId: String(docketResponse.warehouse.id),
                docketVariants: docketResponse.docketVariants.map(
                    (docketVariantResponse) => ({
                        variantId: docketVariantResponse.variant.id,
                        quantity: docketVariantResponse.quantity,
                    }),
                ),
                purchaseOrderId: docketResponse.purchaseOrder
                    ? String(docketResponse.purchaseOrder.id)
                    : null,
                orderId: docketResponse.order
                    ? String(docketResponse.order.id)
                    : null,
                note: docketResponse.note || "",
                status: String(docketResponse.status),
            };

            form.setValues(formValues);
            setPrevFormValues(formValues);
            setVariants(
                docketResponse.docketVariants.map(
                    (docketVariant) => docketVariant.variant,
                ),
            );
        }
    }, [docketResponse, form]);

    // Xử lý dữ liệu lý do phiếu thông qua useEffect
    useEffect(() => {
        if (docketReasonListResponse?.content) {
            const selectList: SelectOption[] =
                docketReasonListResponse.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                }));
            setReasonSelectList(selectList);
        }
    }, [docketReasonListResponse]);

    // Xử lý dữ liệu kho hàng thông qua useEffect
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

    const deleteByIdsApi = useDeleteByIdsApi<DocketVariantKeyRequest>(
        ResourceURL.DOCKET_VARIANT,
        "docket-variants",
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (prevFormValues && !MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: DocketRequest = {
                type: Number(formValues.type),
                code: formValues.code,
                reasonId: Number(formValues.reasonId),
                warehouseId: Number(formValues.warehouseId),
                docketVariants: formValues.docketVariants,
                purchaseOrderId: Number(formValues.purchaseOrderId) || null,
                orderId: Number(formValues.orderId) || null,
                note: formValues.note || null,
                status: Number(formValues.status),
            };
            updateApi.mutate(requestBody);

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
                    .map((variantId) => ({
                        docketId: id,
                        variantId: variantId,
                    }));

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

    const resetForm = () => {
        form.reset();
        setVariants([]);
    };

    const typeSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Nhập",
        },
        {
            value: "2",
            label: "Xuất",
        },
    ];

    const statusSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Mới",
        },
        {
            value: "2",
            label: "Đang xử lý",
        },
        {
            value: "3",
            label: "Hoàn thành",
        },
        {
            value: "4",
            label: "Hủy bỏ",
        },
    ];

    return {
        docket,
        form,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleQuantityInput,
        handleDeleteVariantButton,
        resetForm,
        reasonSelectList,
        warehouseSelectList,
        typeSelectList,
        statusSelectList,
        variants,
    };
}

export default useDocketUpdateViewModel;
