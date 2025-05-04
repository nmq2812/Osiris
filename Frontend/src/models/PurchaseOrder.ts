import BaseResponse from "./BaseResponse";
import { DestinationResponse } from "./Destination";
import {
    PurchaseOrderVariantResponse,
    PurchaseOrderVariantRequest,
} from "./PurchaseOrderVariant";
import { SupplierResponse } from "./Supplier";

export interface PurchaseOrderResponse extends BaseResponse {
    createdBy: any;
    updatedBy: any;
    code: string;
    supplier: SupplierResponse;
    purchaseOrderVariants: PurchaseOrderVariantResponse[];
    destination: DestinationResponse;
    totalAmount: number;
    note: string | null;
    status: number;
    dockets: DocketResponse[];
}

interface DocketResponse extends BaseResponse {
    type: number;
    code: string;
    warehouse: WarehouseResponse;
    status: number;
}

interface WarehouseResponse extends BaseResponse {
    code: string;
    name: string;
    status: number;
}

export interface PurchaseOrderRequest {
    code: string;
    supplierId: number;
    purchaseOrderVariants: PurchaseOrderVariantRequest[];
    destinationId: number;
    totalAmount: number;
    note: string | null;
    status: number;
}
