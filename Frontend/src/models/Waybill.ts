import BaseResponse from "./BaseResponse";
import { OrderResponse } from "./Order";

export interface WaybillResponse extends BaseResponse {
    code: string;
    order: OrderResponse;
    shippingDate: string;
    expectedDeliveryTime: string;
    status: number;
    codAmount: number;
    shippingFee: number;
    weight: number;
    length: number;
    width: number;
    height: number;
    note: string | null;
    ghnPaymentTypeId: number;
    ghnRequiredNote: RequiredNote;
}

export interface WaybillRequest {
    orderId: number;
    shippingDate: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    note: string | null;
    ghnRequiredNote: RequiredNote;
}

export enum RequiredNote {
    CHOTHUHANG = "CHOTHUHANG",
    CHOXEMHANGKHONGTHU = "CHOXEMHANGKHONGTHU",
    KHONGCHOXEMHANG = "KHONGCHOXEMHANG",
}
