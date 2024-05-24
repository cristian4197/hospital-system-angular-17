import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserGoogle } from '../models/user.google.model';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private router = inject(Router);

  constructor(private http: HttpClient) { }

  tokenValidate(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    const url = `${base_url}/login/renew`;
    return this.http.get(url, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token)
      }),
      map(resp => true),
      catchError(error => of(false))
    );
  }

  createUser(formData: RegisterForm) {
    const url = `${base_url}/users`;

    return this.http.post(url, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );
  }

  login(formData: LoginForm) {
    const url = `${base_url}/login`;

    return this.http.post(url, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }
  
  logout(): void {
    const userGoogle: UserGoogle = JSON.parse(localStorage.getItem('userGoogle') as string);

    if (this.isGoogleSessionActive(userGoogle)) {
      this.clearSession(userGoogle.email);
    } else {
      // Si no hay token, remueve el token y redirige
      this.removeItemLocalStorage('token');
      this.redirecToLogin();
    }
  }

  private isGoogleSessionActive(userGoogle: UserGoogle): boolean {
    return !!(userGoogle && userGoogle.email);
  }

  private clearSession(email: string): void {
    this.revokeSessionGoogle(email).then(() => {
      this.clearLocalStorage();
      this.redirecToLogin();
    }).catch(err => {
      console.error('Error revoking token:', err);
    });;
  }

  private revokeSessionGoogle(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      google.accounts.id.revoke(email, (resp: any) => {
        if (resp.error) {
          reject(resp.error);
        } else {
          resolve();
        }
      });
    });

  }

  private clearLocalStorage(): void {
    localStorage.clear();
  }

  private removeItemLocalStorage(item: string) {
    localStorage.removeItem(item);
  }

  private redirecToLogin(): void {
    this.router.navigateByUrl('/auth');
  }
}
