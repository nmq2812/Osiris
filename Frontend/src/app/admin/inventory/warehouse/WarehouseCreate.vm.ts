import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { AddressRequest } from "@/models/Address";
import { DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import { WarehouseRequest, WarehouseResponse } from "@/models/Warehouse";
import { useForm, zodResolver } from "@mantine/form";
import { useState, useEffect } from "react";
import DistrictConfigs from "../../address/district/DistrictConfigs";
import ProvinceConfigs from "../../address/province/ProvinceConfigs";
import WarehouseConfigs from "./WarehouseConfigs";

function useWarehouseCreateViewModel() {
    const form = useForm({
        initialValues: WarehouseConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(WarehouseConfigs.createUpdateFormSchema),
    });

    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);

    const createApi = useCreateApi<WarehouseRequest, WarehouseResponse>(
        WarehouseConfigs.resourceUrl,
    );

    // Lấy danh sách tỉnh thành - sử dụng destructuring thay vì callback
    const { data: provinceListResponse } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined, // Bỏ callback
    );

    // Lấy danh sách quận huyện - sử dụng destructuring thay vì callback
    const { data: districtListResponse } = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
        undefined, // Bỏ callback
    );

    // Xử lý dữ liệu tỉnh thành khi dữ liệu thay đổi
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

    // Xử lý dữ liệu quận huyện khi dữ liệu thay đổi
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
        const addressRequest: AddressRequest = {
            line: formValues["address.line"] || null,
            provinceId: Number(formValues["address.provinceId"]) || null,
            districtId: Number(formValues["address.districtId"]) || null,
            wardId: null,
        };
        const requestBody: WarehouseRequest = {
            code: formValues.code,
            name: formValues.name,
            address: Object.values(addressRequest).every(
                (value) => value === null,
            )
                ? null
                : addressRequest,
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

export default useWarehouseCreateViewModel;
