import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useDeleteByIdsApi<T = number>(
    resourceUrl: string,
    resourceKey: string,
) {
    const queryClient = useQueryClient();

    return useMutation<void, ErrorMessage, T[]>({
        mutationFn: (entityIds: T[]) =>
            FetchUtils.deleteByIds(resourceUrl, entityIds),
        onSuccess: () => {
            NotifyUtils.simpleSuccess("Xóa thành công");
            void queryClient.invalidateQueries({
                queryKey: [resourceKey, "getAll"],
            });
        },
        onError: () => NotifyUtils.simpleFailed("Xóa không thành công"),
    });
}

export default useDeleteByIdsApi;
