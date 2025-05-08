import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import { PropertyRequest, PropertyResponse } from "@/models/Property";
import { useForm, zodResolver } from "@mantine/form";
import PropertyConfigs from "./PropertyConfigs";

function usePropertyCreateViewModel() {
    const form = useForm({
        initialValues: PropertyConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(PropertyConfigs.createUpdateFormSchema),
    });

    const createApi = useCreateApi<PropertyRequest, PropertyResponse>(
        PropertyConfigs.resourceUrl,
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: PropertyRequest = {
            name: formValues.name,
            code: formValues.code,
            description: formValues.description || null,
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

export default usePropertyCreateViewModel;
