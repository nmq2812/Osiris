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
    CountVariantKeyRequest,
    CountVariantRequest,
} from "@/models/CountVariant";
import { CountRequest, CountResponse } from "@/models/Count";
import { VariantResponse } from "@/models/Variant";
import { VariantInventoryResponse } from "@/models/VariantInventory";
import { WarehouseResponse } from "@/models/Warehouse";
import MiscUtils from "@/utils/MiscUtils";
import WarehouseConfigs from "../warehouse/WarehouseConfigs";
import CountConfigs from "./CountConfigs";

function useCountUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: CountConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CountConfigs.createUpdateFormSchema),
    });

    const [count, setCount] = useState<CountResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [warehouseSelectList, setWarehouseSelectList] = useState<
        SelectOption[]
    >([]);
    const [variants, setVariants] = useState<VariantResponse[]>([]);
    const [variantIdForFetchInventory, setVariantIdForFetchInventory] =
        useState(0);
    const [shouldProcessInventory, setShouldProcessInventory] = useState(false);

    const updateApi = useUpdateApi<CountRequest, CountResponse>(
        CountConfigs.resourceUrl,
        CountConfigs.resourceKey,
        id,
    );

    // Thay đổi cách lấy dữ liệu Count, bỏ callback
    const { data: countResponse } = useGetByIdApi<CountResponse>(
        CountConfigs.resourceUrl,
        CountConfigs.resourceKey,
        id,
    );

    // Thay đổi cách lấy danh sách warehouse, bỏ callback
    const { data: warehouseListResponse } = useGetAllApi<WarehouseResponse>(
        WarehouseConfigs.resourceUrl,
        WarehouseConfigs.resourceKey,
        { sort: "id,asc", all: 1 },
    );

    // Thay đổi cách lấy dữ liệu tồn kho, bỏ callback
    const { data: variantInventoryResponse, refetch } =
        useGetByIdApi<VariantInventoryResponse>(
            ResourceURL.VARIANT_INVENTORY,
            "variant-inventories",
            variantIdForFetchInventory,
            undefined, // Bỏ callback
            {
                enabled: !!variantIdForFetchInventory,
                queryKey: [],
            },
        );

    // Xử lý dữ liệu Count khi có response
    useEffect(() => {
        if (countResponse) {
            setCount(countResponse);
            const formValues: typeof form.values = {
                code: countResponse.code,
                warehouseId: String(countResponse.warehouse.id),
                countVariants: countResponse.countVariants.map(
                    (countVariantResponse) => ({
                        variantId: countVariantResponse.variant.id,
                        inventory: countVariantResponse.inventory,
                        actualInventory: countVariantResponse.actualInventory,
                    }),
                ),
                note: countResponse.note || "",
                status: String(countResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
            setVariants(
                countResponse.countVariants.map(
                    (countVariant) => countVariant.variant,
                ),
            );
        }
    }, [countResponse, form]);

    // Xử lý danh sách warehouse khi có response
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

    // Xử lý dữ liệu tồn kho khi có response
    useEffect(() => {
        if (variantInventoryResponse && shouldProcessInventory) {
            const countVariantRequest: CountVariantRequest = {
                variantId: variantInventoryResponse.variant.id,
                inventory: variantInventoryResponse.inventory,
                actualInventory: variantInventoryResponse.inventory,
            };
            const currentCountVariantRequests = [
                ...form.values.countVariants,
                countVariantRequest,
            ];
            form.setFieldValue("countVariants", currentCountVariantRequests);
            setVariants((variants) => [
                ...variants,
                variantInventoryResponse.variant,
            ]);

            // Reset states sau khi xử lý
            setShouldProcessInventory(false);
            setVariantIdForFetchInventory(0);
        }
    }, [variantInventoryResponse, shouldProcessInventory, form]);

    // Khi variantIdForFetchInventory thay đổi và có giá trị, đánh dấu cần xử lý
    useEffect(() => {
        if (variantIdForFetchInventory > 0) {
            setShouldProcessInventory(true);
        }
    }, [variantIdForFetchInventory]);

    const deleteByIdsApi = useDeleteByIdsApi<CountVariantKeyRequest>(
        ResourceURL.COUNT_VARIANT,
        "count-variants",
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (prevFormValues && !MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: CountRequest = {
                code: formValues.code,
                warehouseId: Number(formValues.warehouseId),
                countVariants: formValues.countVariants,
                note: formValues.note || null,
                status: Number(formValues.status),
            };
            updateApi.mutate(requestBody);

            const deletedCountVariantKeyRequests: CountVariantKeyRequest[] =
                prevFormValues.countVariants
                    .map((countVariantRequest) => countVariantRequest.variantId)
                    .filter(
                        (variantId) =>
                            !formValues.countVariants
                                .map((item) => item.variantId)
                                .includes(variantId),
                    )
                    .map((variantId) => ({
                        countId: id,
                        variantId: variantId,
                    }));

            if (deletedCountVariantKeyRequests.length > 0) {
                deleteByIdsApi.mutate(deletedCountVariantKeyRequests);
            }
        }
    });

    const handleClickVariantResultItem = (variant: VariantResponse) => {
        setTimeout(() => {
            if (variantIdForFetchInventory === variant.id) {
                refetch();
            } else {
                setVariantIdForFetchInventory(variant.id);
            }
        }, 100);
    };

    const handleActualInventoryInput = (
        actualInventory: number,
        index: number,
    ) => {
        const currentCountVariantRequests = produce(
            form.values.countVariants,
            (draft) => {
                const variant = draft[index];
                variant.actualInventory = actualInventory;
            },
        );
        form.setFieldValue("countVariants", currentCountVariantRequests);
    };

    const handleDeleteVariantButton = (index: number) => {
        const currentCountVariantRequests = form.values.countVariants.filter(
            (_, i) => i !== index,
        );
        form.setFieldValue("countVariants", currentCountVariantRequests);
        setVariants((variants) => variants.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        form.reset();
        setVariants([]);
    };

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
        count,
        form,
        handleFormSubmit,
        handleClickVariantResultItem,
        handleActualInventoryInput,
        handleDeleteVariantButton,
        resetForm,
        warehouseSelectList,
        statusSelectList,
        variants,
    };
}

export default useCountUpdateViewModel;
