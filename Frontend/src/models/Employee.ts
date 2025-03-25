import BaseResponse from "./BaseResponse";
import { DepartmentResponse } from "./Department";
import { JobLevelResponse } from "./JobLevel";
import { JobTitleResponse } from "./JobTitle";
import { JobTypeResponse } from "./JobType";
import { OfficeResponse } from "./Office";
import { UserResponse, UserRequest } from "./User";

export interface EmployeeResponse extends BaseResponse {
    user: UserResponse;
    office: OfficeResponse;
    department: DepartmentResponse;
    jobType: JobTypeResponse;
    jobLevel: JobLevelResponse;
    jobTitle: JobTitleResponse;
}

export interface EmployeeRequest {
    user: UserRequest;
    officeId: number;
    departmentId: number;
    jobTypeId: number;
    jobLevelId: number;
    jobTitleId: number;
}
