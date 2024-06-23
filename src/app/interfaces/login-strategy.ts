import { LoginForm } from "./login-form";
import { Observable } from "rxjs";

export interface ILoginStrategy {
    signIn(data: IDataLoginStrategy):Observable<any>;
}

export interface IDataLoginStrategy {
    loginForm?: LoginForm;
    token?: string;
}