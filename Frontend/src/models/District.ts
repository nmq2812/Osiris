import BaseResponse from "./BaseResponse";
import { ProvinceResponse } from "./Province";

export interface DistrictResponse extends BaseResponse {
    name: string;
    code: string;
    province: ProvinceResponse;
}

export interface DistrictRequest {
    name: string;
    code: string;
    provinceId: number;
}
