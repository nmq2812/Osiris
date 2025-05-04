import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import { GuaranteeRequest, GuaranteeResponse } from "@/models/Guarantee";
import { useForm, zodResolver } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";
import GuaranteeConfigs from "./GuaranteeConfigs";

function useGuaranteeCreateViewModel() {
    const form = useForm({
        initialValues: GuaranteeConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(GuaranteeConfigs.createUpdateFormSchema),
    });

    const queryClient = useQueryClient();
    const createApi = useCreateApi<GuaranteeRequest, GuaranteeResponse>(
        GuaranteeConfigs.resourceUrl,
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: GuaranteeRequest = {
            name: formValues.name,
            description: formValues.description || null,
            status: Number(formValues.status),
        };
        createApi.mutate(requestBody, {
            onSuccess: () => {
                // Làm mới dữ liệu sau khi tạo thành công
                queryClient.invalidateQueries({
                    queryKey: [GuaranteeConfigs.resourceKey, "getAll"],
                });
                // Reset form
                form.reset();
            },
        });
    });

    const handleReset = () => {
        form.reset();
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

    return {
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,

        isSuccess: createApi.isSuccess,
        isError: createApi.isError,
        createStatus: createApi.status,
    };
}

export default useGuaranteeCreateViewModel;
