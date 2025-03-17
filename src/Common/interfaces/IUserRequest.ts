import { ILooseObject } from "./ILooseObject";
import { IUser } from "./IUser";

export interface IUserRequest {
    user: IUser;
    body?: ILooseObject;
    params?: ILooseObject;
}