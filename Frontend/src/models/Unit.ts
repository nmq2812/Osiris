import BaseResponse from "./BaseResponse";

export interface UnitResponse extends BaseResponse {
    createdBy: any;
    updatedBy: any;
    name: string;
    status: number;
}

export interface UnitRequest {
    name: string;
    status: number;
}
