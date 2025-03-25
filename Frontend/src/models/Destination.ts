import { AddressRequest, AddressResponse } from "./Address";
import BaseResponse from "./BaseResponse";

export interface DestinationResponse extends BaseResponse {
    contactFullname: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    address: AddressResponse;
    status: number;
}

export interface DestinationRequest {
    contactFullname: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    address: AddressRequest;
    status: number;
}
