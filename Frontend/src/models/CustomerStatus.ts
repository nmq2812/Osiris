import BaseResponse from "./BaseResponse";

export interface CustomerStatusResponse extends BaseResponse {
    createdBy: any;
    updatedBy: any;
    code: string;
    name: string;
    description: string;
    color: string;
    status: number;
}

export interface CustomerStatusRequest {
    code: string;
    name: string;
    description: string;
    color: string;
    status: number;
}
