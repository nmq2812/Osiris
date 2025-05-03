import BaseResponse from "./BaseResponse";

export interface BrandResponse extends BaseResponse {
    createdBy: any;
    updatedBy: any;
    name: string;
    code: string;
    description: string | null;
    status: number;
}

export interface BrandRequest {
    name: string;
    code: string;
    description: string | null;
    status: number;
}
