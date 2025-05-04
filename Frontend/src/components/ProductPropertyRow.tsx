import React from "react";
import { Button, Select, Space, Typography } from "antd";
import { DragOutlined, CloseOutlined } from "@ant-design/icons";
import { produce } from "immer";
import { CollectionWrapper } from "@/datas/CollectionWrapper";
import { SelectOption } from "@/datas/SelectOption";
import { ProductPropertyItem } from "@/models/Product";

interface ProductPropertyRowProps {
    productProperty: ProductPropertyItem;
    index: number;
    productProperties: CollectionWrapper<ProductPropertyItem>;
    setProductProperties: (
        productProperties: CollectionWrapper<ProductPropertyItem> | null,
    ) => void;
    productPropertySelectList: SelectOption[];
    setProductPropertySelectList: React.Dispatch<
        React.SetStateAction<SelectOption[]>
    >;
}

function ProductPropertyRow({
    productProperty,
    index,
    productProperties,
    setProductProperties,
    productPropertySelectList,
    setProductPropertySelectList,
}: ProductPropertyRowProps) {
    const isDisabledProductPropertyValueInput = productProperty.id === 0;

    // Convert productPropertySelectList to Ant Design format
    const propertyOptions = productPropertySelectList.map((option) => ({
        value: option.value,
        label: option.label,
        disabled: option.disabled,
    }));

    // Convert productProperty.value to Ant Design format for Select options
    const valueOptions = productProperty.value.map((value) => ({
        value: value,
        label: value,
    }));

    const handleProductPropertySelect = (
        productPropertyInfos: string | null,
        productPropertyIndex: number,
    ) => {
        const productProperty: ProductPropertyItem = {
            id: 0,
            name: "",
            code: "",
            value: [],
        };

        if (productPropertyInfos) {
            const parsedProductPropertyInfos = JSON.parse(productPropertyInfos);
            productProperty.id = parsedProductPropertyInfos.id;
            productProperty.name = parsedProductPropertyInfos.name;
            productProperty.code = parsedProductPropertyInfos.code;
        }

        const currentProductProperties = new CollectionWrapper(
            productProperties.content.map((item, index) =>
                index === productPropertyIndex ? productProperty : item,
            ),
        );
        setProductProperties(currentProductProperties);

        const currentProductPropertiesIds =
            currentProductProperties.content.map((item) => item.id);

        setProductPropertySelectList(
            productPropertySelectList.map((option) => {
                if (
                    option.disabled === true &&
                    !currentProductPropertiesIds.includes(
                        JSON.parse(option.value).id,
                    )
                ) {
                    return { value: option.value, label: option.label };
                }
                if (option.value === productPropertyInfos) {
                    return { ...option, disabled: true };
                }
                return option;
            }),
        );
    };

    const handleCreateProductPropertyValueInput = (
        productPropertyValue: string,
        productPropertyIndex: number,
    ) => {
        const currentProductProperties = new CollectionWrapper(
            produce(productProperties.content, (draft) => {
                draft[productPropertyIndex].value.push(productPropertyValue);
            }),
        );
        setProductProperties(currentProductProperties);
    };

    const handleProductPropertyValueInput = (
        productPropertyValues: string[],
        productPropertyIndex: number,
    ) => {
        const currentProductProperties = new CollectionWrapper(
            produce(productProperties.content, (draft) => {
                draft[productPropertyIndex].value = productPropertyValues;
            }),
        );
        setProductProperties(currentProductProperties);
    };

    const handleDeleteProductPropertyButton = (
        productPropertyIndex: number,
    ) => {
        const currentProductProperties = new CollectionWrapper(
            productProperties.content.filter(
                (_, index) => index !== productPropertyIndex,
            ),
        );
        setProductProperties(
            currentProductProperties.totalElements !== 0
                ? currentProductProperties
                : null,
        );

        setProductPropertySelectList(
            productPropertySelectList.map((option) => {
                if (
                    option.disabled === true &&
                    JSON.parse(option.value).id ===
                        productProperties.content[productPropertyIndex].id
                ) {
                    return { value: option.value, label: option.label };
                }
                return option;
            }),
        );
    };

    return (
        <Space
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <Button
                type="text"
                icon={<DragOutlined />}
                style={{ cursor: "move" }}
                title="Di chuyển thuộc tính sản phẩm"
            />
            <Select
                style={{ width: "100%" }}
                placeholder="Chọn thuộc tính"
                allowClear
                showSearch
                value={JSON.stringify({
                    id: productProperty.id,
                    name: productProperty.name,
                    code: productProperty.code,
                })}
                options={propertyOptions}
                onChange={(value) => handleProductPropertySelect(value, index)}
                filterOption={(input, option) =>
                    (option?.label?.toString() || "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
            />
            <Select
                style={{ width: "100%" }}
                placeholder="Nhập giá trị"
                mode="multiple"
                showSearch
                disabled={isDisabledProductPropertyValueInput}
                value={productProperty.value}
                options={valueOptions}
                onChange={(values) =>
                    handleProductPropertyValueInput(values, index)
                }
                onSearch={(value) => {
                    // Check if value is not already in the options
                    if (value && !productProperty.value.includes(value)) {
                        return;
                    }
                }}
                dropdownRender={(menu) => (
                    <>
                        {menu}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "8px",
                                borderTop: "1px solid #e8e8e8",
                            }}
                        >
                            <Typography.Link
                                onClick={() => {
                                    const searchInput = document.querySelector(
                                        ".ant-select-selection-search-input",
                                    ) as HTMLInputElement;
                                    if (searchInput && searchInput.value) {
                                        handleCreateProductPropertyValueInput(
                                            searchInput.value,
                                            index,
                                        );
                                        searchInput.value = "";
                                    }
                                }}
                                style={{
                                    flex: "none",
                                    padding: "8px",
                                    display: "block",
                                }}
                            >
                                + Thêm giá trị mới
                            </Typography.Link>
                        </div>
                    </>
                )}
            />
            <Button
                danger
                type="text"
                icon={<CloseOutlined />}
                title="Xóa thuộc tính"
                onClick={() => handleDeleteProductPropertyButton(index)}
            />
        </Space>
    );
}

export default ProductPropertyRow;
