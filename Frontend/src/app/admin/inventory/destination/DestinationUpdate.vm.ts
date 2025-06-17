import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import DestinationConfigs from "@/app/admin/inventory/destination/DestinationConfigs";
import { DestinationRequest, DestinationResponse } from "@/models/Destination";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import { ProvinceResponse } from "@/models/Province";
import { DistrictResponse } from "@/models/District";
import DistrictConfigs from "../../address/district/DistrictConfigs";
import ProvinceConfigs from "../../address/province/ProvinceConfigs";

function useDestinationUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: DestinationConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(DestinationConfigs.createUpdateFormSchema),
    });

    const [destination, setDestination] = useState<DestinationResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);

    const updateApi = useUpdateApi<DestinationRequest, DestinationResponse>(
        DestinationConfigs.resourceUrl,
        DestinationConfigs.resourceKey,
        id,
    );

    // Lấy destination - sử dụng destructuring thay vì callback
    const { data: destinationResponse, isLoading: isDestinationLoading } =
        useGetByIdApi<DestinationResponse>(
            DestinationConfigs.resourceUrl,
            DestinationConfigs.resourceKey,
            id,
            undefined, // Bỏ callback
        );

    // Lấy provinces - sử dụng destructuring thay vì callback
    const { data: provinceListResponse } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined, // Bỏ callback
    );

    // Lấy districts - sử dụng destructuring thay vì callback
    const { data: districtListResponse } = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
        undefined, // Bỏ callback
    );

    // Xử lý destination data khi thay đổi
    useEffect(() => {
        if (destinationResponse) {
            setDestination(destinationResponse);
            const formValues: typeof form.values = {
                contactFullname: destinationResponse.contactFullname || "",
                contactEmail: destinationResponse.contactEmail || "",
                contactPhone: destinationResponse.contactPhone || "",
                "address.line": destinationResponse.address.line || "",
                "address.provinceId": destinationResponse.address.province
                    ? String(destinationResponse.address.province.id)
                    : null,
                "address.districtId": destinationResponse.address.district
                    ? String(destinationResponse.address.district.id)
                    : null,
                status: String(destinationResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        }
    }, [destinationResponse, form]);

    // Xử lý province data khi thay đổi
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

    // Xử lý district data khi thay đổi
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
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
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
            updateApi.mutate(requestBody);
        }
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
        destination,
        form,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isLoading: isDestinationLoading,
        updateStatus: updateApi.status,
    };
}

export default useDestinationUpdateViewModel;
