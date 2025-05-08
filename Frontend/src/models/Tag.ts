import BaseResponse from "./BaseResponse";

export interface TagResponse extends BaseResponse {
    createdBy: any;
    updatedBy: any;
    name: string;
    slug: string;
    status: number;
}

export interface TagRequest {
    name: string;
    slug: string;
    status: number;
}
