import { CollectionWrapper } from "@/datas/CollectionWrapper";
import BaseResponse from "./BaseResponse";
import { DocketReasonResponse } from "./DocketReason";
import { VariantPropertyItem } from "./Variant";
import { WarehouseResponse } from "./Warehouse";

export interface DocketVariantExtendedResponse {
    docket: DocketResponse;
    variant: VariantResponse;
    quantity: number;
}

interface DocketResponse extends BaseResponse {
    type: number;
    code: string;
    reason: DocketReasonResponse;
    warehouse: WarehouseResponse;
    purchaseOrder: PurchaseOrderResponse | null;
    order: OrderResponse | null;
    status: number;
}

interface PurchaseOrderResponse extends BaseResponse {
    code: string;
    status: number;
}

interface OrderResponse extends BaseResponse {
    code: string;
    status: number;
}

interface VariantResponse extends BaseResponse {
    sku: string;
    properties: CollectionWrapper<VariantPropertyItem> | null;
    status: number;
}
