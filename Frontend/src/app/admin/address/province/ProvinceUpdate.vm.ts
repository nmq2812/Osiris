import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import { ProvinceResponse, ProvinceRequest } from "@/models/Province";
import MiscUtils from "@/utils/MiscUtils";
import ProvinceConfigs from "./ProvinceConfigs";

function useProvinceUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: ProvinceConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(ProvinceConfigs.createUpdateFormSchema),
    });

    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    // Cải thiện API mutation call
    const updateApi = useUpdateApi<ProvinceRequest, ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        id,
    );

    // Cải thiện API call lấy thông tin province
    const {
        data: province,
        isLoading,
        isError,
    } = useGetByIdApi<ProvinceResponse>(
        ProvinceConfigs.resourceUrl,
        ProvinceConfigs.resourceKey,
        id,
        (provinceResponse) => {
            if (provinceResponse) {
                const formValues: typeof form.values = {
                    name: provinceResponse.name,
                    code: provinceResponse.code,
                };
                console.log("Province data loaded:", provinceResponse);
                form.setValues(formValues);
                setPrevFormValues(formValues);
            }
        },
        {
            // Thêm options quan trọng
            enabled: id > 0,
            refetchOnWindowFocus: false,
            staleTime: 30000,
            queryKey: [`province-${id}`],
        },
    );

    // Cải thiện hàm xử lý submit form
    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);

        // Kiểm tra dữ liệu có thay đổi không
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: ProvinceRequest = {
                name: formValues.name,
                code: formValues.code,
            };

            console.log("Submitting province data:", requestBody);
            updateApi.mutate(requestBody, {
                onSuccess: (response) => {
                    console.log("Province updated successfully:", response);
                    // Có thể thêm thông báo thành công ở đây
                },
                onError: (error) => {
                    console.error("Error updating province:", error);
                    // Có thể thêm xử lý lỗi ở đây
                },
            });
        } else {
            console.log("No changes detected, skipping update");
        }
    });

    // Thêm hàm reset form
    const handleReset = () => {
        if (province) {
            form.setValues({
                name: province.name,
                code: province.code,
            });
            console.log("Form reset to original values");
        } else {
            form.reset();
            console.log("Form reset to default values");
        }
    };

    // Thêm hàm kiểm tra có thể submit không
    const isSubmitDisabled = MiscUtils.isEquals(form.values, prevFormValues);

    return {
        province,
        form,
        handleFormSubmit,
        handleReset,
        isLoading,
        isError,
        isSubmitDisabled,
    };
}

export default useProvinceUpdateViewModel;
