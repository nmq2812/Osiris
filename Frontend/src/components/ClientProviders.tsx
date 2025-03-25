"use client";

import { ReactNode, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import { ConfigProvider } from "antd";
import viVN from "antd/lib/locale/vi_VN";

// Tạo QueryClient ở đây
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export default function ClientProviders({ children }: { children: ReactNode }) {
    // Sử dụng hook để quản lý colorScheme
    const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

    const toggleColorScheme = (value?: "light" | "dark") => {
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    };

    return (
        <QueryClientProvider client={queryClient}>
            <NotificationsProvider>
                <MantineProvider>
                    <ModalsProvider>
                        <ConfigProvider
                            locale={viVN}
                            theme={{
                                token: {
                                    colorPrimary: "#1890ff",
                                    borderRadius: 6,
                                },
                            }}
                        >
                            {children}
                        </ConfigProvider>
                    </ModalsProvider>
                </MantineProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </NotificationsProvider>
        </QueryClientProvider>
    );
}
