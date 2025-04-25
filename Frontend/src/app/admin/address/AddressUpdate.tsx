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
import { useParams } from "next/navigation";
import AddressConfigs from "./AddressConfigs";
import useAddressUpdateViewModel from "./AddressUpdate.vm";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";

function AddressUpdate() {
    const { id } = useParams();
    const {
        address,
        form,
        handleFormSubmit,
        provinceSelectList,
        districtSelectList,
    } = useAddressUpdateViewModel(Number(id));

    if (!address) {
        return null;
    }

    return (
        <Stack sx={{ maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={AddressConfigs.managerPath}
                title={AddressConfigs.updateTitle}
            />

            <DefaultPropertyPanel
                id={address.id}
                createdAt={address.createdAt}
                updatedAt={address.updatedAt}
                createdBy="1"
                updatedBy="1"
            />

            <form onSubmit={handleFormSubmit}>
                <Paper shadow="xs">
                    <Stack spacing={0}>
                        <Grid p="sm">
                            <Grid.Col>
                                <TextInput
                                    label={AddressConfigs.properties.line.label}
                                    {...form.getInputProps("line")}
                                />
                            </Grid.Col>
                            <Grid.Col xs={6}>
                                <Select
                                    label={
                                        AddressConfigs.properties.provinceId
                                            .label
                                    }
                                    placeholder="--"
                                    clearable
                                    searchable
                                    data={provinceSelectList}
                                    {...form.getInputProps("provinceId")}
                                />
                            </Grid.Col>
                            <Grid.Col xs={6}>
                                <Select
                                    label={
                                        AddressConfigs.properties.districtId
                                            .label
                                    }
                                    placeholder="--"
                                    clearable
                                    searchable
                                    data={districtSelectList}
                                    {...form.getInputProps("districtId")}
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

export default AddressUpdate;
