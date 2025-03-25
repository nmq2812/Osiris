import BaseResponse from "./BaseResponse";
import { AddressRequest, AddressResponse } from "./Address";

export interface OfficeResponse extends BaseResponse {
    name: string;
    address: AddressResponse;
    status: number;
}

export interface OfficeRequest {
    name: string;
    address: AddressRequest;
    status: number;
}
