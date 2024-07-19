import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Hospital } from '../../../../models/hospital.model';
import { HospitalService } from '../../../../services/hospital.service';
import { IDataUpdateHospital, IHospitalUpdateResponse } from '../../../../interfaces/hospital-update-response';
import Swal from 'sweetalert2';
import { UtilService } from '../../../../services/utils.service';
import { UploadFileService } from '../../../../services/upload-file.service';

@Injectable()
export class HospitalUpdatePresenter {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private hospitalService: HospitalService,
    private utilService: UtilService,
    private uploadFileService: UploadFileService) { }

  getHospitalById(id: string): Observable<Hospital> {
    return this.hospitalService.getHospitalById(id);
  }

  updateHospital(data: IDataUpdateHospital): Observable<IHospitalUpdateResponse> {
    return this.hospitalService.updateHospital(data);
  }

  updateHospitalSucess(): void {
    Swal.fire({
      title: 'Felicidades',
      text: 'Actualización Exitosa',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  errorToUpdate(): void {
    Swal.fire({
      title: 'Error!',
      text: 'Error en Actualización',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  loadImageTempPreview(file: File): Promise<string | ArrayBuffer | null> {
    return this.utilService.loadImageTempPreview(file);
  }

  updatePhoto(imageToUpload: File, uid: string) {
    return this.uploadFileService.updatePhoto(imageToUpload, 'hospitals', uid);
  }

  redirectoHospitalList(): void {
    this.redirectToPath('../hospital-list');
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

  private redirectToPath(path: string): void {
    //  utiliza relativeTo para indicar que path es relativo a la ruta actual.
    this.router.navigate([path], { relativeTo: this.route });
  }

  //Opción 2:con rutas absolutas
  // onClickButtonEmit(): void {
  //   this.redirectToPath('/dashboard/hospitals/hospital-list');
  // }

  // private redirectToPath(path: string): void {
  //   this.router.navigate([path]);
  // }

}