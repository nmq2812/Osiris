import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import { JobTypeRequest, JobTypeResponse } from "@/models/JobType";
import JobTypeConfigs from "./JobTypeConfigs";

function useJobTypeCreateViewModel() {
    const form = useForm({
        initialValues: JobTypeConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(JobTypeConfigs.createUpdateFormSchema),
    });

    const createApi = useCreateApi<JobTypeRequest, JobTypeResponse>(
        JobTypeConfigs.resourceUrl,
    );

    // Cải thiện hàm submit form với callbacks cho success và error
    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: JobTypeRequest = {
            name: formValues.name,
            status: Number(formValues.status),
        };

        console.log("Submitting job type data:", requestBody);
        createApi.mutate(requestBody, {
            onSuccess: (response) => {
                console.log("Job type created successfully:", response);
                // Reset form sau khi tạo thành công
                form.reset();
            },
            onError: (error) => {
                console.error("Error creating job type:", error);
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

export default useJobTypeCreateViewModel;
