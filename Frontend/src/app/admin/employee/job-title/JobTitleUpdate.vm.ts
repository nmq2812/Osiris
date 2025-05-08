import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import { JobTitleRequest, JobTitleResponse } from "@/models/JobTitle";
import MiscUtils from "@/utils/MiscUtils";
import JobTitleConfigs from "./JobTitleConfigs";

function useJobTitleUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: JobTitleConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(JobTitleConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    // Sử dụng destructuring để lấy kết quả API call
    const updateApi = useUpdateApi<JobTitleRequest, JobTitleResponse>(
        JobTitleConfigs.resourceUrl,
        JobTitleConfigs.resourceKey,
        id,
    );

    // Sử dụng destructuring và cải thiện options
    const {
        data: jobTitle,
        isLoading,
        isError,
    } = useGetByIdApi<JobTitleResponse>(
        JobTitleConfigs.resourceUrl,
        JobTitleConfigs.resourceKey,
        id,
        (jobTitleResponse) => {
            if (jobTitleResponse) {
                const formValues: typeof form.values = {
                    name: jobTitleResponse.name,
                    status: String(jobTitleResponse.status),
                };
                console.log("Job title data loaded:", jobTitleResponse);
                form.setValues(formValues);
                setPrevFormValues(formValues);
            }
        },
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`job-title-${id}`],
        },
    );

    // Cải thiện hàm submit form với callbacks cho success và error
    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: JobTitleRequest = {
                name: formValues.name,
                status: Number(formValues.status),
            };

            console.log("Submitting job title data:", requestBody);
            updateApi.mutate(requestBody, {
                onSuccess: (response) => {
                    console.log("Job title updated successfully:", response);
                },
                onError: (error) => {
                    console.error("Error updating job title:", error);
                },
            });
        } else {
            console.log("No changes detected, skipping update");
        }
    });

    // Thêm hàm reset form
    const handleReset = () => {
        if (jobTitle) {
            const formValues = {
                name: jobTitle.name,
                status: String(jobTitle.status),
            };
            form.setValues(formValues);
            console.log("Form reset to original job title values");
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
        jobTitle,
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

export default useJobTitleUpdateViewModel;
