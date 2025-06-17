import { useState, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";
import GuaranteeConfigs from "@/app/admin/product/guarantee/GuaranteeConfigs";
import { GuaranteeRequest, GuaranteeResponse } from "@/models/Guarantee";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import { SelectOption } from "@/datas/SelectOption";

function useGuaranteeUpdateViewModel(id: number) {
    // Sử dụng useRef để theo dõi việc khởi tạo form
    const initialized = useRef(false);

    const form = useForm({
        initialValues: GuaranteeConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(GuaranteeConfigs.createUpdateFormSchema),
    });

    const [guarantee, setGuarantee] = useState<GuaranteeResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<GuaranteeRequest, GuaranteeResponse>(
        GuaranteeConfigs.resourceUrl,
        GuaranteeConfigs.resourceKey,
        id,
    );

    // Thay thế callback bằng cách lấy data trực tiếp
    const { data: guaranteeResponse, isLoading } =
        useGetByIdApi<GuaranteeResponse>(
            GuaranteeConfigs.resourceUrl,
            GuaranteeConfigs.resourceKey,
            id,
            undefined, // Loại bỏ callback
        );

    // Xử lý dữ liệu khi nó thay đổi thông qua useEffect
    useEffect(() => {
        if (guaranteeResponse && !initialized.current) {
            setGuarantee(guaranteeResponse);
            const formValues: typeof form.values = {
                name: guaranteeResponse.name,
                description: guaranteeResponse.description || "",
                status: String(guaranteeResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
            initialized.current = true;
        }
    }, [guaranteeResponse, form]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: GuaranteeRequest = {
                name: formValues.name,
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
        guarantee,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        updateStatus: updateApi.status,
    };
}

export default useGuaranteeUpdateViewModel;
