import { Injectable } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { BoostrapService } from '../../../../services/boostrap.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IResponseDataHospital } from '../../../../interfaces/response-get-hospitals';
import { HospitalService } from '../../../../services/hospital.service';
import { UtilService } from '../../../../services/utils.service';
import { Hospital } from '../../../../models/hospital.model';
import Swal from 'sweetalert2';

@Injectable()
export class HospitalPresenter {
  constructor(private userService: UserService,
    private hospitalService: HospitalService,
    private boostrapService: BoostrapService,
    private utilService: UtilService) { }

  getCurrentUserSession(): Observable<User> {
    return this.userService.user;
  }

  getHospitals(from: number): Observable<IResponseDataHospital> {
    return this.hospitalService.getHospitals(from).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error al Consultar Datos', { cause: error.error.msg }));
      })
    );
  }


  searchUserByName(value: string): Observable<Hospital[]> {
    return this.hospitalService.searchHospitalByName(value);
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