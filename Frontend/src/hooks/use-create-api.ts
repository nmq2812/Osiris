import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation } from "@tanstack/react-query";

function useCreateApi<I, O>(resourceUrl: string) {
    return useMutation<O, ErrorMessage, I>({
        mutationFn: (requestBody) =>
            FetchUtils.create<I, O>(resourceUrl, requestBody),

        onSuccess: () => NotifyUtils.simpleSuccess("Tạo thành công"),
        onError: () => NotifyUtils.simpleFailed("Tạo không thành công"),
    });
}

export default useCreateApi;
