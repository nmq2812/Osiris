import BaseResponse from "./BaseResponse";

export interface JobTitleResponse extends BaseResponse {
    name: string;
    status: number;
}

export interface JobTitleRequest {
    name: string;
    status: number;
}
