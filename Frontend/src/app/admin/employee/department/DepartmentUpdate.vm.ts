import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import { DepartmentRequest, DepartmentResponse } from "@/models/Department";
import MiscUtils from "@/utils/MiscUtils";
import DepartmentConfigs from "./DepartmentConfigs";

function useDepartmentUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: DepartmentConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(DepartmentConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    // Sử dụng destructuring để lấy kết quả API call
    const updateApi = useUpdateApi<DepartmentRequest, DepartmentResponse>(
        DepartmentConfigs.resourceUrl,
        DepartmentConfigs.resourceKey,
        id,
    );

    // Sử dụng destructuring và cải thiện options
    const {
        data: department,
        isLoading,
        isError,
    } = useGetByIdApi<DepartmentResponse>(
        DepartmentConfigs.resourceUrl,
        DepartmentConfigs.resourceKey,
        id,
        (departmentResponse) => {
            if (departmentResponse) {
                const formValues: typeof form.values = {
                    name: departmentResponse.name,
                    status: String(departmentResponse.status),
                };

                form.setValues(formValues);
                setPrevFormValues(formValues);
            }
        },
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`department-${id}`],
        },
    );

    // Cải thiện hàm submit form với callbacks cho success và error
    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: DepartmentRequest = {
                name: formValues.name,
                status: Number(formValues.status),
            };

            console.log("Submitting department data:", requestBody);
            updateApi.mutate(requestBody, {
                onSuccess: (response) => {
                    console.log("Department updated successfully:", response);
                    // Có thể thêm thông báo thành công ở đây
                },
                onError: (error) => {
                    console.error("Error updating department:", error);
                    // Có thể thêm xử lý lỗi ở đây
                },
            });
        } else {
            console.log("No changes detected, skipping update");
        }
    });

    // Thêm hàm reset form
    const handleReset = () => {
        if (department) {
            const formValues = {
                name: department.name,
                status: String(department.status),
            };
            form.setValues(formValues);
            console.log("Form reset to original department values");
        } else {
            form.reset();
            console.log("Form reset to empty values");
        }
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

    // Thêm hàm kiểm tra có thể submit không
    const isSubmitDisabled = MiscUtils.isEquals(form.values, prevFormValues);

    return {
        department,
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

export default useDepartmentUpdateViewModel;
