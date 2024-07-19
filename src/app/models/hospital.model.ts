import { User } from "./user.model";
import { environment } from "../../environments/environment";

export class Hospital {
  private _name: string;
  private _user: User;
  private _img?: string;
  private _uid?: string;

  constructor(
    name: string,
    user: User,
    img?: string,
    uid?: string

  ) {
    this._name = name;
    this._user = user;
    this._img = img;
    this._uid = uid;
  }

  get name(): string {

    return this._name;
  }

  get user(): User {
    return new User(
      this._user.name,
      '',
      '',
      this._user.img
    );
  }

  get img(): string | undefined{
    return this._img;
  }

  get image(): string {
    if (this._img?.includes('https') || this._img?.includes('http')) {
      return this._img;
    }

    if (!this._img) {
      return `${environment.base_url}/upload/hospitals/no-image`;
    }

    return `${environment.base_url}/upload/hospitals/${this._img}`;
  }

  get uid(): string | undefined {
    return this._uid;
  }
}