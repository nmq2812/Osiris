"use client";
import React from "react";
import {
    Button,
    Card,
    Divider,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Row,
    Col,
    Typography,
} from "antd";

import ProductConfigs from "@/app/admin/product/ProductConfigs";
import useProductCreateViewModel from "@/app/admin/product/ProductCreate.vm";
import { CollectionWrapper } from "@/datas/CollectionWrapper";
import { ImageRequest } from "@/models/Image";
import { SpecificationItem, ProductPropertyItem } from "@/models/Product";
import { VariantRequest } from "@/models/Variant";
import CreateUpdateTitle from "@/components/CreateUpdateTitle";
import DefaultPropertyPanel from "@/components/DefaultPropertyPanel";
import ProductImagesDropzone from "@/components/ProductImagesDropzone";
import ProductProperties from "@/components/ProductProperties";
import ProductSpecifications from "@/components/ProductSpecifications";
import ProductVariants from "@/components/ProductVariants";

const { Title, Text } = Typography;
const { TextArea } = Input;

function ProductCreate() {
    const [form] = Form.useForm();

    const {
        form: mantineForm,
        handleFormSubmit,
        statusSelectList,
        categorySelectList,
        brandSelectList,
        supplierSelectList,
        unitSelectList,
        tagSelectList,
        guaranteeSelectList,
        imageFiles,
        setImageFiles,
        thumbnailName,
        setThumbnailName,
        specificationSelectList,
        setSpecificationSelectList,
        productPropertySelectList,
        setProductPropertySelectList,
        selectedVariantIndexes,
        setSelectedVariantIndexes,
        resetForm,
    } = useProductCreateViewModel();

    // Convert select options for Ant Design
    const mapToAntOptions = (options: any[]) => {
        return options.map((option: { value: any; label: any }) => ({
            value: option.value,
            label: option.label,
        }));
    };

    // Handle form submission
    const onFinish = (values: any) => {
        mantineForm.setValues({
            name: values.name || "",
            code: values.code || "",
            slug: values.slug || "",
            shortDescription: values.shortDescription || "",
            description: values.description || "",
            status: values.status || "1",
            categoryId: values.categoryId || null,
            brandId: values.brandId || null,
            supplierId: values.supplierId || null,
            unitId: values.unitId || null,
            tags: values.tags || [],
            weight: values.weight || 0,
            guaranteeId: values.guaranteeId || null,
            specifications: mantineForm.values.specifications,
            properties: mantineForm.values.properties,
            variants: mantineForm.values.variants,
            images: mantineForm.values.images,
        });
        handleFormSubmit();
    };

    return (
        <Space direction="vertical" style={{ width: "100%", maxWidth: 800 }}>
            <CreateUpdateTitle
                managerPath={ProductConfigs.managerPath}
                title={ProductConfigs.createTitle}
            />

            <DefaultPropertyPanel />

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: "",
                        code: "",
                        slug: "",
                        shortDescription: "",
                        description: "",
                        status: "1",
                        tags: [],
                    }}
                >
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                    >
                        {/* Basic Information */}
                        <div>
                            <Title level={4}>Thông tin cơ bản</Title>
                            <Text type="secondary">Một số thông tin chung</Text>

                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col span={24}>
                                    <Form.Item
                                        name="name"
                                        label={
                                            ProductConfigs.properties.name.label
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập tên sản phẩm",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="code"
                                        label={
                                            ProductConfigs.properties.code.label
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập mã sản phẩm",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="slug"
                                        label={
                                            ProductConfigs.properties.slug.label
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập slug",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        name="shortDescription"
                                        label={
                                            ProductConfigs.properties
                                                .shortDescription.label
                                        }
                                    >
                                        <TextArea rows={3} />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        name="description"
                                        label={
                                            ProductConfigs.properties
                                                .description.label
                                        }
                                    >
                                        <TextArea rows={6} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        {/* Product Images */}
                        <div>
                            <Title level={4}>Hình sản phẩm</Title>
                            <Text type="secondary">
                                Thêm danh sách hình giới thiệu sản phẩm và chọn
                                hình đại diện
                            </Text>

                            <div style={{ marginTop: 16 }}>
                                <ProductImagesDropzone
                                    imageFiles={imageFiles}
                                    setImageFiles={setImageFiles}
                                    thumbnailName={thumbnailName}
                                    setThumbnailName={setThumbnailName}
                                />
                            </div>
                        </div>

                        {/* Product Specifications */}
                        <div>
                            <Title level={4}>Thông số sản phẩm</Title>
                            <Text type="secondary">
                                Thêm các thông số của sản phẩm
                            </Text>

                            <div style={{ marginTop: 16 }}>
                                <ProductSpecifications
                                    specifications={
                                        mantineForm.values.specifications
                                    }
                                    setSpecifications={(specifications: any) =>
                                        mantineForm.setFieldValue(
                                            "specifications",
                                            specifications,
                                        )
                                    }
                                    specificationSelectList={
                                        specificationSelectList
                                    }
                                    setSpecificationSelectList={
                                        setSpecificationSelectList
                                    }
                                />
                            </div>
                        </div>

                        {/* Product Properties */}
                        <div>
                            <Title level={4}>Thuộc tính sản phẩm</Title>
                            <Text type="secondary">
                                Thêm mới thuộc tính giúp sản phẩm có nhiều lựa
                                chọn, như kích cỡ hay màu sắc
                            </Text>

                            <div style={{ marginTop: 16 }}>
                                <ProductProperties
                                    productProperties={
                                        mantineForm.values.properties
                                    }
                                    setProductProperties={(
                                        productProperties: any,
                                    ) =>
                                        mantineForm.setFieldValue(
                                            "properties",
                                            productProperties,
                                        )
                                    }
                                    productPropertySelectList={
                                        productPropertySelectList
                                    }
                                    setProductPropertySelectList={
                                        setProductPropertySelectList
                                    }
                                />
                            </div>
                        </div>

                        {/* Product Variants */}
                        <div>
                            <Title level={4}>Phiên bản sản phẩm</Title>
                            <Text type="secondary">
                                Phiên bản mặc định của sản phẩm hoặc phiên bản
                                dựa vào thuộc tính sản phẩm
                            </Text>

                            <div style={{ marginTop: 16 }}>
                                <ProductVariants
                                    variants={mantineForm.values.variants}
                                    setVariants={(variants: any) =>
                                        mantineForm.setFieldValue(
                                            "variants",
                                            variants,
                                        )
                                    }
                                    productProperties={
                                        mantineForm.values.properties
                                    }
                                    setProductProperties={(
                                        productProperties: any,
                                    ) =>
                                        mantineForm.setFieldValue(
                                            "properties",
                                            productProperties,
                                        )
                                    }
                                    selectedVariantIndexes={
                                        selectedVariantIndexes
                                    }
                                    setSelectedVariantIndexes={
                                        setSelectedVariantIndexes
                                    }
                                />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div>
                            <Title level={4}>Thông tin bổ sung</Title>
                            <Text type="secondary">Một số thông tin thêm</Text>

                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="status"
                                        label={
                                            ProductConfigs.properties.status
                                                .label
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng chọn trạng thái",
                                            },
                                        ]}
                                    >
                                        <Select
                                            options={mapToAntOptions(
                                                statusSelectList,
                                            )}
                                            placeholder="--"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="categoryId"
                                        label={
                                            ProductConfigs.properties.categoryId
                                                .label
                                        }
                                    >
                                        <Select
                                            options={mapToAntOptions(
                                                categorySelectList,
                                            )}
                                            placeholder="--"
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase(),
                                                    )
                                            }
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="brandId"
                                        label={
                                            ProductConfigs.properties.brandId
                                                .label
                                        }
                                    >
                                        <Select
                                            options={mapToAntOptions(
                                                brandSelectList,
                                            )}
                                            placeholder="--"
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase(),
                                                    )
                                            }
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="supplierId"
                                        label={
                                            ProductConfigs.properties.supplierId
                                                .label
                                        }
                                    >
                                        <Select
                                            options={mapToAntOptions(
                                                supplierSelectList,
                                            )}
                                            placeholder="--"
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase(),
                                                    )
                                            }
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="unitId"
                                        label={
                                            ProductConfigs.properties.unitId
                                                .label
                                        }
                                    >
                                        <Select
                                            options={mapToAntOptions(
                                                unitSelectList,
                                            )}
                                            placeholder="--"
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        name="tags"
                                        label={
                                            ProductConfigs.properties.tags.label
                                        }
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="--"
                                            options={mapToAntOptions(
                                                tagSelectList,
                                            )}
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                (option?.label ?? "")
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase(),
                                                    )
                                            }
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="weight"
                                        label={
                                            ProductConfigs.properties.weight
                                                .label
                                        }
                                        extra="Tính theo gam"
                                    >
                                        <InputNumber
                                            precision={2}
                                            min={0}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="guaranteeId"
                                        label={
                                            ProductConfigs.properties
                                                .guaranteeId.label
                                        }
                                    >
                                        <Select
                                            options={mapToAntOptions(
                                                guaranteeSelectList,
                                            )}
                                            placeholder="--"
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </Space>

                    <Divider />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button onClick={resetForm}>Mặc định</Button>
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </div>
                </Form>
            </Card>
        </Space>
    );
}

export default ProductCreate;
