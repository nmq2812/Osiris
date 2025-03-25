import BaseResponse from "./BaseResponse";
import { AddressRequest, AddressResponse } from "./Address";

export interface WarehouseResponse extends BaseResponse {
    code: string;
    name: string;
    address: AddressResponse | null;
    status: number;
}

export interface WarehouseRequest {
    code: string;
    name: string;
    address: AddressRequest | null;
    status: number;
}
