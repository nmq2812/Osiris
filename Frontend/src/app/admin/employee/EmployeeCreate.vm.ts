import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { DistrictSelectOption, SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import useGetAllApi from "@/hooks/use-get-all-api";

// Import models
import { EmployeeRequest, EmployeeResponse } from "@/models/Employee";
import { ProvinceResponse } from "@/models/Province";
import { DistrictResponse } from "@/models/District";
import { OfficeResponse } from "@/models/Office";
import { DepartmentResponse } from "@/models/Department";
import { JobTypeResponse } from "@/models/JobType";
import { JobLevelResponse } from "@/models/JobLevel";
import { JobTitleResponse } from "@/models/JobTitle";

// Import configs
import EmployeeConfigs from "./EmployeeConfigs";
import ProvinceConfigs from "../address/province/ProvinceConfigs";
import DistrictConfigs from "../address/district/DistrictConfigs";
import OfficeConfigs from "./office/OfficeConfigs";
import DepartmentConfigs from "./department/DepartmentConfigs";
import JobTypeConfigs from "./job-type/JobTypeConfigs";
import JobLevelConfigs from "./job-level/JobLevelConfigs";
import JobTitleConfigs from "./job-title/JobTitleConfigs";

function useEmployeeCreateViewModel() {
    const form = useForm({
        initialValues: EmployeeConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(EmployeeConfigs.createUpdateFormSchema),
    });

    const [provinceSelectList, setProvinceSelectList] = useState<
        SelectOption[]
    >([]);
    const [districtSelectList, setDistrictSelectList] = useState<
        DistrictSelectOption[]
    >([]);
    const [officeSelectList, setOfficeSelectList] = useState<SelectOption[]>(
        [],
    );
    const [departmentSelectList, setDepartmentSelectList] = useState<
        SelectOption[]
    >([]);
    const [jobTypeSelectList, setJobTypeSelectList] = useState<SelectOption[]>(
        [],
    );
    const [jobLevelSelectList, setJobLevelSelectList] = useState<
        SelectOption[]
    >([]);
    const [jobTitleSelectList, setJobTitleSelectList] = useState<
        SelectOption[]
    >([]);

    const createApi = useCreateApi<EmployeeRequest, EmployeeResponse>(
        EmployeeConfigs.resourceUrl,
    );

    // Lấy dữ liệu province
    const { data: provinceData, isLoading: isProvincesLoading } =
        useGetAllApi<ProvinceResponse>(
            ProvinceConfigs.resourceUrl,
            ProvinceConfigs.resourceKey,
            { all: 1 },
            undefined,
            {
                refetchOnWindowFocus: false,
                staleTime: 300000, // Cache trong 5 phút
                queryKey: ["provinces-all"],
            },
        );

    // Lấy dữ liệu district
    const { data: districtData, isLoading: isDistrictsLoading } =
        useGetAllApi<DistrictResponse>(
            DistrictConfigs.resourceUrl,
            DistrictConfigs.resourceKey,
            { all: 1 },
            undefined,
            {
                refetchOnWindowFocus: false,
                staleTime: 300000,
                queryKey: ["districts-all"],
            },
        );

    // Lấy dữ liệu office
    const { data: officeData, isLoading: isOfficesLoading } =
        useGetAllApi<OfficeResponse>(
            OfficeConfigs.resourceUrl,
            OfficeConfigs.resourceKey,
            { all: 1 },
            undefined,
            {
                refetchOnWindowFocus: false,
                staleTime: 300000,
                queryKey: ["offices-all"],
            },
        );

    // Lấy dữ liệu department
    const { data: departmentData, isLoading: isDepartmentsLoading } =
        useGetAllApi<DepartmentResponse>(
            DepartmentConfigs.resourceUrl,
            DepartmentConfigs.resourceKey,
            { all: 1 },
            undefined,
            {
                refetchOnWindowFocus: false,
                staleTime: 300000,
                queryKey: ["departments-all"],
            },
        );

    // Lấy dữ liệu job type
    const { data: jobTypeData, isLoading: isJobTypesLoading } =
        useGetAllApi<JobTypeResponse>(
            JobTypeConfigs.resourceUrl,
            JobTypeConfigs.resourceKey,
            { all: 1 },
            undefined,
            {
                refetchOnWindowFocus: false,
                staleTime: 300000,
                queryKey: ["job-types-all"],
            },
        );

    // Lấy dữ liệu job level
    const { data: jobLevelData, isLoading: isJobLevelsLoading } =
        useGetAllApi<JobLevelResponse>(
            JobLevelConfigs.resourceUrl,
            JobLevelConfigs.resourceKey,
            { all: 1 },
            undefined,
            {
                refetchOnWindowFocus: false,
                staleTime: 300000,
                queryKey: ["job-levels-all"],
            },
        );

    // Lấy dữ liệu job title
    const { data: jobTitleData, isLoading: isJobTitlesLoading } =
        useGetAllApi<JobTitleResponse>(
            JobTitleConfigs.resourceUrl,
            JobTitleConfigs.resourceKey,
            { all: 1 },
            undefined,
            {
                refetchOnWindowFocus: false,
                staleTime: 300000,
                queryKey: ["job-titles-all"],
            },
        );

    // Xử lý dữ liệu provinces khi fetch thành công
    useEffect(() => {
        if (provinceData && provinceData.content) {
            const selectList: SelectOption[] = provinceData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setProvinceSelectList(selectList);
        }
    }, [provinceData]);

    // Xử lý dữ liệu districts khi fetch thành công
    useEffect(() => {
        if (districtData && districtData.content) {
            const selectList: DistrictSelectOption[] = districtData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                    provinceId: item.province ? String(item.province.id) : "",
                }),
            );
            setDistrictSelectList(selectList);
        }
    }, [districtData]);

    // Xử lý dữ liệu offices khi fetch thành công
    useEffect(() => {
        if (officeData && officeData.content) {
            const selectList: SelectOption[] = officeData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setOfficeSelectList(selectList);
        }
    }, [officeData]);

    // Xử lý dữ liệu departments khi fetch thành công
    useEffect(() => {
        if (departmentData && departmentData.content) {
            const selectList: SelectOption[] = departmentData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setDepartmentSelectList(selectList);
        }
    }, [departmentData]);

    // Xử lý dữ liệu job types khi fetch thành công
    useEffect(() => {
        if (jobTypeData && jobTypeData.content) {
            const selectList: SelectOption[] = jobTypeData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setJobTypeSelectList(selectList);
        }
    }, [jobTypeData]);

    // Xử lý dữ liệu job levels khi fetch thành công
    useEffect(() => {
        if (jobLevelData && jobLevelData.content) {
            const selectList: SelectOption[] = jobLevelData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setJobLevelSelectList(selectList);
        }
    }, [jobLevelData]);

    // Xử lý dữ liệu job titles khi fetch thành công
    useEffect(() => {
        if (jobTitleData && jobTitleData.content) {
            const selectList: SelectOption[] = jobTitleData.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setJobTitleSelectList(selectList);
        }
    }, [jobTitleData]);

    const handleProvinceChange = (provinceId: string | null) => {
        form.setFieldValue("user.address.provinceId", provinceId);
        form.setFieldValue("user.address.districtId", null);
    };

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: EmployeeRequest = {
            user: {
                username: formValues["user.username"],
                password: formValues["user.password"],
                fullname: formValues["user.fullname"],
                email: formValues["user.email"],
                phone: formValues["user.phone"],
                gender: formValues["user.gender"],
                address: {
                    line: formValues["user.address.line"],
                    provinceId: Number(formValues["user.address.provinceId"]),
                    districtId: Number(formValues["user.address.districtId"]),
                    wardId: null,
                },
                avatar: formValues["user.avatar"].trim() || null,
                status: Number(formValues["user.status"]),
                roles: [{ id: EmployeeConfigs.EMPLOYEE_ROLE_ID }],
            },
            officeId: Number(formValues.officeId),
            departmentId: Number(formValues.departmentId),
            jobTypeId: Number(formValues.jobTypeId),
            jobLevelId: Number(formValues.jobLevelId),
            jobTitleId: Number(formValues.jobTitleId),
        };
        createApi.mutate(requestBody);
    });

    const handleReset = () => {
        form.reset();
    };

    const userGenderSelectList: SelectOption[] = [
        {
            value: "M",
            label: "Nam",
        },
        {
            value: "F",
            label: "Nữ",
        },
    ];

    const userStatusSelectList: SelectOption[] = [
        {
            value: "1",
            label: "Đã kích hoạt",
        },
        {
            value: "2",
            label: "Chưa kích hoạt",
        },
    ];

    const userRoleSelectList: SelectOption[] = [
        {
            value: String(EmployeeConfigs.EMPLOYEE_ROLE_ID),
            label: "Nhân viên",
        },
    ];

    // Kiểm tra trạng thái loading tổng thể
    const isLoading =
        isProvincesLoading ||
        isDistrictsLoading ||
        isOfficesLoading ||
        isDepartmentsLoading ||
        isJobTypesLoading ||
        isJobLevelsLoading ||
        isJobTitlesLoading;

    return {
        form,
        handleFormSubmit,
        handleReset,
        handleProvinceChange,
        userGenderSelectList,
        provinceSelectList,
        districtSelectList,
        userStatusSelectList,
        userRoleSelectList,
        officeSelectList,
        departmentSelectList,
        jobTypeSelectList,
        jobLevelSelectList,
        jobTitleSelectList,
        isLoading,
        createStatus: createApi.status,
    };
}

export default useEmployeeCreateViewModel;
