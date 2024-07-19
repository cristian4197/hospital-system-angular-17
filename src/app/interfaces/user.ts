export interface IUser {
    email?: string;
    name: string;
    role?: string;
    google?: string;
    uid?: string;
    img?: string;
}

export interface IDeleteUser {
    ok: boolean,
    msg: string
}