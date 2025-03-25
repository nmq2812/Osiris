import { CollectionWrapper } from "@/datas/CollectionWrapper";
import BaseResponse from "./BaseResponse";
import { BrandResponse } from "./Brand";
import { GuaranteeResponse } from "./Guarantee";
import { ImageResponse, ImageRequest } from "./Image";
import { SupplierResponse } from "./Supplier";
import { TagResponse } from "./Tag";
import { UnitResponse } from "./Unit";
import { VariantPropertyItem, VariantRequest } from "./Variant";

export interface ProductResponse extends BaseResponse {
    name: string;
    code: string;
    slug: string;
    shortDescription: string | null;
    description: string | null;
    images: ImageResponse[];
    status: number;
    category: CategoryResponse | null;
    brand: BrandResponse | null;
    supplier: SupplierResponse | null;
    unit: UnitResponse | null;
    tags: TagResponse[];
    specifications: CollectionWrapper<SpecificationItem> | null;
    properties: CollectionWrapper<ProductPropertyItem> | null;
    variants: ProductResponse_VariantResponse[];
    weight: number | null;
    guarantee: GuaranteeResponse | null;
}

interface CategoryResponse extends BaseResponse {
    name: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    status: number;
}

export interface ProductResponse_VariantResponse extends BaseResponse {
    sku: string;
    cost: number;
    price: number;
    properties: CollectionWrapper<VariantPropertyItem> | null;
    status: number;
}

export interface SpecificationItem {
    id: number;
    name: string;
    code: string;
    value: string;
}

export interface ProductPropertyItem {
    id: number;
    name: string;
    code: string;
    value: string[];
}

export interface ProductRequest {
    name: string;
    code: string;
    slug: string;
    shortDescription: string | null;
    description: string | null;
    images: ImageRequest[];
    status: number;
    categoryId: number | null;
    brandId: number | null;
    supplierId: number | null;
    unitId: number | null;
    tags: ProductRequest_TagRequest[];
    specifications: CollectionWrapper<SpecificationItem> | null;
    properties: CollectionWrapper<ProductPropertyItem> | null;
    variants: VariantRequest[];
    weight: number | null;
    guaranteeId: number | null;
}

export interface ProductRequest_TagRequest {
    id?: number;
    name?: string;
    slug?: string;
    status?: number;
}
