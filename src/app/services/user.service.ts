import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, inject } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserGoogle } from '../models/user.google.model';
import { User } from '../models/user.model';
import { GoogleService } from './google.service';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private router = inject(Router);
 
  private googleService = inject(GoogleService);
  
  public user!:User;

  constructor(private http: HttpClient,  private ngZone: NgZone) { }

  tokenValidate(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    const url = `${base_url}/login/renew`;
    return this.http.get(url, {
      headers: {
        'x-token': token
      }
    }).pipe(
      map((resp: any) => {        
        const user = this.userInitialize(resp.user);
        this.user = user;
                
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  userInitialize(user: any): User {
    const { name, email, role, google, img, uid } = user;
    return new User(name, email, '', img, google, role, uid);
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
    this.googleService.revokeSessionGoogle(email).then(() => {
      this.clearLocalStorage();
      this.redirecToLogin();
    }).catch(err => {
      console.error('Error revoking token:', err);
    });;
  }



  private clearLocalStorage(): void {
    localStorage.clear();
  }

  private removeItemLocalStorage(item: string) {
    localStorage.removeItem(item);
  }

  private redirecToLogin(): void {
    this.ngZone.run(()=> this.router.navigateByUrl('/auth'));
   
  }
}
