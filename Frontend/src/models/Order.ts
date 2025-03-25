import BaseResponse from "./BaseResponse";
import { OrderCancellationReasonResponse } from "./OrderCancellationReason";
import { OrderResourceResponse } from "./OrderResource";
import { OrderVariantResponse, OrderVariantRequest } from "./OrderVariant";
import { PaymentMethodType } from "./PaymentMethod";
import { UserResponse } from "./User";

export interface OrderResponse extends BaseResponse {
    code: string;
    status: number;
    toName: string;
    toPhone: string;
    toAddress: string;
    toWardName: string;
    toDistrictName: string;
    toProvinceName: string;
    orderResource: OrderResourceResponse;
    orderCancellationReason: OrderCancellationReasonResponse | null;
    note: string | null;
    user: UserResponse;
    orderVariants: OrderVariantResponse[];
    totalAmount: number;
    tax: number;
    shippingCost: number;
    totalPay: number;
    paymentMethodType: PaymentMethodType;
    paymentStatus: number;
}

export interface OrderRequest {
    code: string;
    status: number;
    toName: string;
    toPhone: string;
    toAddress: string;
    toWardName: string;
    toDistrictName: string;
    toProvinceName: string;
    orderResourceId: number;
    orderCancellationReasonId: number | null;
    note: string | null;
    userId: number;
    orderVariants: OrderVariantRequest[];
    totalAmount: number;
    tax: number;
    shippingCost: number;
    totalPay: number;
    paymentMethodType: PaymentMethodType;
    paymentStatus: number;
}
