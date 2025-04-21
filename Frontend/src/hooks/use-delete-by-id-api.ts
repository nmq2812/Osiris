import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useDeleteByIdApi<T = number>(
    resourceUrl: string,
    resourceKey: string,
) {
    const queryClient = useQueryClient();

    return useMutation<void, ErrorMessage, T>({
        mutationFn: (entityId) => FetchUtils.deleteById(resourceUrl, entityId),

        onSuccess: () => {
            NotifyUtils.simpleSuccess("Xóa thành công");
            void queryClient.invalidateQueries({
                queryKey: [resourceKey, "getAll"],
            });
        },
        onError: () => NotifyUtils.simpleFailed("Xóa không thành công"),
    });
}

export default useDeleteByIdApi;
