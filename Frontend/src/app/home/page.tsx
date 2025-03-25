"use client";

import { Container, Stack, useMantineTheme } from "@mantine/core";
import ClientHomeBanner from "./ClientHomeBanner";
import ClientHomeFeaturedCategories from "./ClientHomeFeaturedCategories";
import ClientHomeLatestProducts from "./ClientHomeLatestProducts";
import ClientHomeNewsletter from "./ClientHomeNewsletter";
import useTitle from "@/hooks/use-title";

export default function HomePage() {
    // State
    useTitle();

    const theme = useMantineTheme();
    return (
        <main>
            <Container size="xl">
                <Stack spacing={theme.spacing.xl * 1.5}>
                    <ClientHomeBanner />
                    <ClientHomeFeaturedCategories />
                    <ClientHomeLatestProducts />
                    <ClientHomeNewsletter />
                </Stack>
            </Container>
        </main>
    );
}
