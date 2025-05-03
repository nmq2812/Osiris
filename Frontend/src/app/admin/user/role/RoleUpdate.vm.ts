import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { RoleResponse, RoleRequest } from "@/models/Role";
import MiscUtils from "@/utils/MiscUtils";
import RoleConfigs from "./RoleConfigs";

function useRoleUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: RoleConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(RoleConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    // Cải thiện API mutation
    const updateApi = useUpdateApi<RoleRequest, RoleResponse>(
        RoleConfigs.resourceUrl,
        RoleConfigs.resourceKey,
        id,
    );

    // Cải thiện API call lấy thông tin role
    const {
        data: role,
        isLoading,
        isError,
    } = useGetByIdApi<RoleResponse>(
        RoleConfigs.resourceUrl,
        RoleConfigs.resourceKey,
        id,
        (roleResponse) => {
            if (roleResponse) {
                const formValues: typeof form.values = {
                    code: roleResponse.code,
                    name: roleResponse.name,
                    status: String(roleResponse.status),
                };
                console.log("Role data loaded:", roleResponse);
                form.setValues(formValues);
                setPrevFormValues(formValues);
            }
        },
        {
            // Thêm options quan trọng
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`role-${id}`],
        },
    );

    // Cải thiện hàm xử lý submit form
    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        // Kiểm tra dữ liệu có thay đổi không
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: RoleRequest = {
                code: formValues.code,
                name: formValues.name,
                status: Number(formValues.status),
            };

            console.log("Submitting role data:", requestBody);
            updateApi.mutate(requestBody, {
                onSuccess: (response) => {
                    console.log("Role updated successfully:", response);
                    // Có thể thêm thông báo thành công ở đây
                },
                onError: (error) => {
                    console.error("Error updating role:", error);
                    // Có thể thêm xử lý lỗi ở đây
                },
            });
        } else {
            console.log("No changes detected, skipping update");
        }
    });

    // Thêm hàm reset form
    const handleReset = () => {
        if (role) {
            form.setValues({
                code: role.code,
                name: role.name,
                status: String(role.status),
            });
            console.log("Form reset to original values");
        } else {
            form.reset();
            console.log("Form reset to default values");
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
        role,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        isError,
        isSubmitDisabled,
    };
}

export default useRoleUpdateViewModel;
