import { useState, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";
import UnitConfigs from "@/app/admin/product/unit/UnitConfigs";
import { UnitRequest, UnitResponse } from "@/models/Unit";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import { SelectOption } from "@/datas/SelectOption";

function useUnitUpdateViewModel(id: number) {
    // Sử dụng useRef để theo dõi việc khởi tạo form
    const initialized = useRef(false);

    const form = useForm({
        initialValues: UnitConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(UnitConfigs.createUpdateFormSchema),
    });

    const [unit, setUnit] = useState<UnitResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<UnitRequest, UnitResponse>(
        UnitConfigs.resourceUrl,
        UnitConfigs.resourceKey,
        id,
    );

    // Thay thế callback bằng cách lấy data trực tiếp
    const { data: unitResponse, isLoading } = useGetByIdApi<UnitResponse>(
        UnitConfigs.resourceUrl,
        UnitConfigs.resourceKey,
        id,
        undefined, // Loại bỏ callback
    );

    // Xử lý dữ liệu khi nó thay đổi thông qua useEffect
    useEffect(() => {
        if (unitResponse && !initialized.current) {
            setUnit(unitResponse);
            const formValues: typeof form.values = {
                name: unitResponse.name,
                status: String(unitResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
            initialized.current = true;
        }
    }, [unitResponse, form]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: UnitRequest = {
                name: formValues.name,
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
        unit,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        updateStatus: updateApi.status,
    };
}

export default useUnitUpdateViewModel;
