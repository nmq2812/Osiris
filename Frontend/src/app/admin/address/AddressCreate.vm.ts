import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { AddressRequest, AddressResponse } from "@/models/Address";
import { DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import DistrictConfigs from "./district/DistrictConfigs";
import ProvinceConfigs from "./province/ProvinceConfigs";
import AddressConfigs from "./AddressConfigs";

function useAddressCreateViewModel() {
    const form = useForm({
        initialValues: AddressConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(AddressConfigs.createUpdateFormSchema),
    });

    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);

    const createApi = useCreateApi<AddressRequest, AddressResponse>(
        AddressConfigs.resourceUrl,
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
    useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
        (districtListResponse) => {
            const selectList: SelectOption[] = districtListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setDistrictSelectList(selectList);
        },
    );

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: AddressRequest = {
            line: formValues.line || null,
            provinceId: Number(formValues.provinceId) || null,
            districtId: Number(formValues.districtId) || null,
            wardId: null,
        };
        createApi.mutate(requestBody);
    });

    return {
        form,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
    };
}

export default useAddressCreateViewModel;
