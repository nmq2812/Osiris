import { useState, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { BrandResponse, BrandRequest } from "@/models/Brand";
import MiscUtils from "@/utils/MiscUtils";
import BrandConfigs from "./BrandConfigs";

function useBrandUpdateViewModel(id: number) {
    // Sử dụng useRef để theo dõi việc form đã được khởi tạo hay chưa
    const initialized = useRef(false);

    const form = useForm({
        initialValues: BrandConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(BrandConfigs.createUpdateFormSchema),
    });

    const [brand, setBrand] = useState<BrandResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<BrandRequest, BrandResponse>(
        BrandConfigs.resourceUrl,
        BrandConfigs.resourceKey,
        id,
    );

    // Cấu hình options cho API call
    const { data: brandResponse } = useGetByIdApi<BrandResponse>(
        BrandConfigs.resourceUrl,
        BrandConfigs.resourceKey,
        id,
        undefined,
    );

    // Xử lý dữ liệu khi nó thay đổi thông qua useEffect
    useEffect(() => {
        if (brandResponse && !initialized.current) {
            setBrand(brandResponse);
            const formValues: typeof form.values = {
                name: brandResponse.name,
                code: brandResponse.code,
                description: brandResponse.description || "",
                status: String(brandResponse.status),
            };

            // Cập nhật form và prevFormValues một lần duy nhất khi có data
            form.setValues(formValues);
            setPrevFormValues(formValues);
            initialized.current = true;
        }
    }, [brandResponse]); // Loại bỏ form khỏi dependencies

    const handleFormSubmit = form.onSubmit((formValues) => {
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            setPrevFormValues(formValues);
            const requestBody: BrandRequest = {
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
        brand,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading: !brandResponse,
        updateStatus: updateApi.status,
    };
}

export default useBrandUpdateViewModel;
