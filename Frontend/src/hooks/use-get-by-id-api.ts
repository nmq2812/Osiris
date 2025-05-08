import { QueryKey } from "./../../node_modules/@tanstack/query-core/src/types";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";

// ✅ Sử dụng đúng package mới
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

function useGetByIdApi<O>(
    resourceUrl: string,
    resourceKey: string,
    entityId: number,
    successCallback?: (data: O) => void,
    options?: UseQueryOptions<O, ErrorMessage, O, QueryKey>,
) {
    return useQuery<O, ErrorMessage, O, QueryKey>({
        queryKey: [resourceKey, "getById", entityId],
        queryFn: () => FetchUtils.getById<O>(resourceUrl, entityId),
        onSuccess: successCallback,
        onError: () => NotifyUtils.simpleFailed("Lấy dữ liệu không thành công"),
        ...options,
    } as UseQueryOptions<O, ErrorMessage, O, QueryKey>);
}
export default useGetByIdApi;
