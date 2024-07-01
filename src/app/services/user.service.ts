import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form';
import { environment } from '../../environments/environment';
import { catchError, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserGoogle } from '../models/user.google.model';
import { User } from '../models/user.model';
import { GoogleService } from './google.service';
import { IDeleteUser, IUser } from '../interfaces/user';
import Swal from 'sweetalert2';
import { ErrorCodes } from '../const/error.const';
import { IResponseDataUser } from '../interfaces/reponse-get-user';

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

  private _isCurrentRoleChanged = false;
  
  get user(): Observable<User> {
    return this.user$.asObservable();
  }

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get isCurrentRoleChanged(): boolean {
    return this._isCurrentRoleChanged;
  }


  getUsers(from: number): Observable<IResponseDataUser> {
    const url = `${base_url}/users?from=${from}`;
    const headers = new HttpHeaders({ 'x-token': this.token });
    return this.http.get<IResponseDataUser>(url, { headers }).pipe(
      map((resp: IResponseDataUser) => {
        return this.getUsersDataResponse(resp);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error al Registrar', { cause: error.error.msg }));
      })
    );
  }

  getUsersById(id: string): Observable<User> {
    const url = `${base_url}/users/detail?id=${id}`;
    const headers = new HttpHeaders({ 'x-token': this.token });
    return this.http.get<User>(url, { headers }).pipe(
      map((resp: any) => {
        const { user } = resp;
        return new User(
          user.name,
          user.email,
          '',
          user.img,
          user.google,
          user.role,
          user.uid
        );
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error al Registrar', { cause: error.error.msg }));
      })
    );
  }

  private getUsersDataResponse(resp: IResponseDataUser): IResponseDataUser {
    const usersFilters = this.filterUsersWitOUtCurrentUser(resp.users);
    const dataResponse: IResponseDataUser = {
      total: resp.total,
      users: this.returnArrayOfUsers(usersFilters)
    };

    return dataResponse;
  }

  private filterUsersWitOUtCurrentUser(user: User[]): User[] {
    const { uid } = this.user$.getValue();
    // Quitamos el user Actual
    return user.filter(user => user.uid !== uid);
  }

  private returnArrayOfUsers(users: User[]): User[] {
    // Hacemos esto para obtener la url de la imagen correctamente
    // debido a que al instanciar new User se arma correctamente la url
    return users.map((userData: any) => new User(
      userData.name,
      userData.email,
      '',
      userData.img,
      userData.google,
      userData.role,
      userData.uid
    ))
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

  updateUserImage(urlImage: string, isCurrentSessionUser: boolean): void {
    if (!isCurrentSessionUser) { return; }
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
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Error al Registrar', { cause: error.error.msg }))
        })
      );
  }

  updateUser(uid: string, userForm: IUser, isCurrentSessionUser: boolean) {

    return this.user$.pipe(takeUntil(this.unsubscribe$),// takeUntil: Completa la suscripción cuando `unsubscribe$` emite un valor
      take(1), // Asegura que solo se procese una emisión
      switchMap((resp: User) => {
        const { updatedUserForm, url, headers } = this.getDataToRequest(userForm, resp.role as string, uid);
        
        return this.http.put(url, updatedUserForm, { headers }).pipe(
          tap((resp: any) => {
            // Solo cambiamos la data actual para el presente usuario para no modificar los datos de profile
            if (isCurrentSessionUser) { this.updateDataUser(resp.user); }
          })
        );
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error al actualizar', { cause: error.error.msg }))
      })
    );
  }

  private shouldChangeRole(currentRole: string, newRole: string): boolean {
    if (!newRole) { return false; }
    return currentRole !== newRole;
  }

  private getDataToRequest(userForm: IUser, role: string, uid: string) {
    const changeRole = this.shouldChangeRole(role as string, userForm.role as string);
    const url = `${base_url}/users/${uid}`;
    const headers = new HttpHeaders({ 'x-token': this.token });
    let updatedUserForm: IUser = { ...userForm };
    if (!changeRole) {
      // Preparamos los datos para actualizar cuando el role no cambia
       updatedUserForm = { ...updatedUserForm, role }; //Copia todas sus propiedades y añade el rol actual en BD
      return { updatedUserForm, url, headers };
    }
  
  // Preparamos los datos para actualizar cuando el nuevo rol y otras propiedades que cambian
    this._isCurrentRoleChanged = true;
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

  searchUserByName(name: string): Observable<User[]> {
    const url = `${base_url}/searches/schema/users/${name}`;
    const headers = new HttpHeaders({ 'x-token': this.token });

    return this.http.get<User[]>(url, { headers }).pipe(
      map((resp: any) => {
        return this.returnArrayOfUsers(resp.results)
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error en busqueda', { cause: error.error.msg }))
      })
    )
  }

  deleteUser(id: string): Observable<IDeleteUser> {
    const url = `${base_url}/users/${id}`;
    const headers = new HttpHeaders({ 'x-token': this.token });

    return this.http.delete<IDeleteUser>(url, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Error al borrar usuario', { cause: error.error.msg }))
        })
      );
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
