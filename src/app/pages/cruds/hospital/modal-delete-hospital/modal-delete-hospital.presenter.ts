import { Injectable } from '@angular/core';
import { IHospitalDeleteResponse } from '../../../../interfaces/hospital-user-delete-response';
import { HospitalService } from '../../../../services/hospital.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { BoostrapService } from '../../../../services/boostrap.service';

@Injectable()
export class ModalDeleteHospitalPresenter {
  constructor(private hospitalService: HospitalService, private boostrapService: BoostrapService) { }

  deleteHospital(uid: string): Observable<IHospitalDeleteResponse> {
    return this.hospitalService.deleteUser(uid);
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