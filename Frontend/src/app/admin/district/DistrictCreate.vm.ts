import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { DistrictRequest, DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import ProvinceConfigs from "../province/ProvinceConfigs";
import DistrictConfigs from "./DistrictConfigs";

function useDistrictCreateViewModel() {
    const form = useForm({
        initialValues: DistrictConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(DistrictConfigs.createUpdateFormSchema),
    });

    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);

    const createApi = useCreateApi<DistrictRequest, DistrictResponse>(
        DistrictConfigs.resourceUrl,
    );
    useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        (provinceListResponse) => {
            const selectList: SelectOption[] = provinceListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setProvinceSelectList(selectList);
        },
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: DistrictRequest = {
            name: formValues.name,
            code: formValues.code,
            provinceId: Number(formValues.provinceId),
        };
        createApi.mutate(requestBody);
    });

    return {
        form,
        handleFormSubmit,
        provinceSelectList,
    };
}

export default useDistrictCreateViewModel;
