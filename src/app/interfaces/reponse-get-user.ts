import { User } from "../models/user.model";

export interface IResponseDataUser {
    total: number;
    users: User[];
}