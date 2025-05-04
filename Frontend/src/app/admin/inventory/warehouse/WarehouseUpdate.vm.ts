import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import WarehouseConfigs from "@/app/admin/inventory/warehouse/WarehouseConfigs";
import { WarehouseRequest, WarehouseResponse } from "@/models/Warehouse";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import { ProvinceResponse } from "@/models/Province";

import { AddressRequest } from "@/models/Address";
import { DistrictResponse } from "@/models/District";
import DistrictConfigs from "../../address/district/DistrictConfigs";
import ProvinceConfigs from "../../address/province/ProvinceConfigs";

function useWarehouseUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: WarehouseConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(WarehouseConfigs.createUpdateFormSchema),
    });

    const [warehouse, setWarehouse] = useState<WarehouseResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);

    // Update API
    const updateApi = useUpdateApi<WarehouseRequest, WarehouseResponse>(
        WarehouseConfigs.resourceUrl,
        WarehouseConfigs.resourceKey,
        id,
    );

    // Get warehouse by ID - using destructuring instead of callback
    const { data: warehouseData, isLoading: isWarehouseLoading } =
        useGetByIdApi<WarehouseResponse>(
            WarehouseConfigs.resourceUrl,
            WarehouseConfigs.resourceKey,
            id,
            undefined, // Remove callback
        );

    // Get provinces - using destructuring instead of callback
    const { data: provinceListResponse } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined, // Remove callback
    );

    // Get districts - using destructuring instead of callback
    const { data: districtListResponse } = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
        undefined, // Remove callback
    );

    // Handle warehouse data when it changes
    useEffect(() => {
        if (warehouseData) {
            setWarehouse(warehouseData);
            const formValues = {
                code: warehouseData.code,
                name: warehouseData.name,
                "address.line": warehouseData.address?.line || "",
                "address.provinceId": warehouseData.address?.province
                    ? String(warehouseData.address.province.id)
                    : null,
                "address.districtId": warehouseData.address?.district
                    ? String(warehouseData.address.district.id)
                    : null,
                status: String(warehouseData.status),
            };

            // Chỉ cập nhật form nếu dữ liệu thực sự thay đổi
            if (!MiscUtils.isEquals(formValues, form.values)) {
                form.setValues(formValues);
                setPrevFormValues(formValues);
            }
        }
    }, [warehouseData]); // Loại bỏ form khỏi dependencies

    // Handle province data when it changes
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

    // Handle district data when it changes
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
        warehouse,
        form,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isLoading: isWarehouseLoading,
        updateStatus: updateApi.status,
    };
}

export default useWarehouseUpdateViewModel;
