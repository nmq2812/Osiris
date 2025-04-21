"use client";
import React from "react";
import {
    Button,
    Divider,
    Grid,
    Group,
    Paper,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import { useParams } from "next/navigation";
import RoleConfigs from "./RoleConfigs";
import useRoleUpdateViewModel from "./RoleUpdate.vm";

function RoleUpdate() {
    const { id } = useParams();
    const { role, form, handleFormSubmit, statusSelectList } =
        useRoleUpdateViewModel(Number(id));

    if (!role) {
        return null;
    }

    return (
        <Stack sx={{ maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={RoleConfigs.managerPath}
                title={RoleConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={role.id}
                createdAt={role.createdAt}
                updatedAt={role.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <form onSubmit={handleFormSubmit}>
                <Paper shadow="xs">
                    <Stack spacing={0}>
                        <Grid p="sm">
                            <Grid.Col xs={6}>
                                <TextInput
                                    required
                                    label={RoleConfigs.properties.code.label}
                                    {...form.getInputProps("code")}
                                />
                            </Grid.Col>
                            <Grid.Col xs={6}>
                                <TextInput
                                    required
                                    label={RoleConfigs.properties.name.label}
                                    {...form.getInputProps("name")}
                                />
                            </Grid.Col>
                            <Grid.Col xs={6}>
                                <Select
                                    required
                                    label={RoleConfigs.properties.status.label}
                                    placeholder="--"
                                    data={statusSelectList}
                                    {...form.getInputProps("status")}
                                />
                            </Grid.Col>
                        </Grid>

                        <Divider mt="xs" />

                        <Group position="apart" p="sm">
                            <Button variant="default" onClick={form.reset}>
                                Mặc định
                            </Button>
                            <Button type="submit">Cập nhật</Button>
                        </Group>
                    </Stack>
                </Paper>
            </form>
        </Stack>
    );
}

export default RoleUpdate;
