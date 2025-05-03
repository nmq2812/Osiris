"use client";
import React, { useEffect } from 'react';
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
  Spin
} from 'antd';
import { useParams } from 'next/navigation';

import ProductConfigs from '@/app/admin/product/ProductConfigs';
import useProductUpdateViewModel from '@/app/admin/product/ProductUpdate.vm';
import MiscUtils from '@/utils/MiscUtils';
import { ImageResponse } from '@/models/Image';
import CreateUpdateTitle from '@/components/CreateUpdateTitle';
import DefaultPropertyPanel from '@/components/DefaultPropertyPanel';

const { Title, Text } = Typography;
const { TextArea } = Input;

function ProductUpdate() {
  const { slug } = useParams();
  const id = Number(slug);
  const [form] = Form.useForm();
  
  const {
    product,
    form: mantineForm,
    prevFormValues,
    handleFormSubmit,
    statusSelectList,
    categorySelectList,
    brandSelectList,
    supplierSelectList,
    unitSelectList,
    tagSelectList,
    guaranteeSelectList,
    imageFiles, setImageFiles,
    thumbnailName, setThumbnailName,
    specificationSelectList, setSpecificationSelectList,
    productPropertySelectList, setProductPropertySelectList,
    selectedVariantIndexes, setSelectedVariantIndexes,
    resetForm,
    isLoading
  } = useProductUpdateViewModel(id);

  // Convert select options for Ant Design
  const mapToAntOptions = (options) => {
    return options.map(option => ({
      value: option.value,
      label: option.label
    }));
  };

  const statusOptions = mapToAntOptions(statusSelectList);
  const categoryOptions = mapToAntOptions(categorySelectList);
  const brandOptions = mapToAntOptions(brandSelectList);
  const supplierOptions = mapToAntOptions(supplierSelectList);
  const unitOptions = mapToAntOptions(unitSelectList);
  const guaranteeOptions = mapToAntOptions(guaranteeSelectList);

  // Initialize form when product data is ready
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        code: product.code,
        slug: product.slug,
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        status: String(product.status),
        categoryId: product.categoryId ? String(product.categoryId) : null,
        brandId: product.brandId ? String(product.brandId) : null,
        supplierId: product.supplierId ? String(product.supplierId) : null,
        unitId: product.unitId ? String(product.unitId) : null,
        tags: product.tags.map(tag => String(tag.id) + '#ORIGINAL'),
        weight: product.weight,
        guaranteeId: product.guaranteeId ? String(product.guaranteeId) : null,
      });
    }
  }, [product, form]);

  // Submit handler
  const onFinish = (values) => {
    // Update Mantine form with Ant Design form values
    mantineForm.setValues({
      name: values.name,
      code: values.code,
      slug: values.slug,
      shortDescription: values.shortDescription,
      description: values.description,
      status: values.status,
      categoryId: values.categoryId,
      brandId: values.brandId,
      supplierId: values.supplierId,
      unitId: values.unitId,
      tags: values.tags || [],
      weight: values.weight,
      guaranteeId: values.guaranteeId,
      // Keep the complex objects as is
      images: mantineForm.values.images,
      specifications: mantineForm.values.specifications,
      properties: mantineForm.values.properties,
      variants: mantineForm.values.variants
    });

    // Use the original form submit handler
    handleFormSubmit();
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Space direction="vertical" style={{ width: '100%', maxWidth: 800 }}>
      <CreateUpdateTitle
        managerPath={ProductConfigs.managerPath}
        title={ProductConfigs.updateTitle}
      />

      <DefaultPropertyPanel
        id={product.id}
        createdAt={product.createdAt}
        updatedAt={product.updatedAt}
        createdBy={product.createdBy?.username || "-"}
        updatedBy={product.updatedBy?.username || "-"}
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: '',
            code: '',
            slug: '',
            shortDescription: '',
            description: '',
            status: '1',
            tags: [],
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Basic Information */}
            <div>
              <Title level={4}>Thông tin cơ bản</Title>
              <Text type="secondary">Một số thông tin chung</Text>
              
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label={ProductConfigs.properties.name.label}
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="code"
                    label={ProductConfigs.properties.code.label}
                    rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="slug"
                    label={ProductConfigs.properties.slug.label}
                    rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item
                    name="shortDescription"
                    label={ProductConfigs.properties.shortDescription.label}
                  >
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item
                    name="description"
                    label={ProductConfigs.properties.description.label}
                  >
                    <TextArea rows={6} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Product Images */}
            <div>
              <Title level={4}>Hình sản phẩm</Title>
              <Text type="secondary">Thêm danh sách hình giới thiệu sản phẩm và chọn hình đại diện</Text>
              
              <div style={{ marginTop: 16 }}>
                <ProductImagesDropzone
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                  thumbnailName={thumbnailName}
                  setThumbnailName={setThumbnailName}
                  imageResponses={mantineForm.values.images as ImageResponse[]}
                  setImageResponses={(imageResponses) => mantineForm.setFieldValue('images', imageResponses)}
                />
              </div>
            </div>

            {/* Product Specifications */}
            <div>
              <Title level={4}>Thông số sản phẩm</Title>
              <Text type="secondary">Thêm các thông số của sản phẩm</Text>
              
              <div style={{ marginTop: 16 }}>
                <ProductSpecifications
                  specifications={mantineForm.values.specifications}
                  setSpecifications={(specifications) => mantineForm.setFieldValue('specifications', specifications)}
                  specificationSelectList={specificationSelectList}
                  setSpecificationSelectList={setSpecificationSelectList}
                />
              </div>
            </div>

            {/* Product Properties */}
            <div>
              <Title level={4}>Thuộc tính sản phẩm</Title>
              <Text type="secondary">Thêm mới thuộc tính giúp sản phẩm có nhiều lựa chọn, như kích cỡ hay màu sắc</Text>
              
              <div style={{ marginTop: 16 }}>
                <ProductProperties
                  productProperties={mantineForm.values.properties}
                  setProductProperties={(productProperties) => mantineForm.setFieldValue('properties', productProperties)}
                  productPropertySelectList={productPropertySelectList}
                  setProductPropertySelectList={setProductPropertySelectList}
                />
              </div>
            </div>

            {/* Product Variants */}
            <div></div>
              <Title level={4}>Phiên bản sản phẩm</Title>
              <Text type="secondary">Phiên bản mặc định của sản phẩm hoặc phiên bản dựa vào thuộc tính sản phẩm</Text>
              
              <div style={{ marginTop: 16 }}></div>
                <ProductVariantsForUpdate
                  variants={mantineForm.values.variants}
                  setVariants={(variants) => mantineForm.setFieldValue('variants', variants)}
                  productProperties={mantineForm.values.properties}
                  setProductProperties={(productProperties) => mantineForm.setFieldValue('properties', productProperties)}
                  selectedVariantIndexes={selectedVariantIndexes}
                  setSelectedVariantIndexes={setSelectedVariantIndexes}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <Title level={4}>Thông tin bổ sung</Title>
              <Text type="secondary">Một số thông tin thêm</Text>
              
              <Row gutter={16} style={{ marginTop: 16 }}></Row>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="status"
                    label={ProductConfigs.properties.status.label}
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                  >
                    <Select options={statusOptions} placeholder="--" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="categoryId"
                    label={ProductConfigs.properties.categoryId.label}
                  >
                    <Select 
                      options={categoryOptions} 
                      placeholder="--" 
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="brandId"
                    label={ProductConfigs.properties.brandId.label}
                  >
                    <Select 
                      options={brandOptions} 
                      placeholder="--" 
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="supplierId"
                    label={ProductConfigs.properties.supplierId.label}
                  >
                    <Select 
                      options={supplierOptions} 
                      placeholder="--" 
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="unitId"
                    label={ProductConfigs.properties.unitId.label}
                  >
                    <Select 
                      options={unitOptions} 
                      placeholder="--" 
                      allowClear
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item
                    name="tags"
                    label={ProductConfigs.properties.tags.label}
                  >
                    <Select
                      mode="multiple"
                      placeholder="--"
                      options={mapToAntOptions(tagSelectList)}
                      allowClear
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}></Col>
                  <Form.Item
                    name="weight"
                    label={ProductConfigs.properties.weight.label}
                    extra="Tính theo gam"
                  ></Form.Item>
                    <InputNumber precision={2} min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="guaranteeId"
                    label={ProductConfigs.properties.guaranteeId.label}
                  >
                    <Select 
                      options={guaranteeOptions} 
                      placeholder="--" 
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Space>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}></div>
            <Button onClick={() => form.resetFields()}>Mặc định</Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={MiscUtils.isEquals(mantineForm.values, prevFormValues)
                && selectedVariantIndexes.length === product.variants.length
                && imageFiles.length === 0}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Card>
    </Space>
  );
}

export default ProductUpdate;
