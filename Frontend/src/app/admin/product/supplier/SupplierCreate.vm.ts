import { useForm, zodResolver } from "@mantine/form";
import { useState, useEffect } from "react";
import SupplierConfigs from "@/app/admin/product/supplier/SupplierConfigs";
import { SupplierRequest, SupplierResponse } from "@/models/Supplier";
import useCreateApi from "@/hooks/use-create-api";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import { ProvinceResponse } from "@/models/Province";

import { AddressRequest } from "@/models/Address";
import { DistrictResponse } from "@/models/District";
import DistrictConfigs from "../../address/district/DistrictConfigs";
import ProvinceConfigs from "../../address/province/ProvinceConfigs";

function useSupplierCreateViewModel() {
    const form = useForm({
        initialValues: SupplierConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(SupplierConfigs.createUpdateFormSchema),
    });

    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);

    const createApi = useCreateApi<SupplierRequest, SupplierResponse>(
        SupplierConfigs.resourceUrl,
    );

    // Lấy dữ liệu tỉnh/thành phố
    const { data: provinceListResponse } = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined, // Loại bỏ callback
    );

    // Lấy dữ liệu quận/huyện
    const { data: districtListResponse } = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
        undefined, // Loại bỏ callback
    );

    // Xử lý dữ liệu tỉnh/thành phố khi có response
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

    // Xử lý dữ liệu quận/huyện khi có response
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

    // Xử lý form submit vẫn như cũ
    const handleFormSubmit = form.onSubmit((formValues) => {
        const addressRequest: AddressRequest = {
            line: formValues["address.line"] || null,
            provinceId: Number(formValues["address.provinceId"]) || null,
            districtId: Number(formValues["address.districtId"]) || null,
            wardId: null,
        };
        const requestBody: SupplierRequest = {
            displayName: formValues.displayName,
            code: formValues.code,
            contactFullname: formValues.contactFullname || null,
            contactEmail: formValues.contactEmail || null,
            contactPhone: formValues.contactPhone || null,
            companyName: formValues.companyName || null,
            taxCode: formValues.taxCode || null,
            email: formValues.email || null,
            phone: formValues.phone || null,
            fax: formValues.fax || null,
            website: formValues.website || null,
            address: Object.values(addressRequest).every(
                (value) => value === null,
            )
                ? null
                : addressRequest,
            description: formValues.description || null,
            note: formValues.note || null,
            status: Number(formValues.status),
        };
        createApi.mutate(requestBody);
    });

    // Danh sách trạng thái giữ nguyên
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

        isSuccess: createApi.isSuccess,
        isError: createApi.isError,
    };
}

export default useSupplierCreateViewModel;
