"use client";
// filepath: d:\Osiris\Frontend\src\components\providers\MantineProviders.tsx

import { Key, ReactNode, useState } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import type { ColorScheme } from "@mantine/core";
import createCache from "@emotion/cache";

// Tạo emotion cache cho server-side rendering
const createEmotionCacheForSSR = () => {
    let cache = createCache({ key: "mantine" });
    cache.compat = true;
    const { sheet, inserted } = cache;

    // Reset cache sau mỗi render để tránh leak
    const serialized: string[] = [];
    return {
        cache,
        flush: () => {
            sheet.flush();
            return serialized;
        },
    };
};

export default function MantineProviders({
    children,
}: {
    children: ReactNode;
}) {
    const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
    const [emotionCache] = useState(() => createEmotionCacheForSSR());

    const toggleColorScheme = (value?: ColorScheme) => {
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    };

    useServerInsertedHTML(() => {
        const serialized = emotionCache.flush();
        if (serialized.length === 0) return null;

        return (
            <>
                {serialized.map((style: Key | null | undefined) => (
                    <style
                        key={style}
                        data-emotion={`${emotionCache.cache.key} ${Object.keys(
                            emotionCache.cache.inserted,
                        ).join(" ")}`}
                        dangerouslySetInnerHTML={{ __html: style as string }}
                    />
                ))}
            </>
        );
    });

    return (
        <CacheProvider value={emotionCache.cache}>
            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider
                    theme={{ colorScheme }}
                    withGlobalStyles
                    withNormalizeCSS
                >
                    {children}
                </MantineProvider>
            </ColorSchemeProvider>
        </CacheProvider>
    );
}
