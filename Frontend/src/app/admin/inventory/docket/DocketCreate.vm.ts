import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { DocketRequest, DocketResponse } from "@/models/Docket";
import { DocketReasonResponse } from "@/models/DocketReason";
import { DocketVariantRequest } from "@/models/DocketVariant";
import { VariantResponse } from "@/models/Variant";
import { WarehouseResponse } from "@/models/Warehouse";
import { useForm, zodResolver } from "@mantine/form";
import { produce } from "immer";
import { useState, useEffect } from "react";
import WarehouseConfigs from "../warehouse/WarehouseConfigs";
import DocketConfigs from "./DocketConfigs";
import DocketReasonConfigs from "../docket-reason/DocketReasonConfigs";

function useDocketCreateViewModel() {
    const form = useForm({
        initialValues: DocketConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(DocketConfigs.createUpdateFormSchema),
    });

    const [reasonSelectList, setReasonSelectList] = useState<SelectOption[]>(
        [],
    );
    const [warehouseSelectList, setWarehouseSelectList] = useState<
        SelectOption[]
    >([]);
    const [variants, setVariants] = useState<VariantResponse[]>([]);

    const createApi = useCreateApi<DocketRequest, DocketResponse>(
        DocketConfigs.resourceUrl,
    );

    // Gọi useGetAllApi bên ngoài
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

    // Sử dụng useEffect để theo dõi và cập nhật state
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
            (draft: any[]) => {
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

export default useDocketCreateViewModel;
