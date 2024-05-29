import { environment } from "../../environments/environment";

export class User {
    private _name: string;
    private _email: string;
    private _password?: string;
    private _img?: string;
    private _google?: boolean;
    private _role?: string;
    private _uid?: string;

    constructor(
        name: string,
        email: string,
        password?: string,
        img?: string,
        google?: boolean,
        role?: string,
        uid?: string
    ) {
        this._name = name;
        this._email = email;
        this._password = password ? password : '';
        this._img = img;
        this._google = google;
        this._role = role;
        this._uid = uid;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get image(): string {
        if(this._img?.includes('https')) {
            return this._img;
        }
        
        if(!this._img) {
            return `${environment.base_url}/upload/users/no-image`;
        }
        
        return `${environment.base_url}/upload/users/${this._img}`;
    }

}