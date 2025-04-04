import { CollectionWrapper } from "@/datas/CollectionWrapper";
import BaseResponse from "./BaseResponse";
import { VariantPropertyItem } from "./Variant";

export interface DocketVariantResponse {
    variant: VariantResponse;
    quantity: number;
}

interface VariantResponse extends BaseResponse {
    product: ProductResponse;
    sku: string;
    cost: number;
    price: number;
    properties: CollectionWrapper<VariantPropertyItem> | null;
    status: number;
}

interface ProductResponse extends BaseResponse {
    name: string;
    code: string;
    slug: string;
}

export interface DocketVariantRequest {
    variantId: number;
    quantity: number;
}

export interface DocketVariantKeyRequest {
    docketId: number;
    variantId: number;
}
