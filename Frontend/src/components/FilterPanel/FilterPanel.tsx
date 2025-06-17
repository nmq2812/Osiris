"use client";
import React, { useRef } from "react";
import { Divider, Paper, Stack } from "@mantine/core";
import useAppStore from "@/stores/use-app-store";
import FilterPanelHeader from "./FilterPanelHeader/FilterPanelHeader";
import FilterPanelHeaderLeft from "./FilterPanelHeaderLeft/FilterPanelHeaderLeft";
import FilterPanelHeaderRight from "./FilterPanelHeaderRight/FilterPanelHeaderRight";
import FilterPanelMain from "./FilterPanelMain/FilterPanelMain";
import FilterPanelMainLeft from "./FilterPanelMainLeft/FilterPanelMainLeft";
import FilterPanelMainRight from "./FilterPanelMainRight/FilterPanelMainRight";

function FilterPanel() {
    const { activeFilterPanel } = useAppStore();

    const filterNameInputRef = useRef<HTMLInputElement | null>(null);

    if (!activeFilterPanel) {
        return null;
    }

    return (
        <Paper shadow="xs">
            <Stack spacing={0}>
                <FilterPanelHeader>
                    <FilterPanelHeaderLeft
                        filterNameInputRef={filterNameInputRef}
                    />
                    <FilterPanelHeaderRight
                        filterNameInputRef={filterNameInputRef}
                    />
                </FilterPanelHeader>

                <Divider />

                <FilterPanelMain>
                    <FilterPanelMainLeft />
                    <FilterPanelMainRight />
                </FilterPanelMain>
            </Stack>
        </Paper>
    );
}

export default React.memo(FilterPanel);
