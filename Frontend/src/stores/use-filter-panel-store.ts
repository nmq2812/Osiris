"use client";
import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";
import { EntityPropertySchema } from "@/datas/EntityProperty";
import { SelectOption } from "@/datas/SelectOption";
import {
    FilterPropertyTypes,
    SortCriteria,
    FilterCriteria,
} from "@/utils/FilterUtils";
import { extractValue } from "./use-app-store";

interface FilterPanelState {
    initFilterPanelState: (properties: EntityPropertySchema) => void;
    initialPropertySelectList: SelectOption[];
    initialFilterPropertyTypes: FilterPropertyTypes;
    sortCriteriaList: SortCriteria[];
    setSortCriteriaList: Dispatch<SetStateAction<SortCriteria[]>>;
    sortPropertySelectList: SelectOption[];
    setSortPropertySelectList: Dispatch<SetStateAction<SelectOption[]>>;
    filterCriteriaList: FilterCriteria[];
    setFilterCriteriaList: Dispatch<SetStateAction<FilterCriteria[]>>;
    filterPropertySelectList: SelectOption[];
    setFilterPropertySelectList: Dispatch<SetStateAction<SelectOption[]>>;
}

const initialFilterPanelState = {
    initialPropertySelectList: [],
    initialFilterPropertyTypes: {},
    sortCriteriaList: [],
    sortPropertySelectList: [],
    filterCriteriaList: [],
    filterPropertySelectList: [],
};

const useFilterPanelStore = create<FilterPanelState>()(
    devtools(
        (set) => ({
            ...initialFilterPanelState,
            initFilterPanelState: (properties) =>
                set(
                    () => {
                        const initialPropertySelectList: SelectOption[] =
                            Object.keys(properties)
                                .filter(
                                    (property) =>
                                        !properties[property]
                                            .isNotAddToSortCriteria &&
                                        !properties[property]
                                            .isNotAddToFilterCriteria,
                                )
                                .map((property) => ({
                                    value: property,
                                    label: properties[property].label,
                                }));

                        const initialFilterPropertyTypes: FilterPropertyTypes =
                            Object.assign(
                                {},
                                ...Object.keys(properties)
                                    .filter(
                                        (property) =>
                                            !properties[property]
                                                .isNotAddToFilterCriteria,
                                    )
                                    .map((property) => ({
                                        [property]: properties[property].type,
                                    })),
                            );

                        return {
                            ...initialFilterPanelState,
                            initialPropertySelectList:
                                initialPropertySelectList,
                            initialFilterPropertyTypes:
                                initialFilterPropertyTypes,
                            sortPropertySelectList: initialPropertySelectList,
                            filterPropertySelectList: initialPropertySelectList,
                        };
                    },
                    false,
                    "FilterPanelStore/initFilterPanelState",
                ),
            setSortCriteriaList: (value) =>
                set(
                    (state) => extractValue(state, value, "sortCriteriaList"),
                    false,
                    "FilterPanelStore/sortCriteriaList",
                ),
            setSortPropertySelectList: (value) =>
                set(
                    (state) =>
                        extractValue(state, value, "sortPropertySelectList"),
                    false,
                    "FilterPanelStore/sortPropertySelectList",
                ),
            setFilterCriteriaList: (value) =>
                set(
                    (state) => extractValue(state, value, "filterCriteriaList"),
                    false,
                    "FilterPanelStore/filterCriteriaList",
                ),
            setFilterPropertySelectList: (value) =>
                set(
                    (state) =>
                        extractValue(state, value, "filterPropertySelectList"),
                    false,
                    "FilterPanelStore/filterPropertySelectList",
                ),
        }),
        {
            name: "FilterPanelStore",
            anonymousActionType: "FilterPanelStore",
        },
    ),
);

export default createTrackedSelector(useFilterPanelStore);
