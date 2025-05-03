import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import { JobTitleRequest, JobTitleResponse } from "@/models/JobTitle";
import JobTitleConfigs from "./JobTitleConfigs";

function useJobTitleCreateViewModel() {
    const form = useForm({
        initialValues: JobTitleConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(JobTitleConfigs.createUpdateFormSchema),
    });

    // Sử dụng createApi với destructuring để lấy status
    const createApi = useCreateApi<JobTitleRequest, JobTitleResponse>(
        JobTitleConfigs.resourceUrl,
    );

    // Cải thiện hàm submit form với callbacks cho success và error
    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: JobTitleRequest = {
            name: formValues.name,
            status: Number(formValues.status),
        };

        console.log("Submitting job title data:", requestBody);
        createApi.mutate(requestBody, {
            onSuccess: (response) => {
                console.log("Job title created successfully:", response);
                // Reset form sau khi tạo thành công
                form.reset();
            },
            onError: (error) => {
                console.error("Error creating job title:", error);
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

export default useJobTitleCreateViewModel;
