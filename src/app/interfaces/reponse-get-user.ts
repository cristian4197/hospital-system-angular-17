import { User } from "../models/user.model";

export interface IResponseDataUser {
    total: number;
    users: User[];
}

export interface IResponseBackDataUser {
    name: string;
    email: string;
    role: string;
    google: boolean;
    img: string;
    uid: string;
}