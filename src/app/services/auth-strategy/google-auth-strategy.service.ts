import { Injectable, inject } from '@angular/core';
import { IDataLoginStrategy, ILoginStrategy } from '../../interfaces/login-strategy';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({ providedIn: 'root' })
export class GoogleAuthStrategyService implements ILoginStrategy {
  private http = inject(HttpClient);

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  signIn(data: IDataLoginStrategy): Observable<any> {
    const { token } = data;
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

}