import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation, useQueryClient } from "react-query";

function useDeleteByIdsApi<T = number>(
    resourceUrl: string,
    resourceKey: string,
) {
    const queryClient = useQueryClient();

    return useMutation<void, ErrorMessage, T[]>(
        (entityIds) => FetchUtils.deleteByIds(resourceUrl, entityIds),
        {
            onSuccess: () => {
                NotifyUtils.simpleSuccess("Xóa thành công");
                void queryClient.invalidateQueries([resourceKey, "getAll"]);
            },
            onError: () => NotifyUtils.simpleFailed("Xóa không thành công"),
        },
    );
}

export default useDeleteByIdsApi;
