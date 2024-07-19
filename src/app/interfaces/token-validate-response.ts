import { IResponseBackDataUser } from "./reponse-get-user";

export interface IToKenValidateResponse {
    ok: boolean;
    token: string;
    user: IResponseBackDataUser;
}