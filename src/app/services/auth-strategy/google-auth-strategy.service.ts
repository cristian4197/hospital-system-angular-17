import { Injectable, inject } from '@angular/core';
import { ILoginStrategy } from '../../interfaces/login-strategy';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ILoginGoogleResponse, ILoginResponse } from '../../interfaces/login-reponse';

const base_url = environment.base_url;

@Injectable({ providedIn: 'root' })
export class GoogleAuthStrategyService implements ILoginStrategy<string, ILoginGoogleResponse> {
  private http = inject(HttpClient);

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  signIn(data: string): Observable<ILoginGoogleResponse> {
    const token = data;
    return this.http.post<ILoginGoogleResponse>(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: ILoginGoogleResponse) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

}