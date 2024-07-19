import { Observable } from "rxjs";

export interface ILoginStrategy<T = undefined, R = undefined> {
    signIn(data: T): Observable<R>;
}