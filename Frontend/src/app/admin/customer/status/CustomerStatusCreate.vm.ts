import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import {
    CustomerStatusRequest,
    CustomerStatusResponse,
} from "@/models/CustomerStatus";
import { useForm, zodResolver } from "@mantine/form";
import CustomerStatusConfigs from "./CustomerStatusConfigs";

function useCustomerStatusCreateViewModel() {
    const form = useForm({
        initialValues: CustomerStatusConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CustomerStatusConfigs.createUpdateFormSchema),
    });

    const createApi = useCreateApi<
        CustomerStatusRequest,
        CustomerStatusResponse
    >(CustomerStatusConfigs.resourceUrl);

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: CustomerStatusRequest = {
            code: formValues.code,
            name: formValues.name,
            description: formValues.description,
            color: formValues.color,
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

export default useCustomerStatusCreateViewModel;
