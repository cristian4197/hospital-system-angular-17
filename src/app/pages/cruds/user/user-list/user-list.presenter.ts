import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import { IResponseDataUser } from '../../../../interfaces/reponse-get-user';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../../models/user.model';
import { BoostrapService } from '../../../../services/boostrap.service';
import { UtilService } from '../../../../services/utils.service';

@Injectable()
export class UserListPresenter {

    constructor(private userService: UserService,
        private boostrapService: BoostrapService,
        private utilService: UtilService) { }

    getUsers(from: number): Observable<IResponseDataUser> {
        return this.userService.getUsers(from).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => new Error('Error al Consultar Datos', { cause: error.error.msg }));
            })
        );
    }

    getCurrentUserSession(): Observable<User> {
        return this.userService.user;
    }

    searchUserByName(value: string): Observable<User[]> {
        return this.userService.searchUserByName(value);
    }

    openModal(id: string): void {
        this.boostrapService.openModal(id);
    }

    closeModal(id: string): void {
        this.boostrapService.closeModal(id);
    }

    initTooltips(): void {
        this.boostrapService.initTooltips();
    }

    clearTooltip(tooltipElement: HTMLElement | null): void {
        this.utilService.clearTooltip(tooltipElement);
    }

    errorGeneric(): void {
        Swal.fire({
            title: 'Error!',
            text: 'Error en consulta de datos',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}