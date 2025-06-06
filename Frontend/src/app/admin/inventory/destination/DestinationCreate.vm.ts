"use client";
import { useForm, zodResolver } from "@mantine/form";
import DestinationConfigs from "@/app/admin/inventory/destination/DestinationConfigs";
import { DestinationRequest, DestinationResponse } from "@/models/Destination";
import useCreateApi from "@/hooks/use-create-api";
import { useState, useEffect } from "react";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import { ProvinceResponse } from "@/models/Province";
import { DistrictResponse } from "@/models/District";
import DistrictConfigs from "../../address/district/DistrictConfigs";
import ProvinceConfigs from "../../address/province/ProvinceConfigs";

function useDestinationCreateViewModel() {
    const form = useForm({
        initialValues: DestinationConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(DestinationConfigs.createUpdateFormSchema),
    });

    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);

    const createApi = useCreateApi<DestinationRequest, DestinationResponse>(
        DestinationConfigs.resourceUrl,
    );

    const { data: provinceListResponse } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined,
    );

    const { data: districtListResponse } = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
        undefined,
    );

    useEffect(() => {
        if (provinceListResponse && provinceListResponse.content) {
            const selectList: SelectOption[] = provinceListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setProvinceSelectList(selectList);
        }
    }, [provinceListResponse]);

    useEffect(() => {
        if (districtListResponse && districtListResponse.content) {
            const selectList: SelectOption[] = districtListResponse.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setDistrictSelectList(selectList);
        }
    }, [districtListResponse]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: DestinationRequest = {
            contactFullname: formValues.contactFullname || null,
            contactEmail: formValues.contactEmail || null,
            contactPhone: formValues.contactPhone || null,
            address: {
                line: formValues["address.line"],
                provinceId: Number(formValues["address.provinceId"]),
                districtId: Number(formValues["address.districtId"]),
                wardId: null,
            },
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
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isSubmitting: createApi.status === "pending",
    };
}

export default useDestinationCreateViewModel;
