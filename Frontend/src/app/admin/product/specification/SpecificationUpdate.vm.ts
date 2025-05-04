import { useState, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";
import SpecificationConfigs from "@/app/admin/product/specification/SpecificationConfigs";
import {
    SpecificationRequest,
    SpecificationResponse,
} from "@/models/Specification";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import { SelectOption } from "@/datas/SelectOption";

function useSpecificationUpdateViewModel(id: number) {
    // Sử dụng useRef để theo dõi việc khởi tạo form
    const initialized = useRef(false);

    const form = useForm({
        initialValues: SpecificationConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(SpecificationConfigs.createUpdateFormSchema),
    });

    const [specification, setSpecification] = useState<SpecificationResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<SpecificationRequest, SpecificationResponse>(
        SpecificationConfigs.resourceUrl,
        SpecificationConfigs.resourceKey,
        id,
    );

    // Thay thế callback bằng cách lấy data trực tiếp
    const { data: specificationResponse, isLoading } =
        useGetByIdApi<SpecificationResponse>(
            SpecificationConfigs.resourceUrl,
            SpecificationConfigs.resourceKey,
            id,
            undefined, // Loại bỏ callback
        );

    // Xử lý dữ liệu khi nó thay đổi thông qua useEffect
    useEffect(() => {
        if (specificationResponse && !initialized.current) {
            setSpecification(specificationResponse);
            const formValues: typeof form.values = {
                name: specificationResponse.name,
                code: specificationResponse.code,
                description: specificationResponse.description || "",
                status: String(specificationResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
            initialized.current = true;
        }
    }, [specificationResponse, form]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: SpecificationRequest = {
                name: formValues.name,
                code: formValues.code,
                description: formValues.description || null,
                status: Number(formValues.status),
            };
            updateApi.mutate(requestBody);
        }
    });

    const handleReset = () => {
        if (prevFormValues) {
            form.setValues(prevFormValues);
        }
    };

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
        specification,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        updateStatus: updateApi.status,
    };
}

export default useSpecificationUpdateViewModel;
