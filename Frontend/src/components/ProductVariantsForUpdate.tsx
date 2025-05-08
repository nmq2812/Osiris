import React, { useEffect, useState } from "react";
import { Button, Space, Table, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CollectionWrapper } from "@/datas/CollectionWrapper";
import { ProductPropertyItem } from "@/models/Product";
import { VariantRequest, VariantPropertyItem } from "@/models/Variant";
import MiscUtils from "@/utils/MiscUtils";
import AddVariantsModal from "./AddVariantsModal";
import ProductVariantRow from "./ProductVariantRow";

interface ProductVariantsForUpdateProps {
    variants: VariantRequest[];
    setVariants: (variants: VariantRequest[]) => void;
    productProperties: CollectionWrapper<ProductPropertyItem> | null;
    setProductProperties: (
        productProperties: CollectionWrapper<ProductPropertyItem> | null,
    ) => void;
    selectedVariantIndexes: number[];
    setSelectedVariantIndexes: React.Dispatch<React.SetStateAction<number[]>>;
}

function ProductVariantsForUpdate({
    variants,
    setVariants,
    productProperties,
    setProductProperties,
    selectedVariantIndexes,
    setSelectedVariantIndexes,
}: ProductVariantsForUpdateProps) {
    const [propertyValueCombinations, setPropertyValueCombinations] = useState<
        string[][]
    >([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCombinationIndexes, setSelectedCombinationIndexes] =
        useState<number[]>([]);

    useEffect(() => {
        if (productProperties) {
            const productPropertiesValues = productProperties.content.map(
                (item) => item.value,
            );
            const currentPropertyValueCombinations = MiscUtils.recursiveFlatMap(
                productPropertiesValues,
            );
            setPropertyValueCombinations(currentPropertyValueCombinations);
        }
        setSelectedVariantIndexes(Array.from(Array(variants.length).keys()));
    }, [variants, productProperties, setSelectedVariantIndexes]);

    const isDisabledOpenAddVariantsModalButton =
        propertyValueCombinations.length === 0 ||
        propertyValueCombinations.length === variants.length;

    const remainingPropertyValueCombinations = () => {
        const propertyValueCombinationStringsOfCurrentVariants = variants
            .map((variant) =>
                variant.properties?.content.map((property) => property.value),
            )
            .map((combination) => JSON.stringify(combination));

        return propertyValueCombinations
            .map((combination) => JSON.stringify(combination))
            .filter(
                (combinationString) =>
                    !propertyValueCombinationStringsOfCurrentVariants.includes(
                        combinationString,
                    ),
            )
            .map(
                (combinationString) =>
                    JSON.parse(combinationString) as string[],
            );
    };

    const handleAddVariantsButton = (
        selectedRemainingPropertyValueCombinationIndexes: number[],
    ) => {
        const defaultVariant: VariantRequest = {
            sku: "",
            cost: 0,
            price: 0,
            properties: null,
            status: 1,
        };
        const currentVariants: VariantRequest[] = [...variants];

        const selectedRemainingPropertyValueCombinations =
            remainingPropertyValueCombinations().filter((_, index) =>
                selectedRemainingPropertyValueCombinationIndexes.includes(
                    index,
                ),
            );

        for (const selectedRemainingPropertyValueCombination of selectedRemainingPropertyValueCombinations) {
            const variant = { ...defaultVariant };
            variant.properties = JSON.parse(
                JSON.stringify(productProperties),
            ) as CollectionWrapper<VariantPropertyItem>;

            if (variant.properties && variant.properties.content) {
                variant.properties.content.forEach(
                    (item, index) =>
                        (item.value =
                            selectedRemainingPropertyValueCombination[index]),
                );
            }

            currentVariants.push(variant);
        }

        setVariants(currentVariants);
        setIsModalVisible(false);
    };

    const showModal = () => {
        setSelectedCombinationIndexes([]);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    // Định nghĩa cột cho bảng
    const columns = [
        {
            title: "#",
            key: "index",
            width: 50,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Phiên bản",
            key: "version",
            render: (_: any, record: VariantRequest, index: number) => (
                <ProductVariantRow
                    variant={record}
                    index={index}
                    variants={variants}
                    setVariants={setVariants}
                    selectedVariantIndexes={selectedVariantIndexes}
                    setSelectedVariantIndexes={setSelectedVariantIndexes}
                    isNewable={!record.id}
                />
            ),
        },
        {
            title: "SKU",
            dataIndex: "sku",
            key: "sku",
        },
        {
            title: "Giá vốn",
            dataIndex: "cost",
            key: "cost",
        },
        {
            title: "Giá bán",
            dataIndex: "price",
            key: "price",
        },
    ];

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Table
                columns={columns}
                dataSource={variants}
                rowKey={(record, index) => index?.toString() || ""}
                pagination={false}
                size="middle"
            />

            <Button
                icon={<PlusOutlined />}
                onClick={showModal}
                disabled={isDisabledOpenAddVariantsModalButton}
            >
                Thêm phiên bản sản phẩm{" "}
                {!isDisabledOpenAddVariantsModalButton &&
                    `(${propertyValueCombinations.length - variants.length})`}
            </Button>

            <Modal
                title="Thêm phiên bản"
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width={600}
            >
                <AddVariantsModal
                    remainingPropertyValueCombinations={remainingPropertyValueCombinations()}
                    handleAddVariantsButton={handleAddVariantsButton}
                />
            </Modal>
        </Space>
    );
}

export default ProductVariantsForUpdate;
