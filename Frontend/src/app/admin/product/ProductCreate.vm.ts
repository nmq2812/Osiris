import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import FetchUtils from "@/utils/FetchUtils";
import { CollectionWrapper } from "@/datas/CollectionWrapper";
import { FileWithPreview } from "@/datas/FileWithPreview";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useUploadMultipleImagesApi from "@/hooks/use-upload-multiple-images-api";
import { BrandResponse } from "@/models/Brand";
import { CategoryResponse } from "@/models/Category";
import { GuaranteeResponse } from "@/models/Guarantee";
import { UploadedImageResponse, ImageRequest } from "@/models/Image";
import {
    ProductRequest,
    ProductResponse,
    ProductRequest_TagRequest,
    SpecificationItem,
    ProductPropertyItem,
} from "@/models/Product";
import { PropertyResponse } from "@/models/Property";
import { SpecificationResponse } from "@/models/Specification";
import { SupplierResponse } from "@/models/Supplier";
import { TagResponse } from "@/models/Tag";
import { UnitResponse } from "@/models/Unit";
import { VariantRequest } from "@/models/Variant";
import MiscUtils from "@/utils/MiscUtils";
import ProductConfigs from "./ProductConfigs";
import CategoryConfigs from "@/app/category/CategoryConfigs";
import BrandConfigs from "@/app/brand/BrandConfigs";
import SupplierConfigs from "./supplier/SupplierConfigs";
import UnitConfigs from "./unit/UnitConfigs";
import TagConfigs from "./tag/TagConfigs";

