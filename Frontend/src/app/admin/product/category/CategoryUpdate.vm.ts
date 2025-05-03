import { useState, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";

import CategoryConfigs from "@/app/admin/product/category/CategoryConfigs";
import { CategoryRequest, CategoryResponse } from "@/models/Category";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { SelectOption } from "@/datas/SelectOption";
import MiscUtils from "@/utils/MiscUtils";

function useCategoryUpdateViewModel(id: number) {
    // Sử dụng useRef để theo dõi việc form đã được khởi tạo hay chưa
    const initialized = useRef(false);

    const form = useForm({
        initialValues: CategoryConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CategoryConfigs.createUpdateFormSchema),
    });

    const [category, setCategory] = useState<CategoryResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [categorySelectList, setCategorySelectList] = useState<
        SelectOption[]
    >([]);

    const queryClient = useQueryClient();
    const updateApi = useUpdateApi<CategoryRequest, CategoryResponse>(
        CategoryConfigs.resourceUrl,
        CategoryConfigs.resourceKey,
        id,
    );

    // Lấy thông tin chi tiết category từ ID
    const { data: categoryResponse } = useGetByIdApi<CategoryResponse>(
        CategoryConfigs.resourceUrl,
        CategoryConfigs.resourceKey,
        id,
        undefined, // Loại bỏ callback
    );

    // Lấy danh sách tất cả category
    const { data: categoryListResponse } = useGetAllApi<CategoryResponse>(
        CategoryConfigs.resourceUrl,
        CategoryConfigs.resourceKey,
        { all: 1 },
        undefined, // Loại bỏ callback
    );

    // Xử lý dữ liệu chi tiết category khi nó thay đổi
    useEffect(() => {
        if (categoryResponse && !initialized.current) {
            setCategory(categoryResponse);
            const formValues: typeof form.values = {
                name: categoryResponse.name,
                slug: categoryResponse.slug,
                description: categoryResponse.description || "",
                thumbnail: categoryResponse.thumbnail || "",
                parentCategoryId: categoryResponse.parentCategory
                    ? String(categoryResponse.parentCategory.id)
                    : null,
                status: String(categoryResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
            initialized.current = true;
        }
    }, [categoryResponse, form]);

    // Xử lý danh sách category khi nó thay đổi
    useEffect(() => {
        if (categoryListResponse && categoryListResponse.content) {
            const selectList: SelectOption[] = categoryListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.parentCategory
                        ? item.name + " ← " + item.parentCategory.name
                        : item.name,
                    disabled:
                        item.id === id ||
                        (item.parentCategory
                            ? item.parentCategory.id === id
                            : false),
                }),
            );
            setCategorySelectList(selectList);
        }
    }, [categoryListResponse, id]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: CategoryRequest = {
                name: formValues.name,
                slug: formValues.slug,
                description: formValues.description || null,
                thumbnail: formValues.thumbnail || null,
                parentCategoryId: Number(formValues.parentCategoryId) || null,
                status: Number(formValues.status),
            };
            updateApi.mutate(requestBody, {
                onSuccess: () =>
                    queryClient.invalidateQueries({
                        queryKey: [CategoryConfigs.resourceKey, "getAll"],
                    }),
            });
        }
    });

    const handleReset = () => {
        if (prevFormValues) {
            form.setValues(prevFormValues);
        }
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
        category,
        form,
        handleFormSubmit,
        handleReset,
        categorySelectList,
        statusSelectList,
        isLoading: !categoryResponse,
        updateStatus: updateApi.status,
    };
}

export default useCategoryUpdateViewModel;
