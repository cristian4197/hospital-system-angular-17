import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form';
import { catchError, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserGoogle } from '../models/user.google.model';
import { User } from '../models/user.model';
import { GoogleService } from './google.service';
import { IUser } from '../interfaces/user';
import Swal from 'sweetalert2';
import { ErrorCodes } from '../const/error.const';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private router = inject(Router);

  private googleService = inject(GoogleService);

  private unsubscribe$ = new Subject<void>(); // Observable usado para notificar desuscripciones

  private user$: BehaviorSubject<User> = new BehaviorSubject(new User('', ''));//Para manejar la data del usuario y que desde otros componente se suscriban al observable y puedan obtener el valor actualizado

  get user(): Observable<User> {
    return this.user$.asObservable();
  }

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  tokenValidate(): Observable<boolean> {

    const url = `${base_url}/login/renew`;
    return this.http.get(url, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        this.setUser(resp);
        localStorage.setItem('token', resp.token);

        return true;
      }),
      catchError(error => of(false))
    );
  }

  setUser(resp: any): void {
    const user = this.getUserInstance(resp.user);
    this.user$.next(user);
  }

  private getUserInstance(user: any): User {
    const { name, email, role, google, img, uid } = user;
    return new User(name, email, '', img, google, role, uid);
  }

  updateUserImage(urlImage: string): void {
    const { name, email, role, google, uid } = this.user$.getValue();
    const updatedUser = new User(
      name,
      email,
      '',
      urlImage,
      google,
      role,
      uid
    );
    this.user$.next(updatedUser);
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

  updateUser(uid: string, userForm: IUser) {
    return this.user$.pipe(takeUntil(this.unsubscribe$),// takeUntil: Completa la suscripción cuando `unsubscribe$` emite un valor
      take(1), // Asegura que solo se procese una emisión
      switchMap((resp: User) => {
        const role = resp.role;
        const { updatedUserForm, url, headers } = this.getDataToRequest(userForm, role as string, uid);

        return this.http.put(url, updatedUserForm, { headers }).pipe(
          tap((resp: any) => {
            this.updateDataUser(resp.user);
          })
        );
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error al actualizar', { cause: error.error.msg }))
      })
    );
  }


  private getDataToRequest(userForm: IUser, role: string, uid: string) {
    const updatedUserForm: IUser = { ...userForm, role }; //Copia todas sus propiedades y añade el rol
    const url = `${base_url}/users/${uid}`;
    const headers = new HttpHeaders({ 'x-token': this.token });
    return { updatedUserForm, url, headers };
  }

  private updateDataUser(user: IUser): void {
    const { image, google, uid, } = this.user$.getValue();

    const updatedUser = new User(
      user.name,
      user.email,
      '',
      image,
      google,
      user.role,
      uid
    );

    this.user$.next(updatedUser);
  }


  login(formData: LoginForm) {
    const url = `${base_url}/login`;

    return this.http.post(url, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Error en Conexión'));
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
    this.ngZone.run(() => this.router.navigateByUrl('/auth'));

  }

  ngOnDestroy(): void {

    this.unsubscribe$.next(); //Es una señal que se envía para indicar que las suscripciones deben terminar
    //  Esto hace que cualquier Observable que esté suscrito usando takeUntil(this.unsubscribe$) se complete inmediatamente.
    this.unsubscribe$.complete();// Completa el Subject `unsubscribe$` para liberar recursos

  }

}
