import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import { JobLevelRequest, JobLevelResponse } from "@/models/JobLevel";
import JobLevelConfigs from "./JobLevelConfigs";

function useJobLevelCreateViewModel() {
    const form = useForm({
        initialValues: JobLevelConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(JobLevelConfigs.createUpdateFormSchema),
    });

    // Sử dụng createApi với destructuring để lấy status
    const createApi = useCreateApi<JobLevelRequest, JobLevelResponse>(
        JobLevelConfigs.resourceUrl,
    );

    // Cải thiện hàm submit form với callbacks cho success và error
    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: JobLevelRequest = {
            name: formValues.name,
            status: Number(formValues.status),
        };

        createApi.mutate(requestBody, {
            onSuccess: (response) => {
                alert("Job level created successfully");
                // Reset form sau khi tạo thành công
                form.reset();
            },
            onError: (error) => {
                alert("Error creating job level:" + error);
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
            label: "Có hiệu lực",
        },
        {
            value: "2",
            label: "Vô hiệu lực",
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

export default useJobLevelCreateViewModel;
