import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import { JobTypeRequest, JobTypeResponse } from "@/models/JobType";
import MiscUtils from "@/utils/MiscUtils";
import JobTypeConfigs from "./JobTypeConfigs";

function useJobTypeUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: JobTypeConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(JobTypeConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    // Sử dụng destructuring để lấy kết quả API call
    const updateApi = useUpdateApi<JobTypeRequest, JobTypeResponse>(
        JobTypeConfigs.resourceUrl,
        JobTypeConfigs.resourceKey,
        id,
    );

    // Sử dụng destructuring và cải thiện options
    const {
        data: jobType,
        isLoading,
        isError,
    } = useGetByIdApi<JobTypeResponse>(
        JobTypeConfigs.resourceUrl,
        JobTypeConfigs.resourceKey,
        id,
        (jobTypeResponse) => {
            if (jobTypeResponse) {
                const formValues: typeof form.values = {
                    name: jobTypeResponse.name,
                    status: String(jobTypeResponse.status),
                };
                console.log("Job type data loaded:", jobTypeResponse);
                form.setValues(formValues);
                setPrevFormValues(formValues);
            }
        },
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`job-type-${id}`],
        },
    );

    // Cải thiện hàm submit form với callbacks cho success và error
    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: JobTypeRequest = {
                name: formValues.name,
                status: Number(formValues.status),
            };

            console.log("Submitting job type data:", requestBody);
            updateApi.mutate(requestBody, {
                onSuccess: (response) => {
                    console.log("Job type updated successfully:", response);
                },
                onError: (error) => {
                    console.error("Error updating job type:", error);
                },
            });
        } else {
            console.log("No changes detected, skipping update");
        }
    });

    // Thêm hàm reset form
    const handleReset = () => {
        if (jobType) {
            const formValues = {
                name: jobType.name,
                status: String(jobType.status),
            };
            form.setValues(formValues);
            console.log("Form reset to original job type values");
        } else {
            form.reset();
            console.log("Form reset to empty values");
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

    // Thêm hàm kiểm tra có thể submit không
    const isSubmitDisabled = MiscUtils.isEquals(form.values, prevFormValues);

    return {
        jobType,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        isError,
        isSubmitDisabled,
        updateStatus: updateApi.status,
    };
}

export default useJobTypeUpdateViewModel;
