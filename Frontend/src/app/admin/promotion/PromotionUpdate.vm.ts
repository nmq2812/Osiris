import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { ProductResponse } from "@/models/Product";
import { PromotionResponse, PromotionRequest } from "@/models/Promotion";
import MiscUtils from "@/utils/MiscUtils";
import PromotionConfigs from "./PromotionConfigs";

function usePromotionUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: PromotionConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(PromotionConfigs.createUpdateFormSchema),
    });

    const [promotion, setPromotion] = useState<PromotionResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [products, setProducts] = useState<ProductResponse[]>([]);

    const updateApi = useUpdateApi<PromotionRequest, PromotionResponse>(
        PromotionConfigs.resourceUrl,
        PromotionConfigs.resourceKey,
        id,
    );

    const { data: promotionResponse } = useGetByIdApi<PromotionResponse>(
        PromotionConfigs.resourceUrl,
        PromotionConfigs.resourceKey,
        id,
    );

    useEffect(() => {
        if (promotionResponse) {
            setPromotion(promotionResponse);
            const formValues: typeof form.values = {
                name: promotionResponse.name,
                range: [
                    new Date(promotionResponse.startDate),
                    new Date(promotionResponse.endDate),
                ],
                percent: promotionResponse.percent,
                status: String(promotionResponse.status),
                productIds: promotionResponse.products.map(
                    (product) => product.id,
                ),
                categoryIds: [],
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
            setProducts(promotionResponse.products.sort((a, b) => a.id - b.id));
        }
    }, [promotionResponse]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            if (formValues.productIds.length === 0) {
                form.setFieldError("productIds", "Cần thêm ít nhất 1 sản phẩm");
            } else {
                const requestBody: PromotionRequest = {
                    name: formValues.name,
                    startDate: formValues.range[0]!.toISOString(),
                    endDate: formValues.range[1]!.toISOString(),
                    percent: formValues.percent,
                    status: Number(formValues.status),
                    productIds: formValues.productIds,
                    categoryIds: formValues.categoryIds,
                };
                updateApi.mutate(requestBody);
            }
        }
    });

    const handleAddProductFinder = (productResponse: ProductResponse) => {
        form.setFieldValue("productIds", [
            ...form.values.productIds,
            productResponse.id,
        ]);
        setProducts((products) => [...products, productResponse]);
    };

    const handleDeleteProductFinder = (productResponse: ProductResponse) => {
        form.setFieldValue(
            "productIds",
            form.values.productIds.filter(
                (productId) => productId !== productResponse.id,
            ),
        );
        setProducts((products) =>
            products.filter((product) => product.id !== productResponse.id),
        );
    };

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
        promotion,
        form,
        handleFormSubmit,
        statusSelectList,
        products,
        setProducts,
        handleAddProductFinder,
        handleDeleteProductFinder,
    };
}

export default usePromotionUpdateViewModel;
