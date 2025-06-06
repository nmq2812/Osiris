import BaseResponse from "./BaseResponse";

export interface RoleResponse extends BaseResponse {
    code: string;
    name: string;
    status: number;
}

export interface RoleRequest {
    code: string;
    name: string;
    status: number;
}
