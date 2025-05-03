"use client";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import { DistrictResponse } from "@/models/District";
import { OfficeRequest, OfficeResponse } from "@/models/Office";
import { ProvinceResponse } from "@/models/Province";
import { useForm, zodResolver } from "@mantine/form";
import { useState, useEffect } from "react";
import DistrictConfigs from "../../address/district/DistrictConfigs";
import ProvinceConfigs from "../../address/province/ProvinceConfigs";
import OfficeConfigs from "./OfficeConfigs";

function useOfficeCreateViewModel() {
    const form = useForm({
        initialValues: OfficeConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(OfficeConfigs.createUpdateFormSchema),
    });

    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);
    const [allDistricts, setAllDistricts] = useState<DistrictResponse[]>([]);

    const createApi = useCreateApi<OfficeRequest, OfficeResponse>(
        OfficeConfigs.resourceUrl,
    );

    // Sửa: Tách API call và xử lý data như UserUpdate.vm.ts
    const provincesQuery = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined, // Bỏ callback, xử lý trong useEffect
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["provinces-all"],
        },
    );

    const districtsQuery = useGetAllApi<DistrictResponse>(
        DistrictConfigs.resourceUrl,
        DistrictConfigs.resourceKey,
        { all: 1 },
        undefined, // Bỏ callback, xử lý trong useEffect
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["districts-all"],
        },
    );

    // Xử lý provinces trong useEffect khi data thay đổi
    useEffect(() => {
        if (provincesQuery.data) {
            const selectList: SelectOption[] = provincesQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            console.log("Setting province select list:", selectList.length);
            setProvinceSelectList(selectList);
        }
    }, [provincesQuery.data]);

    // Xử lý districts trong useEffect khi data thay đổi
    useEffect(() => {
        if (districtsQuery.data) {
            // Lưu toàn bộ districts
            setAllDistricts(districtsQuery.data.content);

            const selectList: SelectOption[] = districtsQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                    provinceId: String(item.province?.id || ""),
                }),
            );
            console.log("Setting district select list:", selectList.length);
            setDistrictSelectList(selectList);
        }
    }, [districtsQuery.data]);

    // Lọc districts theo provinceId đã chọn
    useEffect(() => {
        const provinceId = form.values["address.provinceId"];
        if (provinceId && allDistricts.length > 0) {
            const filteredDistricts = allDistricts
                .filter(
                    (district) =>
                        district.province &&
                        String(district.province.id) === provinceId,
                )
                .map((item) => ({
                    value: String(item.id),
                    label: item.name,
                    provinceId: String(item.province?.id || ""),
                }));

            setDistrictSelectList(filteredDistricts);
        }
    }, [form.values["address.provinceId"], allDistricts]);

    // Cải thiện hàm submit form
    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: OfficeRequest = {
            name: formValues.name,
            address: {
                line: formValues["address.line"],
                provinceId: Number(formValues["address.provinceId"]),
                districtId: Number(formValues["address.districtId"]),
                wardId: null,
            },
            status: Number(formValues.status),
        };

        console.log("Submitting office data:", requestBody);
        createApi.mutate(requestBody, {
            onSuccess: (response) => {
                console.log("Office created successfully:", response);
                // Reset form sau khi tạo thành công
                alert("Tạo văn phòng thành công!");
                form.reset();
            },
            onError: (error) => {
                console.error("Error creating office:", error);
                alert("Có lỗi xảy ra khi tạo văn phòng!");
            },
        });
    });

    // Thêm hàm reset form
    const handleReset = () => {
        form.reset();
        console.log("Form reset to default values");
    };

    const statusSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Đang hoạt động",
        },
        {
            value: "2",
            label: "Ít hoạt động",
        },
        {
            value: "3",
            label: "Không hoạt động",
        },
    ];

    // Thêm handleProvinceChange để cập nhật giá trị và reset district
    const handleProvinceChange = (provinceId: string | null) => {
        form.setFieldValue("address.provinceId", provinceId);
        // Reset district khi thay đổi province
        form.setFieldValue("address.districtId", null);
    };

    // Tổng hợp trạng thái loading và error
    const isLoading = provincesQuery.isLoading || districtsQuery.isLoading;
    const isError = provincesQuery.isError || districtsQuery.isError;

    return {
        form,
        handleFormSubmit,
        handleReset,
        handleProvinceChange,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isLoading,
        isError,
        createStatus: createApi.status,
        debug: {
            provincesLoaded: provinceSelectList.length,
            districtsLoaded: districtSelectList.length,
            provincesLoading: provincesQuery.isLoading,
            districtsLoading: districtsQuery.isLoading,
            provincesError: provincesQuery.isError,
            districtsError: districtsQuery.isError,
        },
    };
}

export default useOfficeCreateViewModel;
