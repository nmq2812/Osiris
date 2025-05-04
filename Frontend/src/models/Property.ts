import BaseResponse from "./BaseResponse";

export interface PropertyResponse extends BaseResponse {
    createdBy: any;
    updatedBy: any;
    name: string;
    code: string;
    description: string | null;
    status: number;
}

export interface PropertyRequest {
    name: string;
    code: string;
    description: string | null;
    status: number;
}
