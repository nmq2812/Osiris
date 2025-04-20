"use client";
import { EntityPropertySchema } from "@/datas/EntityProperty";
import useFilterPanelStore from "@/stores/use-filter-panel-store";
import { useEffect } from "react";

function useInitFilterPanelState(properties: EntityPropertySchema) {
    const { initFilterPanelState } = useFilterPanelStore();

    useEffect(() => {
        initFilterPanelState(properties);
    }, [initFilterPanelState, properties]);
}

export default useInitFilterPanelState;
