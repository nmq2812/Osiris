import BaseResponse from "./BaseResponse";

export interface JobTypeResponse extends BaseResponse {
    name: string;
    status: number;
}

export interface JobTypeRequest {
    name: string;
    status: number;
}
