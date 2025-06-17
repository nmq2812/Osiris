import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useUpdateApi<I, O>(
    resourceUrl: string,
    resourceKey: string,
    entityId: number,
) {
    const queryClient = useQueryClient();

    return useMutation<O, ErrorMessage, I>({
        mutationFn: (requestBody) =>
            FetchUtils.update<I, O>(resourceUrl, entityId, requestBody),

        onSuccess: () => {
            NotifyUtils.simpleSuccess("Cập nhật thành công");
            void queryClient.invalidateQueries({
                queryKey: [resourceKey, "getById", entityId],
            });
            void queryClient.invalidateQueries({
                queryKey: [resourceKey, "getAll"],
            });
        },
        onError: () => NotifyUtils.simpleFailed("Cập nhật không thành công"),
    });
}

export default useUpdateApi;
