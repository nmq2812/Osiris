import useAppStore from "@/stores/use-app-store";
import FetchUtils, {
    RequestParams,
    ListResponse,
    ErrorMessage,
} from "@/utils/FetchUtils";
import FilterUtils from "@/utils/FilterUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

function useGetAllApi<O>(
    resourceUrl: string,
    resourceKey: string,
    requestParams?: RequestParams,
    successCallback?: (data: ListResponse<O>) => void,
    options?: UseQueryOptions<ListResponse<O>, ErrorMessage>,
) {
    const { activePage, activePageSize, activeFilter, searchToken } =
        useAppStore();

    if (!requestParams) {
        requestParams = {
            page: activePage,
            size: activePageSize,
            sort: FilterUtils.convertToSortRSQL(activeFilter),
            filter: FilterUtils.convertToFilterRSQL(activeFilter),
            search: searchToken,
        };
    }

    const queryKey = [resourceKey, "getAll", requestParams];

    return useQuery<ListResponse<O>, ErrorMessage>({
        queryKey: queryKey,
        queryFn: () => FetchUtils.getAll<O>(resourceUrl, requestParams),

        keepPreviousData: true,
        onSuccess: successCallback,
        onError: (error: { statusCode: any }) =>
            NotifyUtils.simpleFailed(
                `Lỗi ${
                    error.statusCode || "chưa biết"
                }: Lấy dữ liệu không thành công`,
            ),
        ...options,
    } as UseQueryOptions<ListResponse<O>, ErrorMessage>);
}

export default useGetAllApi;
