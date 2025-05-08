import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import {
    SpecificationRequest,
    SpecificationResponse,
} from "@/models/Specification";
import { useForm, zodResolver } from "@mantine/form";
import SpecificationConfigs from "./SpecificationConfigs";

function useSpecificationCreateViewModel() {
    const form = useForm({
        initialValues: SpecificationConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(SpecificationConfigs.createUpdateFormSchema),
    });

    const createApi = useCreateApi<SpecificationRequest, SpecificationResponse>(
        SpecificationConfigs.resourceUrl,
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: SpecificationRequest = {
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

export default useSpecificationCreateViewModel;
