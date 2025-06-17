import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import {
    DocketReasonRequest,
    DocketReasonResponse,
} from "@/models/DocketReason";
import { useForm, zodResolver } from "@mantine/form";
import DocketReasonConfigs from "./DocketReasonConfigs";

function useDocketReasonCreateViewModel() {
    const form = useForm({
        initialValues: DocketReasonConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(DocketReasonConfigs.createUpdateFormSchema),
    });

    const createApi = useCreateApi<DocketReasonRequest, DocketReasonResponse>(
        DocketReasonConfigs.resourceUrl,
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: DocketReasonRequest = {
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

export default useDocketReasonCreateViewModel;
