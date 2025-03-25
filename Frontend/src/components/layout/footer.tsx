"use client";
import React from "react";
import {
    ActionIcon,
    Anchor,
    Box,
    Center,
    Container,
    createStyles,
    Grid,
    Group,
    SegmentedControl,
    Stack,
    Text,
    ThemeIcon,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";

import {
    BrandFacebook,
    BrandInstagram,
    BrandMastercard,
    BrandTiktok,
    BrandVisa,
    BrandYoutube,
    BuildingBank,
    CurrencyDong,
    Headset,
    Moon,
    Sun,
} from "tabler-icons-react";
import Link from "next/link";
import Image from "next/image";

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: theme.spacing.xl * 2,
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2,
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
        borderTop: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[2]
        }`,
    },

    footerLinks: {
        [theme.fn.smallerThan("md")]: {
            marginTop: theme.spacing.xl,
        },
    },

    afterFooter: {
        marginTop: theme.spacing.xl * 2,
        paddingTop: theme.spacing.xl,
        borderTop: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
        }`,
    },
}));

function ClientFooter() {
    const theme = useMantineTheme();
    const { classes } = useStyles();

    return (
        <footer className={classes.footer}>
            <Container size="xl">
                <Grid>
                    <Grid.Col md={6}>
                        <Stack spacing={theme.spacing.lg * 1.75}>
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center">
                                    <Image
                                        src="/logo.png"
                                        alt="Osiris Logo"
                                        width={40}
                                        height={40}
                                        className="mr-2"
                                    />
                                    <span className="text-2xl font-bold text-blue-600">
                                        OSIRIS
                                    </span>
                                </Link>
                            </div>
                            <Group>
                                <Headset
                                    size={52}
                                    color={theme.colors[theme.primaryColor][6]}
                                    strokeWidth={1.25}
                                />
                                <Stack spacing={theme.spacing.xs / 4}>
                                    <Text size="sm" color="dimmed">
                                        Tổng đài hỗ trợ
                                    </Text>
                                    <Text size="xl">
                                        (024) 3535 7272, (028) 35 111 222
                                    </Text>
                                </Stack>
                            </Group>
                            <Stack spacing={theme.spacing.xs / 2}>
                                <Text weight={500}>Địa chỉ liên hệ</Text>
                                <Text>
                                    Tòa nhà Bitexco, Quận 1, Thành phố Hồ Chí
                                    Minh
                                </Text>
                            </Stack>
                            <Group spacing="sm">
                                <ActionIcon
                                    color="blue"
                                    size="xl"
                                    radius="xl"
                                    variant="light"
                                >
                                    <BrandFacebook strokeWidth={1.5} />
                                </ActionIcon>
                                <ActionIcon
                                    color="blue"
                                    size="xl"
                                    radius="xl"
                                    variant="light"
                                >
                                    <BrandYoutube strokeWidth={1.5} />
                                </ActionIcon>
                                <ActionIcon
                                    color="blue"
                                    size="xl"
                                    radius="xl"
                                    variant="light"
                                >
                                    <BrandInstagram strokeWidth={1.5} />
                                </ActionIcon>
                                <ActionIcon
                                    color="blue"
                                    size="xl"
                                    radius="xl"
                                    variant="light"
                                >
                                    <BrandTiktok strokeWidth={1.5} />
                                </ActionIcon>
                            </Group>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col md={6}>
                        <Grid>
                            <Grid.Col xs={6} className={classes.footerLinks}>
                                <Stack>
                                    <Text weight={500}>Hỗ trợ khách hàng</Text>
                                    <Stack spacing={theme.spacing.xs}>
                                        <Anchor href="/">
                                            Câu hỏi thường gặp
                                        </Anchor>
                                        <Anchor href="/">
                                            Hướng dẫn đặt hàng
                                        </Anchor>
                                        <Anchor href="/">
                                            Phương thức vận chuyển
                                        </Anchor>
                                        <Anchor href="/">
                                            Chính sách đổi trả
                                        </Anchor>
                                        <Anchor href="/">
                                            Chính sách thanh toán
                                        </Anchor>
                                        <Anchor href="/">
                                            Giải quyết khiếu nại
                                        </Anchor>
                                        <Anchor href="/">
                                            Chính sách bảo mật
                                        </Anchor>
                                    </Stack>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col xs={6} className={classes.footerLinks}>
                                <Stack
                                    justify="space-between"
                                    sx={{ height: "100%" }}
                                >
                                    <Stack>
                                        <Text weight={500}>Giới thiệu</Text>
                                        <Stack spacing={theme.spacing.xs}>
                                            <Anchor href="/">Về Công ty</Anchor>
                                            <Anchor href="/">Tuyển dụng</Anchor>
                                            <Anchor href="/">Hợp tác</Anchor>
                                            <Anchor href="/">
                                                Liên hệ mua hàng
                                            </Anchor>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Grid.Col>
                </Grid>
                <Group className={classes.afterFooter} position="apart">
                    <Text color="dimmed" size="sm">
                        © 2025 Osiris Corporation. Bảo lưu mọi quyền.
                    </Text>
                    <Group spacing="xs">
                        <ThemeIcon
                            variant="outline"
                            color="gray"
                            sx={{ width: 50, height: 30 }}
                        >
                            <BrandVisa strokeWidth={1.5} />
                        </ThemeIcon>
                        <ThemeIcon
                            variant="outline"
                            color="gray"
                            sx={{ width: 50, height: 30 }}
                        >
                            <BrandMastercard strokeWidth={1.5} />
                        </ThemeIcon>
                        <ThemeIcon
                            variant="outline"
                            color="gray"
                            sx={{ width: 50, height: 30 }}
                        >
                            <BuildingBank strokeWidth={1.5} />
                        </ThemeIcon>
                        <ThemeIcon
                            variant="outline"
                            color="gray"
                            sx={{ width: 50, height: 30 }}
                        >
                            <CurrencyDong strokeWidth={1.5} />
                        </ThemeIcon>
                    </Group>
                </Group>
            </Container>
        </footer>
    );
}

export default React.memo(ClientFooter);
