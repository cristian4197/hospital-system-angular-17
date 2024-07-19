import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ILoginStrategy } from '../../interfaces/login-strategy';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ILoginForm } from '../../interfaces/login-form';
import { ILoginResponse } from '../../interfaces/login-reponse';

const base_url = environment.base_url;

@Injectable({ providedIn: 'root' })
export class UserNameStrategyService implements ILoginStrategy<ILoginForm, ILoginResponse> {
    private http = inject(HttpClient);

    signIn(form: ILoginForm): Observable<ILoginResponse> {
        
        const url = `${base_url}/login`;
        return this.http.post<ILoginResponse>(url, form)
            .pipe(
                tap((resp: ILoginResponse) => {
                    localStorage.setItem('token', resp.token)
                }),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => new Error('Error en Conexión'));
                })
            );
    }

}