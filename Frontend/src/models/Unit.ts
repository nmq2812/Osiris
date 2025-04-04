import BaseResponse from "./BaseResponse";

export interface UnitResponse extends BaseResponse {
    name: string;
    status: number;
}

export interface UnitRequest {
    name: string;
    status: number;
}
