import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { AddressResponse, AddressRequest } from "@/models/Address";
import { DistrictResponse } from "@/models/District";
import { ProvinceResponse } from "@/models/Province";
import MiscUtils from "@/utils/MiscUtils";
import DistrictConfigs from "./district/DistrictConfigs";
import ProvinceConfigs from "./province/ProvinceConfigs";
import AddressConfigs from "./AddressConfigs";

function useAddressUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: AddressConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(AddressConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);
    const [allDistricts, setAllDistricts] = useState<DistrictResponse[]>([]);

    const updateApi = useUpdateApi<AddressRequest, AddressResponse>(
        AddressConfigs.resourceUrl,
        AddressConfigs.resourceKey,
        id,
    );

    // 1. Lấy dữ liệu địa chỉ từ API với tracking trạng thái
    const {
        data: address,
        isLoading: isAddressLoading,
        isError: isAddressError,
    } = useGetByIdApi<AddressResponse>(
        AddressConfigs.resourceUrl,
        AddressConfigs.resourceKey,
        id,
        (addressResponse) => {
            if (!addressResponse) return;

            const formValues: typeof form.values = {
                line: addressResponse.line || "",
                provinceId: addressResponse.province
                    ? String(addressResponse.province.id)
                    : null,
                districtId: addressResponse.district
                    ? String(addressResponse.district.id)
                    : null,
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        },
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`address-${id}`],
        },
    );

    // 2. Lấy danh sách tỉnh/thành phố
    const { isLoading: isProvincesLoading, isError: isProvincesError } =
        useGetAllApi<ProvinceResponse>(
            ProvinceConfigs.resourceUrl,
            ProvinceConfigs.resourceKey,
            { all: 1 },
            (provinceListResponse) => {
                if (!provinceListResponse?.content) return;

                const selectList: SelectOption[] =
                    provinceListResponse.content.map((item) => ({
                        value: String(item.id),
                        label: item.name,
                    }));
                console.log("Provinces loaded:", selectList.length);
                setProvinceSelectList(selectList);
            },
            {
                refetchOnWindowFocus: false,
                staleTime: 60000,
                queryKey: ["all-provinces"],
            },
        );

    // 3. Lấy danh sách quận/huyện
    const { isLoading: isDistrictsLoading, isError: isDistrictsError } =
        useGetAllApi<DistrictResponse>(
            DistrictConfigs.resourceUrl,
            DistrictConfigs.resourceKey,
            { all: 1 },
            (districtListResponse) => {
                if (!districtListResponse?.content) return;

                // Lưu tất cả districts để có thể lọc sau
                setAllDistricts(districtListResponse.content);

                const selectList: SelectOption[] =
                    districtListResponse.content.map((item) => ({
                        value: String(item.id),
                        label: item.name,
                        // Lưu thêm provinceId để lọc
                        provinceId: String(item.province?.id || ""),
                    }));
                console.log("Districts loaded:", selectList.length);
                setDistrictSelectList(selectList);
            },
            {
                refetchOnWindowFocus: false,
                staleTime: 60000,
                queryKey: ["all-districts"],
            },
        );

    // 4. Thêm useEffect để lọc districts khi province thay đổi
    useEffect(() => {
        const provinceId = form.values.provinceId;
        if (provinceId && allDistricts.length > 0) {
            // Lọc district theo province đã chọn
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

            console.log(
                `Filtered districts for province ${provinceId}:`,
                filteredDistricts.length,
            );
            setDistrictSelectList(filteredDistricts);
        } else if (allDistricts.length > 0) {
            // Nếu không chọn province, hiển thị tất cả districts
            const allDistrictOptions = allDistricts.map((item) => ({
                value: String(item.id),
                label: item.name,
                provinceId: String(item.province?.id || ""),
            }));
            setDistrictSelectList(allDistrictOptions);
        }
    }, [form.values.provinceId, allDistricts]);

    // 5. Thêm effect khi form thay đổi province để reset district
    useEffect(() => {
        // Reset district khi province thay đổi
        const provinceId = form.values.provinceId;
        const districtId = form.values.districtId;

        if (districtId && provinceId) {
            // Kiểm tra xem district có thuộc province không
            const district = allDistricts.find(
                (d) => String(d.id) === districtId,
            );
            if (
                district &&
                district.province &&
                String(district.province.id) !== provinceId
            ) {
                // Reset district nếu không thuộc province đã chọn
                form.setFieldValue("districtId", null);
            }
        }
    }, [form.values.provinceId, allDistricts]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: AddressRequest = {
                line: formValues.line || null,
                provinceId: Number(formValues.provinceId) || null,
                districtId: Number(formValues.districtId) || null,
                wardId: null,
            };
            updateApi.mutate(requestBody);
        }
    });

    // 6. Thêm handler riêng khi province thay đổi
    const handleProvinceChange = (provinceId: string | null) => {
        form.setFieldValue("provinceId", provinceId);
        // Reset district khi thay đổi province
        form.setFieldValue("districtId", null);
    };

    // 7. Tổng hợp trạng thái loading và error
    const isLoading =
        isAddressLoading || isProvincesLoading || isDistrictsLoading;
    const isError = isAddressError || isProvincesError || isDistrictsError;

    return {
        address,
        form,
        handleFormSubmit,
        handleProvinceChange,
        provinceSelectList,
        districtSelectList,
        isLoading,
        isError,
    };
}

export default useAddressUpdateViewModel;
