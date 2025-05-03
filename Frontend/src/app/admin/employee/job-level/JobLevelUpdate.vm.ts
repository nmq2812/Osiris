import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import { JobLevelRequest, JobLevelResponse } from "@/models/JobLevel";
import MiscUtils from "@/utils/MiscUtils";
import JobLevelConfigs from "./JobLevelConfigs";

function useJobLevelUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: JobLevelConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(JobLevelConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    // Sử dụng destructuring để lấy kết quả API call
    const updateApi = useUpdateApi<JobLevelRequest, JobLevelResponse>(
        JobLevelConfigs.resourceUrl,
        JobLevelConfigs.resourceKey,
        id,
    );

    // Sử dụng destructuring và cải thiện options
    const {
        data: jobLevel,
        isLoading,
        isError,
    } = useGetByIdApi<JobLevelResponse>(
        JobLevelConfigs.resourceUrl,
        JobLevelConfigs.resourceKey,
        id,
        (jobLevelResponse) => {
            if (jobLevelResponse) {
                const formValues: typeof form.values = {
                    name: jobLevelResponse.name,
                    status: String(jobLevelResponse.status),
                };
                console.log("Job level data loaded:", jobLevelResponse);
                form.setValues(formValues);
                setPrevFormValues(formValues);
            }
        },
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`job-level-${id}`],
        },
    );

    // Cải thiện hàm submit form với callbacks cho success và error
    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: JobLevelRequest = {
                name: formValues.name,
                status: Number(formValues.status),
            };

            console.log("Submitting job level data:", requestBody);
            updateApi.mutate(requestBody, {
                onSuccess: (response) => {
                    console.log("Job level updated successfully:", response);
                },
                onError: (error) => {
                    console.error("Error updating job level:", error);
                },
            });
        } else {
            console.log("No changes detected, skipping update");
        }
    });

    // Thêm hàm reset form
    const handleReset = () => {
        if (jobLevel) {
            const formValues = {
                name: jobLevel.name,
                status: String(jobLevel.status),
            };
            form.setValues(formValues);
            console.log("Form reset to original job level values");
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
        jobLevel,
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

export default useJobLevelUpdateViewModel;
