import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { DistrictSelectOption, SelectOption } from "@/datas/SelectOption";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useGetAllApi from "@/hooks/use-get-all-api";
import MiscUtils from "@/utils/MiscUtils";

import { EmployeeRequest, EmployeeResponse } from "@/models/Employee";
import { ProvinceResponse } from "@/models/Province";
import { DistrictResponse } from "@/models/District";
import { OfficeResponse } from "@/models/Office";
import { DepartmentResponse } from "@/models/Department";
import { JobTypeResponse } from "@/models/JobType";
import { JobLevelResponse } from "@/models/JobLevel";
import { JobTitleResponse } from "@/models/JobTitle";

import EmployeeConfigs from "./EmployeeConfigs";
import DistrictConfigs from "../address/district/DistrictConfigs";
import ProvinceConfigs from "../address/province/ProvinceConfigs";
import DepartmentConfigs from "./department/DepartmentConfigs";
import JobLevelConfigs from "./job-level/JobLevelConfigs";
import JobTitleConfigs from "./job-title/JobTitleConfigs";
import JobTypeConfigs from "./job-type/JobTypeConfigs";
import OfficeConfigs from "./office/OfficeConfigs";

function useEmployeeUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: EmployeeConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(EmployeeConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();
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

    const updateApi = useUpdateApi<EmployeeRequest, EmployeeResponse>(
        EmployeeConfigs.resourceUrl,
        EmployeeConfigs.resourceKey,
        id,
    );

    // Fetch employee data
    const {
        data: employee,
        isLoading: isEmployeeLoading,
        isError: isEmployeeError,
    } = useGetByIdApi<EmployeeResponse>(
        EmployeeConfigs.resourceUrl,
        EmployeeConfigs.resourceKey,
        id,
        (employeeResponse) => {
            if (!employeeResponse) return;

            const formValues = {
                "user.username": employeeResponse.user.username,
                "user.password": "",
                "user.fullname": employeeResponse.user.fullname,
                "user.email": employeeResponse.user.email,
                "user.phone": employeeResponse.user.phone,
                "user.gender": employeeResponse.user.gender,
                "user.address.line": employeeResponse.user.address.line || "",
                "user.address.provinceId": employeeResponse.user.address
                    .province
                    ? String(employeeResponse.user.address.province.id)
                    : null,
                "user.address.districtId": employeeResponse.user.address
                    .district
                    ? String(employeeResponse.user.address.district.id)
                    : null,
                "user.avatar": employeeResponse.user.avatar || "",
                "user.status": String(employeeResponse.user.status),
                "user.roles": [String(EmployeeConfigs.EMPLOYEE_ROLE_ID)],
                officeId: String(employeeResponse.office.id),
                departmentId: String(employeeResponse.department.id),
                jobTypeId: String(employeeResponse.jobType.id),
                jobLevelId: String(employeeResponse.jobLevel.id),
                jobTitleId: String(employeeResponse.jobTitle.id),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        },
        {
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`employee-${id}`],
        },
    );

    // Fetch provinces
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

    // Fetch districts
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

    // Fetch offices
    const officesQuery = useGetAllApi<OfficeResponse>(
        OfficeConfigs.resourceUrl,
        OfficeConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["offices-all"],
        },
    );

    // Fetch departments
    const departmentsQuery = useGetAllApi<DepartmentResponse>(
        DepartmentConfigs.resourceUrl,
        DepartmentConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["departments-all"],
        },
    );

    // Fetch job types
    const jobTypesQuery = useGetAllApi<JobTypeResponse>(
        JobTypeConfigs.resourceUrl,
        JobTypeConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["job-types-all"],
        },
    );

    // Fetch job levels
    const jobLevelsQuery = useGetAllApi<JobLevelResponse>(
        JobLevelConfigs.resourceUrl,
        JobLevelConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["job-levels-all"],
        },
    );

    // Fetch job titles
    const jobTitlesQuery = useGetAllApi<JobTitleResponse>(
        JobTitleConfigs.resourceUrl,
        JobTitleConfigs.resourceKey,
        { all: 1 },
        undefined,
        {
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: ["job-titles-all"],
        },
    );

    // Update province select list when data changes
    useEffect(() => {
        if (provincesQuery.data) {
            const selectList: SelectOption[] = provincesQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setProvinceSelectList(selectList);
        }
    }, [provincesQuery.data]);

    // Update district select list when data changes
    useEffect(() => {
        if (districtsQuery.data) {
            const selectList: DistrictSelectOption[] =
                districtsQuery.data.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                    provinceId: item.province ? String(item.province.id) : "",
                }));
            setDistrictSelectList(selectList);
        }
    }, [districtsQuery.data]);

    // Update office select list when data changes
    useEffect(() => {
        if (officesQuery.data) {
            const selectList: SelectOption[] = officesQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setOfficeSelectList(selectList);
        }
    }, [officesQuery.data]);

    // Update department select list when data changes
    useEffect(() => {
        if (departmentsQuery.data) {
            const selectList: SelectOption[] =
                departmentsQuery.data.content.map((item) => ({
                    value: String(item.id),
                    label: item.name,
                }));
            setDepartmentSelectList(selectList);
        }
    }, [departmentsQuery.data]);

    // Update job type select list when data changes
    useEffect(() => {
        if (jobTypesQuery.data) {
            const selectList: SelectOption[] = jobTypesQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setJobTypeSelectList(selectList);
        }
    }, [jobTypesQuery.data]);

    // Update job level select list when data changes
    useEffect(() => {
        if (jobLevelsQuery.data) {
            const selectList: SelectOption[] = jobLevelsQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setJobLevelSelectList(selectList);
        }
    }, [jobLevelsQuery.data]);

    // Update job title select list when data changes
    useEffect(() => {
        if (jobTitlesQuery.data) {
            const selectList: SelectOption[] = jobTitlesQuery.data.content.map(
                (item) => ({
                    value: String(item.id),
                    label: item.name,
                }),
            );
            setJobTitleSelectList(selectList);
        }
    }, [jobTitlesQuery.data]);

    // Filter districts when province changes
    useEffect(() => {
        if (form.values["user.address.provinceId"] && districtsQuery.data) {
            const filteredDistricts = districtsQuery.data.content
                .filter(
                    (district) =>
                        district.province &&
                        String(district.province.id) ===
                            form.values["user.address.provinceId"],
                )
                .map((item) => ({
                    value: String(item.id),
                    label: item.name,
                    provinceId: String(item.province.id),
                }));

            setDistrictSelectList(filteredDistricts);
        }
    }, [form.values["user.address.provinceId"], districtsQuery.data]);

    const handleProvinceChange = (provinceId: string | null) => {
        form.setFieldValue("user.address.provinceId", provinceId);
        form.setFieldValue("user.address.districtId", null);
    };

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: EmployeeRequest = {
                user: {
                    username: formValues["user.username"],
                    password: formValues["user.password"] || null,
                    fullname: formValues["user.fullname"],
                    email: formValues["user.email"],
                    phone: formValues["user.phone"],
                    gender: formValues["user.gender"],
                    address: {
                        line: formValues["user.address.line"],
                        provinceId: Number(
                            formValues["user.address.provinceId"],
                        ),
                        districtId: Number(
                            formValues["user.address.districtId"],
                        ),
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

            updateApi.mutate(requestBody);
        }
    });

    const handleReset = () => {
        if (prevFormValues) {
            form.setValues(prevFormValues);
        }
    };

    const userGenderSelectList: SelectOption[] = [
        { value: "M", label: "Nam" },
        { value: "F", label: "Nữ" },
    ];

    const userStatusSelectList: SelectOption[] = [
        { value: "1", label: "Đã kích hoạt" },
        { value: "2", label: "Chưa kích hoạt" },
    ];

    const userRoleSelectList: SelectOption[] = [
        { value: String(EmployeeConfigs.EMPLOYEE_ROLE_ID), label: "Nhân viên" },
    ];

    const isSubmitDisabled = MiscUtils.isEquals(form.values, prevFormValues);

    // Determine overall loading state
    const isLoading =
        isEmployeeLoading ||
        provincesQuery.isLoading ||
        districtsQuery.isLoading ||
        officesQuery.isLoading ||
        departmentsQuery.isLoading ||
        jobTypesQuery.isLoading ||
        jobLevelsQuery.isLoading ||
        jobTitlesQuery.isLoading;

    // Determine overall error state
    const isError =
        isEmployeeError ||
        provincesQuery.isError ||
        districtsQuery.isError ||
        officesQuery.isError ||
        departmentsQuery.isError ||
        jobTypesQuery.isError ||
        jobLevelsQuery.isError ||
        jobTitlesQuery.isError;

    return {
        employee,
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
        isSubmitDisabled,
        isLoading,
        isError,
        updateStatus: updateApi.status,
    };
}

export default useEmployeeUpdateViewModel;
