import BaseResponse from "./BaseResponse";

export interface SpecificationResponse extends BaseResponse {
    createdBy: any;
    updatedBy: any;
    name: string;
    code: string;
    description: string | null;
    status: number;
}

export interface SpecificationRequest {
    name: string;
    code: string;
    description: string | null;
    status: number;
}
