import BaseResponse from "./BaseResponse";
import { MessageResponse } from "./Message";

export interface RoomResponse extends BaseResponse {
    name: string;
    user: UserResponse;
    lastMessage: MessageResponse;
}

interface UserResponse {
    id: number;
    username: string;
    fullname: string;
    email: string;
}

export interface RoomRequest {
    name: string;
    userId: number;
}
