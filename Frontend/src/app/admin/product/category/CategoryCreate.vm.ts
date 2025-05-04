"use client";
import { useForm, zodResolver } from "@mantine/form";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import CategoryConfigs from "@/app/admin/product/category/CategoryConfigs";
import { CategoryRequest, CategoryResponse } from "@/models/Category";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { SelectOption } from "@/datas/SelectOption";

function useCategoryCreateViewModel() {
    const form = useForm({
        initialValues: CategoryConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CategoryConfigs.createUpdateFormSchema),
    });

    const [categorySelectList, setCategorySelectList] = useState<
        SelectOption[]
    >([]);

    const queryClient = useQueryClient();
    const createApi = useCreateApi<CategoryRequest, CategoryResponse>(
        CategoryConfigs.resourceUrl,
    );

    // Thay thế callback bằng cách lấy data trực tiếp
    const { data: categoryListResponse } = useGetAllApi<CategoryResponse>(
        CategoryConfigs.resourceUrl,
        CategoryConfigs.resourceKey,
        { all: 1 },
        undefined, // Loại bỏ callback
        {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            queryKey: [],
        },
    );

    // Xử lý dữ liệu khi categoryListResponse thay đổi
    useEffect(() => {
        if (categoryListResponse && categoryListResponse.content) {
            const selectList: SelectOption[] = categoryListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.parentCategory
                        ? item.name + " ← " + item.parentCategory.name
                        : item.name,
                }),
            );
            setCategorySelectList(selectList);
        }
    }, [categoryListResponse]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: CategoryRequest = {
            name: formValues.name,
            slug: formValues.slug,
            description: formValues.description || null,
            thumbnail: formValues.thumbnail || null,
            parentCategoryId: Number(formValues.parentCategoryId) || null,
            status: Number(formValues.status),
        };
        createApi.mutate(requestBody, {
            onSuccess: () => {
                // Làm mới dữ liệu sau khi tạo thành công
                queryClient.invalidateQueries({
                    queryKey: [CategoryConfigs.resourceKey, "getAll"],
                });
                // Reset form
                form.reset();
            },
        });
    });

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
        categorySelectList,
        statusSelectList,
        isSuccess: createApi.isSuccess,
        isError: createApi.isError,
    };
}

export default useCategoryCreateViewModel;
