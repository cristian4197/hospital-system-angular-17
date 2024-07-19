export interface ILoginResponse {
    ok: boolean;
    token: string;
}

export interface ILoginGoogleResponse {
    email: string;
    name: string;
    ok: boolean;
    picture: string;
    token: string;
}