function useProductCreateViewModel() {
    const form = useForm({
        initialValues: ProductConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(ProductConfigs.createUpdateFormSchema),
    });

    // State variables
    const [categorySelectList, setCategorySelectList] = useState<
        SelectOption[]
    >([]);
    const [brandSelectList, setBrandSelectList] = useState<SelectOption[]>([]);
    const [supplierSelectList, setSupplierSelectList] = useState<
        SelectOption[]
    >([]);
    const [unitSelectList, setUnitSelectList] = useState<SelectOption[]>([]);
    const [tagSelectList, setTagSelectList] = useState<SelectOption[]>([]);
    const [guaranteeSelectList, setGuaranteeSelectList] = useState<
        SelectOption[]
    >([]);
    const [imageFiles, setImageFiles] = useState<FileWithPreview[]>([]);
    const [thumbnailName, setThumbnailName] = useState("");
    const [specificationSelectList, setSpecificationSelectList] = useState<
        SelectOption[]
    >([]);
    const [productPropertySelectList, setProductPropertySelectList] = useState<
        SelectOption[]
    >([]);
    const [selectedVariantIndexes, setSelectedVariantIndexes] = useState<
        number[]
    >([]);

    const queryClient = useQueryClient();
    const createApi = useCreateApi<ProductRequest, ProductResponse>(
        ProductConfigs.resourceUrl,
    );
    const uploadMultipleImagesApi = useUploadMultipleImagesApi();

    // Cấu hình chung cho các query
    const commonOptions = {
        staleTime: 5 * 60 * 1000, // 5 phút
        refetchOnWindowFocus: false,
    };

    // Tách riêng từng query
    const categoryQuery = useQuery({
        queryKey: [CategoryConfigs.resourceKey, "getAll"],
        queryFn: () =>
            FetchUtils.get(`${CategoryConfigs.resourceUrl}`, { all: 1 }),
        ...commonOptions,
    });

    const brandQuery = useQuery({
        queryKey: [BrandConfigs.resourceKey, "getAll"],
        queryFn: () =>
            FetchUtils.get(`${BrandConfigs.resourceUrl}`, { all: 1 }),
        ...commonOptions,
    });

    const supplierQuery = useQuery({
        queryKey: [SupplierConfigs.resourceKey, "getAll"],
        queryFn: () =>
            FetchUtils.get(`${SupplierConfigs.resourceUrl}`, { all: 1 }),
        ...commonOptions,
    });

    const unitQuery = useQuery({
        queryKey: [UnitConfigs.resourceKey, "getAll"],
        queryFn: () => FetchUtils.get(`${UnitConfigs.resourceUrl}`, { all: 1 }),
        ...commonOptions,
    });

    const tagQuery = useQuery({
        queryKey: [TagConfigs.resourceKey, "getAll"],
        queryFn: () => FetchUtils.get(`${TagConfigs.resourceUrl}`, { all: 1 }),
        ...commonOptions,
    });

    const guaranteeQuery = useQuery({
        queryKey: [GuaranteeConfigs.resourceKey, "getAll"],
        queryFn: () =>
            FetchUtils.get(`${GuaranteeConfigs.resourceUrl}`, { all: 1 }),
        ...commonOptions,
    });

    const specificationQuery = useQuery({
        queryKey: [SpecificationConfigs.resourceKey, "getAll"],
        queryFn: () =>
            FetchUtils.get(`${SpecificationConfigs.resourceUrl}`, { all: 1 }),
        ...commonOptions,
    });

    const propertyQuery = useQuery({
        queryKey: [PropertyConfigs.resourceKey, "getAll"],
        queryFn: () =>
            FetchUtils.get(`${PropertyConfigs.resourceUrl}`, { all: 1 }),
        ...commonOptions,
    });

    // Xử lý dữ liệu categories
    useEffect(() => {
        if (categoryQuery.data) {
            const selectList: SelectOption[] = categoryQuery.data.content.map(
                (item: CategoryResponse) => ({
                    value: String(item.id),
                    label: item.parentCategory
                        ? item.name + " ← " + item.parentCategory.name
                        : item.name,
                }),
            );
            setCategorySelectList(selectList);
        }
    }, [categoryQuery.data]);

    // Xử lý dữ liệu brands
    useEffect(() => {
        if (brandQuery.data) {
            const selectList: SelectOption[] = brandQuery.data.content.map(
                (item: BrandResponse) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setBrandSelectList(selectList);
        }
    }, [brandQuery.data]);

    // Xử lý dữ liệu suppliers
    useEffect(() => {
        if (supplierQuery.data) {
            const selectList: SelectOption[] = supplierQuery.data.content.map(
                (item: SupplierResponse) => ({
                    value: String(item.id),
                    label: item.displayName,
                }),
            );
            setSupplierSelectList(selectList);
        }
    }, [supplierQuery.data]);

    // Xử lý dữ liệu units
    useEffect(() => {
        if (unitQuery.data) {
            const selectList: SelectOption[] = unitQuery.data.content.map(
                (item: UnitResponse) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setUnitSelectList(selectList);
        }
    }, [unitQuery.data]);

    // Xử lý dữ liệu tags
    useEffect(() => {
        if (tagQuery.data) {
            const selectList: SelectOption[] = tagQuery.data.content
                .sort((a: TagResponse, b: TagResponse) =>
                    a.name.localeCompare(b.name),
                )
                .map((item: TagResponse) => ({
                    value: String(item.id) + "#ORIGINAL",
                    label: item.name,
                }));
            setTagSelectList(selectList);
        }
    }, [tagQuery.data]);

    // Xử lý dữ liệu guarantees
    useEffect(() => {
        if (guaranteeQuery.data) {
            const selectList: SelectOption[] = guaranteeQuery.data.content.map(
                (item: GuaranteeResponse) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setGuaranteeSelectList(selectList);
        }
    }, [guaranteeQuery.data]);

    // Xử lý dữ liệu specifications
    useEffect(() => {
        if (specificationQuery.data) {
            const selectList: SelectOption[] =
                specificationQuery.data.content.map(
                    (item: SpecificationResponse) => ({
                        value: JSON.stringify({
                            id: item.id,
                            name: item.name,
                            code: item.code,
                        }),
                        label: item.name,
                    }),
                );
            setSpecificationSelectList(selectList);
        }
    }, [specificationQuery.data]);

    // Xử lý dữ liệu properties
    useEffect(() => {
        if (propertyQuery.data) {
            const selectList: SelectOption[] = propertyQuery.data.content.map(
                (item: PropertyResponse) => ({
                    value: JSON.stringify({
                        id: item.id,
                        name: item.name,
                        code: item.code,
                    }),
                    label: item.name,
                }),
            );
            setProductPropertySelectList(selectList);
        }
    }, [propertyQuery.data]);

    // Các hàm xử lý khác giữ nguyên...
    const transformTags = (tags: string[]): ProductRequest_TagRequest[] =>
        tags.map((tagIdOrName) => {
            if (tagIdOrName.includes("#ORIGINAL")) {
                return { id: Number(tagIdOrName.split("#")[0]) };
            }
            return {
                name: tagIdOrName.trim(),
                slug: MiscUtils.convertToSlug(tagIdOrName),
                status: 1,
            };
        });

    const transformImages = (
        uploadedImageResponses: UploadedImageResponse[],
    ): ImageRequest[] => {
        const thumbnailIndex = imageFiles.findIndex(
            (imageFile) => imageFile.name === thumbnailName,
        );
        return uploadedImageResponses.map((uploadedImageResponse, index) => ({
            id: null,
            name: uploadedImageResponse.name,
            path: uploadedImageResponse.path,
            contentType: uploadedImageResponse.contentType,
            size: uploadedImageResponse.size,
            group: "P",
            isThumbnail: index === thumbnailIndex,
            isEliminated: false,
        }));
    };

    const filterSpecifications = (
        specifications: CollectionWrapper<SpecificationItem> | null,
    ) => {
        if (specifications === null) {
            return null;
        }
        const filteredSpecifications = specifications.content.filter(
            (specification) => specification.id !== 0,
        );
        return filteredSpecifications.length === 0
            ? null
            : new CollectionWrapper(filteredSpecifications);
    };

    const filterProperties = (
        productProperties: CollectionWrapper<ProductPropertyItem> | null,
    ) => {
        if (productProperties === null) {
            return null;
        }
        const filteredProductProperties = productProperties.content.filter(
            (property) => property.value.length !== 0,
        );
        return filteredProductProperties.length === 0
            ? null
            : new CollectionWrapper(filteredProductProperties);
    };

    const filterVariants = (variants: VariantRequest[]) => {
        return variants.filter((_, index) =>
            selectedVariantIndexes.includes(index),
        );
    };

    const handleFormSubmit = form.onSubmit((formValues) => {
        const createProduct = (
            uploadedImageResponses?: UploadedImageResponse[],
        ) => {
            const requestBody: ProductRequest = {
                name: formValues.name,
                code: formValues.code,
                slug: formValues.slug,
                shortDescription: formValues.shortDescription || null,
                description: formValues.description || null,
                images: uploadedImageResponses
                    ? transformImages(uploadedImageResponses)
                    : [],
                status: Number(formValues.status),
                categoryId: Number(formValues.categoryId) || null,
                brandId: Number(formValues.brandId) || null,
                supplierId: Number(formValues.supplierId) || null,
                unitId: Number(formValues.unitId) || null,
                tags: transformTags(formValues.tags),
                specifications: filterSpecifications(formValues.specifications),
                properties: filterProperties(formValues.properties),
                variants: filterVariants(formValues.variants),
                weight: formValues.weight || null,
                guaranteeId: Number(formValues.guaranteeId) || null,
            };
            createApi.mutate(requestBody, {
                onSuccess: async (productResponse) => {
                    await queryClient.invalidateQueries([
                        TagConfigs.resourceKey,
                        "getAll",
                    ]);
                    const tags = productResponse.tags
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((tag) => String(tag.id) + "#ORIGINAL");
                    form.setFieldValue("tags", tags);
                },
            });
        };

        if (imageFiles.length > 0) {
            uploadMultipleImagesApi.mutate(imageFiles, {
                onSuccess: (imageCollectionResponse) =>
                    createProduct(imageCollectionResponse.content),
            });
        } else {
            createProduct();
        }
    });

    const resetForm = () => {
        form.reset();
        setImageFiles([]);
        setThumbnailName("");
    };

    // Check if any queries are loading
    const isLoading =
        categoryQuery.isLoading ||
        brandQuery.isLoading ||
        supplierQuery.isLoading ||
        unitQuery.isLoading ||
        tagQuery.isLoading ||
        guaranteeQuery.isLoading ||
        specificationQuery.isLoading ||
        propertyQuery.isLoading;

    // Check if any queries have errors
    const hasErrors =
        categoryQuery.isError ||
        brandQuery.isError ||
        supplierQuery.isError ||
        unitQuery.isError ||
        tagQuery.isError ||
        guaranteeQuery.isError ||
        specificationQuery.isError ||
        propertyQuery.isError;

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
        form,
        handleFormSubmit,
        statusSelectList,
        categorySelectList,
        brandSelectList,
        supplierSelectList,
        unitSelectList,
        tagSelectList,
        guaranteeSelectList,
        imageFiles,
        setImageFiles,
        thumbnailName,
        setThumbnailName,
        specificationSelectList,
        setSpecificationSelectList,
        productPropertySelectList,
        setProductPropertySelectList,
        selectedVariantIndexes,
        setSelectedVariantIndexes,
        resetForm,
        isLoading,
        hasErrors,
    };
}

export default useProductCreateViewModel;
