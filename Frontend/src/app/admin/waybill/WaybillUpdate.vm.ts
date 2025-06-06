import { useState, useEffect } from "react"; // Thêm useEffect
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useGetByIdApi from "@/hooks/use-get-by-id-api";
import useUpdateApi from "@/hooks/use-update-api";
import {
    WaybillResponse,
    WaybillRequest,
    RequiredNote,
} from "@/models/Waybill";
import MiscUtils from "@/utils/MiscUtils";
import WaybillConfigs from "./WaybillConfigs";

function useWaybillUpdateViewModel(id: number) {
    const form = useForm({
        initialValues: WaybillConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(WaybillConfigs.createUpdateFormSchema),
    });

    const [waybill, setWaybill] = useState<WaybillResponse>();
    const [prevFormValues, setPrevFormValues] = useState<typeof form.values>();

    const updateApi = useUpdateApi<WaybillRequest, WaybillResponse>(
        WaybillConfigs.resourceUrl,
        WaybillConfigs.resourceKey,
        id,
    );

    // Thay đổi: Lấy dữ liệu trực tiếp thay vì qua callback
    const { data: waybillResponse } = useGetByIdApi<WaybillResponse>(
        WaybillConfigs.resourceUrl,
        WaybillConfigs.resourceKey,
        id,
    );

    // Thêm: useEffect để xử lý dữ liệu khi có phản hồi
    useEffect(() => {
        if (waybillResponse) {
            setWaybill(waybillResponse);
            const formValues: typeof form.values = {
                orderId: String(waybillResponse.order.id), // Không sử dụng thực tế
                shippingDate: new Date(waybillResponse.shippingDate), // Không sử dụng thực tế
                weight: waybillResponse.weight, // Không sử dụng thực tế
                length: waybillResponse.length, // Không sử dụng thực tế
                width: waybillResponse.width, // Không sử dụng thực tế
                height: waybillResponse.height, // Không sử dụng thực tế
                note: waybillResponse.note || "",
                ghnRequiredNote: waybillResponse.ghnRequiredNote,
            };
            form.setValues(formValues);
            setPrevFormValues(formValues);
        }
    }, [waybillResponse]); // Removed form from dependencies to prevent infinite updates

    const handleFormSubmit = form.onSubmit((formValues) => {
        setPrevFormValues(formValues);
        if (!MiscUtils.isEquals(formValues, prevFormValues)) {
            const requestBody: WaybillRequest = {
                orderId: Number(formValues.orderId),
                shippingDate: formValues.shippingDate.toISOString(),
                weight: formValues.weight,
                length: formValues.length,
                width: formValues.width,
                height: formValues.height,
                note: formValues.note.trim() || null,
                ghnRequiredNote: formValues.ghnRequiredNote,
            };
            updateApi.mutate(requestBody);
        }
    });

    const ghnRequiredNoteSelectList: SelectOption[] = [
        {
            value: RequiredNote.CHOTHUHANG,
            label: WaybillConfigs.ghnRequiredNoteMap[RequiredNote.CHOTHUHANG],
        },
        {
            value: RequiredNote.CHOXEMHANGKHONGTHU,
            label: WaybillConfigs.ghnRequiredNoteMap[
                RequiredNote.CHOXEMHANGKHONGTHU
            ],
        },
        {
            value: RequiredNote.KHONGCHOXEMHANG,
            label: WaybillConfigs.ghnRequiredNoteMap[
                RequiredNote.KHONGCHOXEMHANG
            ],
        },
    ];

    return {
        waybill,
        form,
        handleFormSubmit,
        ghnRequiredNoteSelectList,
    };
}

export default useWaybillUpdateViewModel;
