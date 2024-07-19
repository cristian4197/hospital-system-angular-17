import { Injectable } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { Observable, map, tap } from 'rxjs';
import { User } from '../../../../models/user.model';
import { IUser } from '../../../../interfaces/user';
import { UploadFileService } from '../../../../services/upload-file.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class UserUpdatePresenter {
    constructor(
        private userService: UserService,
        private uploadFileService: UploadFileService,
        private router: Router,
        private route: ActivatedRoute) { }

    getUsersById(id: string): Observable<User> {
        return this.userService.getUsersById(id);
    }

    getCurrentUserSession(): Observable<User> {
        return this.userService.user;
    }

    updateUser(uid: string, user: IUser, isCurrentSessionUser: boolean) {
        return this.userService.updateUser(uid, user, isCurrentSessionUser);
    }

    updatePhoto(imageToUpload: File, schema: string, uid: string) {
        return this.uploadFileService.updatePhoto(imageToUpload, 'users', uid);
    }

    updateUserImage(nameFile: string, isCurrentSessionUser: boolean): void {
        this.userService.updateUserImage(nameFile, isCurrentSessionUser);
    }

    redirectUserList(): void {
        this.redirectToPath('../user-list');
    }

    private redirectToPath(path: string): void {
        //  utiliza relativeTo para indicar que path es relativo a la ruta actual.
        this.router.navigate([path], { relativeTo: this.route });
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

    updateUserSucess(): void {
        Swal.fire({
            title: 'Felicidades',
            text: 'Actualización Exitosa',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    }

    errorToUpdateUser(title: string, text: string): void {
        Swal.fire({
            title,
            text,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    errorGeneric(): void {
        Swal.fire({
            title: 'Error!',
            text: 'Error en Actualización',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}