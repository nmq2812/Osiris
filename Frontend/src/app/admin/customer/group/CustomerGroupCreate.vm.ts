import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { SelectOption } from "@/datas/SelectOption";
import useCreateApi from "@/hooks/use-create-api";
import {
    CustomerGroupRequest,
    CustomerGroupResponse,
} from "@/models/CustomerGroup";
import CustomerGroupConfigs from "./CustomerGroupConfigs";

function useCustomerGroupCreateViewModel() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        initialValues: CustomerGroupConfigs.initialCreateUpdateFormValues,
        schema: zodResolver(CustomerGroupConfigs.createUpdateFormSchema),
    });

    const createApi = useCreateApi<CustomerGroupRequest, CustomerGroupResponse>(
        CustomerGroupConfigs.resourceUrl,
    );

    // Theo dõi trạng thái của API create
    useEffect(() => {
        if (createApi.status === "pending" && !isSubmitting) {
            setIsSubmitting(true);
        } else if (createApi.status !== "pending" && isSubmitting) {
            setIsSubmitting(false);

            // Nếu tạo thành công, reset form
            if (createApi.status === "success") {
                handleReset();
            }
        }
    }, [createApi.status, isSubmitting]);

    const handleFormSubmit = form.onSubmit((formValues) => {
        const requestBody: CustomerGroupRequest = {
            code: formValues.code,
            name: formValues.name,
            description: formValues.description,
            color: formValues.color,
            status: Number(formValues.status),
        };
        createApi.mutate(requestBody);
    });

    const handleReset = () => {
        form.reset();
        // Đặt lại các giá trị mặc định
        form.setValues({
            ...CustomerGroupConfigs.initialCreateUpdateFormValues,
            status: "1", // Mặc định là "Có hiệu lực"
            color: "#1890ff", // Mặc định một màu cơ bản
        });
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
        form,
        handleFormSubmit,
        handleReset,
        statusSelectList,
        isSubmitting,
        createStatus: createApi.status,
    };
}

export default useCustomerGroupCreateViewModel;
