import useFilterPanelStore from "@/stores/use-filter-panel-store";
import { OrderType } from "@/utils/FilterUtils";

function useFilterPanelMainLeftViewModel() {
    const { sortCriteriaList, setSortCriteriaList, sortPropertySelectList } =
        useFilterPanelStore();

    const isDisabledCreateSortCriteriaButton =
        sortCriteriaList.length === sortPropertySelectList.length;

    const handleCreateSortCriteriaButton = () => {
        if (sortCriteriaList.length < sortPropertySelectList.length) {
            setSortCriteriaList((prevState) => [
                ...prevState,
                { property: null, order: OrderType.ASC },
            ]);
        }
    };

    return {
        sortCriteriaList,
        isDisabledCreateSortCriteriaButton,
        handleCreateSortCriteriaButton,
    };
}

export default useFilterPanelMainLeftViewModel;
