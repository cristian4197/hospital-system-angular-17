import { IResponseBackDataUser } from "./reponse-get-user";

export interface ICreateUserResponse {
    ok: boolean;
    user: IResponseBackDataUser;
    token: string;
}