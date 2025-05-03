import { useState, useEffect, useRef } from "react";
import { useForm, zodResolver } from "@mantine/form";
import TagConfigs from "@/app/admin/product/tag/TagConfigs";
import { TagRequest, TagResponse } from "@/models/Tag";
import useUpdateApi from "@/hooks/use-update-api";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import MiscUtils from "@/utils/MiscUtils";
import { SelectOption } from "@/datas/SelectOption";

function useTagUpdateViewModel(id: number) {
    // Sử dụng useRef để theo dõi việc khởi tạo form
    const initialized = useRef(false);

    const form = useForm({
        initialValues: TagConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(TagConfigs.createUpdateFormSchema),
    });

    const [tag, setTag] = useState<TagResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<TagRequest, TagResponse>(
        TagConfigs.resourceUrl,
        TagConfigs.resourceKey,
        id,
    );

    // Thay thế callback bằng cách lấy data trực tiếp
    const { data: tagResponse, isLoading } = useGetByIdApi<TagResponse>(
        TagConfigs.resourceUrl,
        TagConfigs.resourceKey,
        id,
        undefined, // Loại bỏ callback
    );

    // Xử lý dữ liệu khi nó thay đổi thông qua useEffect
    useEffect(() => {
        if (tagResponse && !initialized.current) {
            setTag(tagResponse);
            const formValues: typeof form.values = {
                name: tagResponse.name,
                slug: tagResponse.slug,
                status: String(tagResponse.status),
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
            initialized.current = true;
        }
    }, [tagResponse, form]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: TagRequest = {
                name: formValues.name,
                slug: formValues.slug,
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
        tag,
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isLoading,
        updateStatus: updateApi.status,
    };
}

export default useTagUpdateViewModel;
