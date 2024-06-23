import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IDataLoginStrategy, ILoginStrategy } from '../../interfaces/login-strategy';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({ providedIn: 'root' })
export class UserNameStrategyService implements ILoginStrategy {
    private http = inject(HttpClient);

    signIn(data: IDataLoginStrategy): Observable<any> {
        const url = `${base_url}/login`;
        return this.http.post(url, data.loginForm)
            .pipe(
                tap((resp: any) => {
                    localStorage.setItem('token', resp.token)
                }),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => new Error('Error en Conexión'));
                })
            );
    }

}