import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetAllApi from "@/hooks/use-get-all-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { DistrictResponse } from "@/models/District";
import { OfficeResponse, OfficeRequest } from "@/models/Office";
import { ProvinceResponse } from "@/models/Province";
import MiscUtils from "@/utils/MiscUtils";
import DistrictConfigs from "../../address/district/DistrictConfigs";
import ProvinceConfigs from "../../address/province/ProvinceConfigs";
import OfficeConfigs from "./OfficeConfigs";

function useOfficeUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: OfficeConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(OfficeConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        SelectOption[]
    >([]);
    const [allDistricts, setAllDistricts] = useState<DistrictResponse[]>([]);
    const [initialProvinceFilterApplied, setInitialProvinceFilterApplied] =
        useState(false);

    const updateApi = useUpdateApi<OfficeRequest, OfficeResponse>(
        OfficeConfigs.resourceUrl,
        OfficeConfigs.resourceKey,
        id,
    );

    const {
        data: office,
        isLoading: isOfficeLoading,
        isError: isOfficeError,
    } = useGetByIdApi<OfficeResponse>(
        OfficeConfigs.resourceUrl,
        OfficeConfigs.resourceKey,
        id,
        (officeResponse) => {
            if (officeResponse) {
                const formValues: typeof form.values = {
                    name: officeResponse.name,
                    "address.line": officeResponse.address?.line || "",
                    "address.provinceId": officeResponse.address?.province
                        ? String(officeResponse.address.province.id)
                        : null,
                    "address.districtId": officeResponse.address?.district
                        ? String(officeResponse.address.district.id)
                        : null,
                    status: String(officeResponse.status),
                };
                console.log("Office data loaded:", officeResponse);
                form.setValues(formValues);
                setPrevFormValues(formValues);
            }
        },
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`office-${id}`],
        },
    );

    const provincesQuery = useGetAllApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        { all: 1 },
        undefined,
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
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["districts-all"],
        },
    );

    useEffect(() => {
        if (provincesQuery.data) {
            const selectList: SelectOption[] = provincesQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            console.log("Provinces loaded:", selectList.length);
            setProvinceSelectList(selectList);
        }
    }, [provincesQuery.data]);

    useEffect(() => {
        if (districtsQuery.data) {
            setAllDistricts(districtsQuery.data.content);

            const selectList: SelectOption[] = districtsQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                    provinceId: String(item.province?.id || ""),
                }),
            );
            console.log("Districts loaded:", selectList.length);
            setDistrictSelectList(selectList);
        }
    }, [districtsQuery.data]);

    useEffect(() => {
        if (
            office?.address?.province &&
            allDistricts.length > 0 &&
            !initialProvinceFilterApplied
        ) {
            const defaultProvinceId = String(office.address.province.id);
            console.log(
                "Applying initial filter with province ID:",
                defaultProvinceId,
            );

            const filteredDistricts = allDistricts
                .filter(
                    (district) =>
                        district.province &&
                        String(district.province.id) === defaultProvinceId,
                )
                .map((item) => ({
                    value: String(item.id),
                    label: item.name,
                    provinceId: String(item.province?.id || ""),
                }));

            console.log(
                `Initial filtered districts for province ${defaultProvinceId}:`,
                filteredDistricts.length,
            );
            setDistrictSelectList(filteredDistricts);
            setInitialProvinceFilterApplied(true);
        }
    }, [office, allDistricts, initialProvinceFilterApplied]);

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

            console.log(
                `Filtered districts for province ${provinceId}:`,
                filteredDistricts.length,
            );
            setDistrictSelectList(filteredDistricts);
        } else if (allDistricts.length > 0 && !initialProvinceFilterApplied) {
            const allDistrictOptions = allDistricts.map((item) => ({
                value: String(item.id),
                label: item.name,
                provinceId: String(item.province?.id || ""),
            }));
            setDistrictSelectList(allDistrictOptions);
        }
    }, [
        form.values["address.provinceId"],
        allDistricts,
        initialProvinceFilterApplied,
    ]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
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
            updateApi.mutate(requestBody, {
                onSuccess: (response) => {
                    alert("Cập nhật văn phòng thành công!");
                },
                onError: (error) => {
                    console.error("Error updating office:", error);
                    alert("Cập nhật văn phòng thất bại! " + error);
                },
            });
        } else {
            console.log("No changes detected, skipping update");
        }
    });

    const handleReset = () => {
        if (office) {
            const formValues = {
                name: office.name,
                "address.line": office.address?.line || "",
                "address.provinceId": office.address?.province
                    ? String(office.address.province.id)
                    : null,
                "address.districtId": office.address?.district
                    ? String(office.address.district.id)
                    : null,
                status: String(office.status),
            };
            form.setValues(formValues);
            console.log("Form reset to original office values");
        } else {
            form.reset();
            console.log("Form reset to empty values");
        }
    };

    const handleProvinceChange = (provinceId: string | null) => {
        form.setFieldValue("address.provinceId", provinceId);
        form.setFieldValue("address.districtId", null);
        setInitialProvinceFilterApplied(false);
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

    const isSubmitDisabled = MiscUtils.isEquals(form.values, prevFormValues);

    const isLoading =
        isOfficeLoading || provincesQuery.isLoading || districtsQuery.isLoading;
    const isError =
        isOfficeError || provincesQuery.isError || districtsQuery.isError;

    return {
        office,
        form,
        handleFormSubmit,
        handleReset,
        handleProvinceChange,
        provinceSelectList,
        districtSelectList,
        statusSelectList,
        isLoading,
        isError,
        isSubmitDisabled,
        updateStatus: updateApi.status,
        debug: {
            provincesLoaded: provinceSelectList.length,
            districtsLoaded: districtSelectList.length,
            provincesLoading: provincesQuery.isLoading,
            districtsLoading: districtsQuery.isLoading,
            provincesError: provincesQuery.isError,
            districtsError: districtsQuery.isError,
            initialProvinceFilterApplied,
        },
    };
}

export default useOfficeUpdateViewModel;
