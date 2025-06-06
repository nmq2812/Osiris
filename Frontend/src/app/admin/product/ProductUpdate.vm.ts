import { useState, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";

import { CollectionWrapper } from "@/datas/CollectionWrapper";
import { FileWithPreview } from "@/datas/FileWithPreview";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import useUploadMultipleImagesApi from "@/hooks/use-upload-multiple-images-api";

import { BrandResponse } from "@/models/Brand";
import { CategoryResponse } from "@/models/Category";
import { GuaranteeResponse } from "@/models/Guarantee";
import { UploadedImageResponse, ImageRequest } from "@/models/Image";
import {
    ProductResponse,
    ProductRequest,
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
import { useQueryClient } from "@tanstack/react-query";
import ProductConfigs from "./ProductConfigs";
import BrandConfigs from "./brand/BrandConfigs";
import CategoryConfigs from "./category/CategoryConfigs";
import GuaranteeConfigs from "./guarantee/GuaranteeConfigs";
import PropertyConfigs from "./property/PropertyConfigs";
import SpecificationConfigs from "./specification/SpecificationConfigs";
import SupplierConfigs from "./supplier/SupplierConfigs";
import TagConfigs from "./tag/TagConfigs";
import UnitConfigs from "./unit/UnitConfigs";

function useProductUpdateViewModel(id: number) {
    const initialized = useRef(false);

    const form = useForm({
        initialValues: ProductConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(ProductConfigs.createUpdateFormSchema),
    });

    const [product, setProduct] = useState<ProductResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
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
    const updateApi = useUpdateApi<ProductRequest, ProductResponse>(
        ProductConfigs.resourceUrl,
        ProductConfigs.resourceKey,
        id,
    );

    const uploadMultipleImagesApi = useUploadMultipleImagesApi();

    const { data: productResponse, isLoading } = useGetByIdApi<ProductResponse>(
        ProductConfigs.resourceUrl,
        ProductConfigs.resourceKey,
        id,
        undefined,
    );

    useEffect(() => {
        const initializeData = async () => {
            if (productResponse && !initialized.current) {
                await queryClient.invalidateQueries({
                    queryKey: [TagConfigs.resourceKey, "getAll"],
                });

                setProduct(productResponse);

                const formValues: typeof form.values = {
                    name: productResponse.name,
                    code: productResponse.code,
                    slug: productResponse.slug,
                    shortDescription: productResponse.shortDescription || "",
                    description: productResponse.description || "",
                    images: productResponse.images,
                    status: String(productResponse.status),
                    categoryId: productResponse.category
                        ? String(productResponse.category.id)
                        : null,
                    brandId: productResponse.brand
                        ? String(productResponse.brand.id)
                        : null,
                    supplierId: productResponse.supplier
                        ? String(productResponse.supplier.id)
                        : null,
                    unitId: productResponse.unit
                        ? String(productResponse.unit.id)
                        : null,
                    tags: productResponse.tags
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((tag) => String(tag.id) + "#ORIGINAL"),
                    specifications: productResponse.specifications,
                    properties: productResponse.properties,
                    variants: productResponse.variants,
                    weight: productResponse.weight || 0.0,
                    guaranteeId: productResponse.guarantee
                        ? String(productResponse.guarantee.id)
                        : null,
                };

                form.setValues(formValues);
                setPrevFormValues(formValues);

                if (
                    productResponse.images.some((image) => !image.isEliminated)
                ) {
                    setThumbnailName(
                        (
                            productResponse.images.find(
                                (image) => image.isThumbnail,
                            ) || {}
                        ).name || "",
                    );
                }

                initialized.current = true;
            }
        };

        initializeData();
    }, [productResponse, form, queryClient]);

    useGetAllApi<CategoryResponse>(
        CategoryConfigs.resourceUrl,
        CategoryConfigs.resourceKey,
        { all: 1 },
        (categoryListResponse) => {
            const selectList: SelectOption[] = categoryListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.parentCategory
                        ? item.name + " ← " + item.parentCategory.name
                        : item.name,
                }),
            );
            setCategorySelectList(selectList);
        },
    );

    useGetAllApi<BrandResponse>(
        BrandConfigs.resourceUrl,
        BrandConfigs.resourceKey,
        { all: 1 },
        (brandListResponse) => {
            const selectList: SelectOption[] = brandListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setBrandSelectList(selectList);
        },
    );

    useGetAllApi<SupplierResponse>(
        SupplierConfigs.resourceUrl,
        SupplierConfigs.resourceKey,
        { all: 1 },
        (supplierListResponse) => {
            const selectList: SelectOption[] = supplierListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.displayName,
                }),
            );
            setSupplierSelectList(selectList);
        },
    );

    useGetAllApi<UnitResponse>(
        UnitConfigs.resourceUrl,
        UnitConfigs.resourceKey,
        { all: 1 },
        (unitListResponse) => {
            const selectList: SelectOption[] = unitListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setUnitSelectList(selectList);
        },
    );

    useGetAllApi<TagResponse>(
        TagConfigs.resourceUrl,
        TagConfigs.resourceKey,
        { all: 1 },
        (tagListResponse) => {
            const selectList: SelectOption[] = tagListResponse.content
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => ({
                    value: String(item.id) + "#ORIGINAL",
                    label: item.name,
                }));
            setTagSelectList(selectList);
        },
    );

    useGetAllApi<GuaranteeResponse>(
        GuaranteeConfigs.resourceUrl,
        GuaranteeConfigs.resourceKey,
        { all: 1 },
        (guaranteeListResponse) => {
            const selectList: SelectOption[] =
                guaranteeListResponse.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                }));
            setGuaranteeSelectList(selectList);
        },
    );

    useGetAllApi<SpecificationResponse>(
        SpecificationConfigs.resourceUrl,
        SpecificationConfigs.resourceKey,
        { all: 1 },
        (specificationListResponse) => {
            const productSpecificationsIds =
                form.values.specifications?.content.map((item) => item.id) ||
                [];
            const selectList: SelectOption[] =
                specificationListResponse.content.map((item) => {
                    const option: SelectOption = {
                        value: JSON.stringify({
                            id: item.id,
                            name: item.name,
                            code: item.code,
                        }),
                        label: item.name,
                    };
                    if (productSpecificationsIds.includes(item.id)) {
                        option.disabled = true;
                    }
                    return option;
                });
            setSpecificationSelectList(selectList);
        },
    );

    useGetAllApi<PropertyResponse>(
        PropertyConfigs.resourceUrl,
        PropertyConfigs.resourceKey,
        { all: 1 },
        (propertyListResponse) => {
            const productPropertiesIds =
                form.values.properties?.content.map((item) => item.id) || [];
            const selectList: SelectOption[] = propertyListResponse.content.map(
                (item) => {
                    const option: SelectOption = {
                        value: JSON.stringify({
                            id: item.id,
                            name: item.name,
                            code: item.code,
                        }),
                        label: item.name,
                    };
                    if (productPropertiesIds.includes(item.id)) {
                        option.disabled = true;
                    }
                    return option;
                },
            );
            setProductPropertySelectList(selectList);
        },
    );

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
            setPrevFormValues(formValues);
            if (
                !(
                    MiscUtils.isEquals(form.values, prevFormValues) &&
                    selectedVariantIndexes.length ===
                        product?.variants.length &&
                    imageFiles.length === 0
                )
            ) {
                const requestBody: ProductRequest = {
                    name: formValues.name,
                    code: formValues.code,
                    slug: formValues.slug,
                    shortDescription: formValues.shortDescription || null,
                    description: formValues.description || null,
                    images: [
                        ...formValues.images,
                        ...(uploadedImageResponses
                            ? transformImages(uploadedImageResponses)
                            : []),
                    ],
                    status: Number(formValues.status),
                    categoryId: Number(formValues.categoryId) || null,
                    brandId: Number(formValues.brandId) || null,
                    supplierId: Number(formValues.supplierId) || null,
                    unitId: Number(formValues.unitId) || null,
                    tags: transformTags(formValues.tags),
                    specifications: filterSpecifications(
                        formValues.specifications,
                    ),
                    properties: filterProperties(formValues.properties),
                    variants: filterVariants(formValues.variants),
                    weight: formValues.weight || null,
                    guaranteeId: Number(formValues.guaranteeId) || null,
                };
                updateApi.mutate(requestBody);
                setImageFiles([]);
            }
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
        product,
        form,
        prevFormValues,
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
        updateStatus: updateApi.status,
    };
}

export default useProductUpdateViewModel;
