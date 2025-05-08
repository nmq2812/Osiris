import { useState, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";
import PropertyConfigs from "@/app/admin/product/property/PropertyConfigs";
import { PropertyRequest, PropertyResponse } from "@/models/Property";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import { SelectOption } from "@/datas/SelectOption";

function usePropertyUpdateViewModel(id: number) {
    // Sử dụng useRef để theo dõi việc khởi tạo form
    const initialized = useRef(false);

    const form = useForm({
        initialValues: PropertyConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(PropertyConfigs.createUpdateFormSchema),
    });

    const [property, setProperty] = useState<PropertyResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<PropertyRequest, PropertyResponse>(
        PropertyConfigs.resourceUrl,
        PropertyConfigs.resourceKey,
        id,
    );

    // Thay thế callback bằng cách lấy data trực tiếp
    const { data: propertyResponse, isLoading } =
        useGetByIdApi<PropertyResponse>(
            PropertyConfigs.resourceUrl,
            PropertyConfigs.resourceKey,
            id,
            undefined, // Loại bỏ callback
        );

    // Xử lý dữ liệu khi nó thay đổi thông qua useEffect
    useEffect(() => {
        if (propertyResponse && !initialized.current) {
            setProperty(propertyResponse);
            const formValues: typeof form.values = {
                name: propertyResponse.name,
                code: propertyResponse.code,
                description: propertyResponse.description || "",
                status: String(propertyResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
            initialized.current = true;
        }
    }, [propertyResponse, form]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: PropertyRequest = {
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
        property,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        updateStatus: updateApi.status,
    };
}

export default usePropertyUpdateViewModel;
