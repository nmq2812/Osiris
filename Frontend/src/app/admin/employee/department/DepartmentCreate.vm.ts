import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import { DepartmentRequest, DepartmentResponse } from "@/models/Department";
import DepartmentConfigs from "./DepartmentConfigs";

function useDepartmentCreateViewModel() {
    const form = useForm({
        initialValues: DepartmentConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(DepartmentConfigs.createUpdateFormSchema),
    });

    // Sử dụng createApi với destructuring để lấy status
    const createApi = useCreateApi<DepartmentRequest, DepartmentResponse>(
        DepartmentConfigs.resourceUrl,
    );

    // Cải thiện hàm submit form với callbacks cho success và error
    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: DepartmentRequest = {
            name: formValues.name,
            status: Number(formValues.status),
        };

        createApi.mutate(requestBody, {
            onSuccess: (response) => {
                // Reset form sau khi tạo thành công
                form.reset();
            },
            onError: (error) => {
                console.error("Error creating department:", error);
            },
        });
    });

    // Thêm hàm reset form
    const handleReset = () => {
        form.reset();
        console.log("Form reset to default values");
    };

    const statusSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Đang hoạt động",
        },
        {
            value: "2",
            label: "Ít hoạt động",
        },
        {
            value: "3",
            label: "Không hoạt động",
        },
    ];

    // Lấy thông tin về trạng thái loading và error từ createApi
    const isLoading = createApi.status === "pending";
    const isError = createApi.status === "error";

    return {
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        isError,
        createStatus: createApi.status,
    };
}

export default useDepartmentCreateViewModel;
