
import { Grid, Group, Stack, Title } from "@mantine/core";
import { CircleSquare } from "tabler-icons-react";

import React from "react";
import ClientProductCard from "@/components/ClientProductCard";
import { ClientProductResponse } from "@/datas/ClientUI";

interface ClientProductRelatedProductsProps {
    product: ClientProductResponse;
}

function ClientProductRelatedProducts({
    product,
}: ClientProductRelatedProductsProps) {
    return (
        <Stack>
            <Group spacing="xs">
                <CircleSquare />
                <Title order={2}>Sản phẩm liên quan</Title>
            </Group>
            <Grid>
                {product.productRelatedProducts.map((product, index) => (
                    <Grid.Col key={index} span={6} md={3}>
                        <ClientProductCard product={product} />
                    </Grid.Col>
                ))}
            </Grid>
        </Stack>
    );

}

export default ClientProductRelatedProducts;
