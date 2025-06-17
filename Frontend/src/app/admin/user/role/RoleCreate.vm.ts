"use client";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import { RoleRequest, RoleResponse } from "@/models/Role";
import { useForm, zodResolver } from "@mantine/form";
import RoleConfigs from "./RoleConfigs";

function useRoleCreateViewModel() {
    const form = useForm({
        initialValues: RoleConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(RoleConfigs.createUpdateFormSchema),
    });

    const createApi = useCreateApi<RoleRequest, RoleResponse>(
        RoleConfigs.resourceUrl,
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: RoleRequest = {
            code: formValues.code,
            name: formValues.name,
            status: Number(formValues.status),
        };
        createApi.mutate(requestBody);
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
        statusSelectList,
    };
}

export default useRoleCreateViewModel;
