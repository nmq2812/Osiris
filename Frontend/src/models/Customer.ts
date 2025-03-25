import BaseResponse from "./BaseResponse";
import { CustomerGroupResponse } from "./CustomerGroup";
import { CustomerResourceResponse } from "./CustomerResource";
import { CustomerStatusResponse } from "./CustomerStatus";
import { UserResponse, UserRequest } from "./User";

export interface CustomerResponse extends BaseResponse {
    user: UserResponse;
    customerGroup: CustomerGroupResponse;
    customerStatus: CustomerStatusResponse;
    customerResource: CustomerResourceResponse;
}

export interface CustomerRequest {
    user: UserRequest;
    customerGroupId: number;
    customerStatusId: number;
    customerResourceId: number;
}
