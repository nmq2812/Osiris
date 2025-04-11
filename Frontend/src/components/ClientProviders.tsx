"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import { ConfigProvider, App, theme } from "antd";
import viVN from "antd/lib/locale/vi_VN";

// Create QueryClient here
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export default function ClientProviders({ children }: { children: ReactNode }) {
    // Use hook to manage theme
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                locale={viVN}
                theme={{
                    token: {
                        colorPrimary: "#1890ff",
                        borderRadius: 6,
                    },
                    algorithm: isDarkMode
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
                }}
            >
                <App>{children}</App>
            </ConfigProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
