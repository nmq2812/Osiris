import React from "react";
import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CollectionWrapper } from "@/datas/CollectionWrapper";
import { SelectOption } from "@/datas/SelectOption";
import { ProductPropertyItem } from "@/models/Product";
import ProductPropertyRow from "./ProductPropertyRow";

interface ProductPropertiesProps {
    productProperties: CollectionWrapper<ProductPropertyItem> | null;
    setProductProperties: (
        productProperties: CollectionWrapper<ProductPropertyItem> | null,
    ) => void;
    productPropertySelectList: SelectOption[];
    setProductPropertySelectList: React.Dispatch<
        React.SetStateAction<SelectOption[]>
    >;
}

function ProductProperties({
    productProperties,
    setProductProperties,
    productPropertySelectList,
    setProductPropertySelectList,
}: ProductPropertiesProps) {
    const isDisabledCreateProductPropertyButton =
        productProperties?.content.length === productPropertySelectList.length;

    const handleCreateProductPropertyButton = () => {
        let currentProductPropertyItems: ProductPropertyItem[] = [];

        if (
            productProperties &&
            productProperties.content.length < productPropertySelectList.length
        ) {
            currentProductPropertyItems = [...productProperties.content];
        }

        currentProductPropertyItems.push({
            id: 0,
            name: "",
            code: "",
            value: [], // Đảm bảo value là một mảng
        });
        setProductProperties(
            new CollectionWrapper(currentProductPropertyItems),
        );
    };

    // Đảm bảo rằng tất cả các productProperty.value đều là mảng
    const ensureValidProperties = () => {
        if (!productProperties) return null;

        const validProperties = productProperties.content.map((prop) => ({
            ...prop,
            value: Array.isArray(prop.value) ? prop.value : [],
        }));

        return new CollectionWrapper(validProperties);
    };

    const safeProductProperties = ensureValidProperties();

    const productPropertiesFragment = safeProductProperties?.content.map(
        (productProperty, index) => (
            <ProductPropertyRow
                key={index}
                productProperty={{
                    ...productProperty,
                    value: Array.isArray(productProperty.value)
                        ? productProperty.value
                        : [],
                }}
                index={index}
                productProperties={safeProductProperties}
                setProductProperties={setProductProperties}
                productPropertySelectList={productPropertySelectList}
                setProductPropertySelectList={setProductPropertySelectList}
            />
        ),
    );

    return (
        <Space direction="vertical" style={{ width: "100%", display: "flex" }}>
            {productPropertiesFragment}
            <Button
                icon={<PlusOutlined />}
                onClick={handleCreateProductPropertyButton}
                disabled={isDisabledCreateProductPropertyButton}
            >
                Thêm thuộc tính sản phẩm
            </Button>
        </Space>
    );
}

export default ProductProperties;
