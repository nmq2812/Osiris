import { CollectionWrapper } from "@/datas/CollectionWrapper";
import BaseResponse from "./BaseResponse";
import { VariantPropertyItem } from "./Variant";

export interface CountVariantResponse {
    variant: VariantResponse;
    inventory: number;
    actualInventory: number;
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

export interface CountVariantRequest {
    variantId: number;
    inventory: number;
    actualInventory: number;
}

export interface CountVariantKeyRequest {
    countId: number;
    variantId: number;
}
