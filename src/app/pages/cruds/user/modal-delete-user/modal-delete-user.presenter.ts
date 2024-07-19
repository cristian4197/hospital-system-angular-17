import { Injectable } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { Observable } from 'rxjs';
import { IDeleteUser } from '../../../../interfaces/user';
import Swal from 'sweetalert2';
import { BoostrapService } from '../../../../services/boostrap.service';

@Injectable()
export class ModalDeleteUserPresenter {
    constructor(private userService: UserService, private boostrapService: BoostrapService) { }

    deleteUser(uid: string): Observable<IDeleteUser> {
        return this.userService.deleteUser(uid);
    }

    successfulDeletion(): void {
        Swal.fire({
            title: 'Felicidades',
            text: 'Eliminación Exitosa',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    }

    errorDeleting(error: Error): void {
        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    closeModal(id: string): void {
        this.boostrapService.closeModal(id);
    }

}