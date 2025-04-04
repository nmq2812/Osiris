import BaseResponse from "./BaseResponse";
import { CountVariantResponse, CountVariantRequest } from "./CountVariant";
import { WarehouseResponse } from "./Warehouse";

export interface CountResponse extends BaseResponse {
    code: string;
    warehouse: WarehouseResponse;
    countVariants: CountVariantResponse[];
    note: string | null;
    status: number;
}

export interface CountRequest {
    code: string;
    warehouseId: number;
    countVariants: CountVariantRequest[];
    note: string | null;
    status: number;
}
