import { IResponseBackDataUser } from "./reponse-get-user";

export interface IUpdateUserResponse {
    ok: boolean;
    user: IResponseBackDataUser;
}