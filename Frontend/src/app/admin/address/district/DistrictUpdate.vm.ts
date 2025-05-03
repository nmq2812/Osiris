import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { DistrictResponse, DistrictRequest } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import MiscUtils from "@/utils/MiscUtils";
import ProvinceConfigs from "../province/ProvinceConfigs";
import DistrictConfigs from "./DistrictConfigs";

function useDistrictUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: DistrictConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(DistrictConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);

    const updateApi = useUpdateApi<DistrictRequest, DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        id,
    );

    const {
        data: district,
        isLoading: isDistrictLoading,
        isError: isDistrictError,
    } = useGetByIdApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        id,
        (districtResponse) => {
            if (districtResponse) {
                const formValues: typeof form.values = {
                    name: districtResponse.name,
                    code: districtResponse.code,
                    provinceId: String(districtResponse.province?.id || ""),
                };

                console.log("District data loaded:", districtResponse);
                form.setValues(formValues);
                setPrevFormValues(formValues);
            }
        },
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`district-${id}`],
        },
    );

    const {
        data: provinces,
        isLoading: isProvincesLoading,
        isError: isProvincesError,
    } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        (provinceListResponse) => {
            if (provinceListResponse?.content) {
                const selectList: SelectOption[] =
                    provinceListResponse.content.map((item) => ({
                        value: String(item.id),
                        label: item.name,
                    }));
                console.log("Provinces loaded:", selectList.length);
                setProvinceSelectList(selectList);
            }
        },
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["all-provinces"],
        },
    );

    useEffect(() => {
        if (provinces?.content) {
            const selectList: SelectOption[] = provinces.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setProvinceSelectList(selectList);
        }
    }, [provinces]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: DistrictRequest = {
                name: formValues.name,
                code: formValues.code,
                provinceId: Number(formValues.provinceId),
            };

            console.log("Submitting district data:", requestBody);
            updateApi.mutate(requestBody);
        }
    });

    const handleReset = () => {
        if (district) {
            form.setValues({
                name: district.name,
                code: district.code,
                provinceId: String(district.province?.id || ""),
            });
        } else {
            form.reset();
        }
    };

    const isLoading = isDistrictLoading || isProvincesLoading;
    const isError = isDistrictError || isProvincesError;

    return {
        district,
        form,
        handleFormSubmit,
        handleReset,
        provinceSelectList,
        isLoading,
        isError,
    };
}

export default useDistrictUpdateViewModel;
