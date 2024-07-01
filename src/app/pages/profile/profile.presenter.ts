import { Injectable } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UploadFileService } from '../../services/upload-file.service';
import { IUser } from '../../interfaces/user';
import { User } from '../../models/user.model';
import { Observable, timer } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
type typeSchema = 'users' | 'doctors' | 'hospitals';

@Injectable()
export class ProfilePresenter {
  constructor(
    private userService: UserService,
    private uploadFileService: UploadFileService,
    private router: Router) { }
  
  updateUser(uid: string, user: IUser, isCurrentSessionUser: boolean) {
    return this.userService.updateUser(uid, user, isCurrentSessionUser);
  }

  updateUserImage(nameFile: string, isCurrentSessionUser: boolean): void {
    this.userService.updateUserImage(nameFile, isCurrentSessionUser);
  }

  updatePhoto(imageToUpload: File, schema: typeSchema, uid: string) {
    return this.uploadFileService.updatePhoto(imageToUpload, schema, uid);
  }

  getCurrentUserSession(): Observable<User> {
    return this.userService.user;
  }

  errorGeneric(): void {
    Swal.fire({
      title: 'Error!',
      text: 'Error en Actualización',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  updateUserSucess(): void {
    Swal.fire({
      title: 'Felicidades',
      text: 'Actualización Exitosa',
      icon: 'success',
      confirmButtonText: 'Ok'
    });

    //Si se cambia el role actual debe iniciar sesión nuevamente
    if( this.userService.isCurrentRoleChanged) {
      timer(2000).subscribe(() => {
        Swal.fire({
          title: 'Cambio de Rol',
          text: 'Inicie Sesión denuevo para continuar',
          icon: 'warning',
          confirmButtonText: 'Ok'
        });
      })


      timer(4000).subscribe(() => {
        this.redirectToPath('auth');
      })
    }
  }

  private redirectToPath(path: string): void {
    this.router.navigate([`/${path}`]);
}

  errorToUpdateUser(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  updateProfileSucess(): void {
    Swal.fire({
      title: 'Felicidades',
      text: 'Actualización de Perfil Exitosa',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  errorToupdateProfile(): void {
    Swal.fire({
      title: 'Error!',
      text: 'Error al actualizar perfil',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}
