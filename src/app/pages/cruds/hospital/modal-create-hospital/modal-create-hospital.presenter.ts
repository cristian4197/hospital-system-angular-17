import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { BoostrapService } from "../../../../services/boostrap.service";
import { UtilService } from '../../../../services/utils.service';
import { FormGroup } from "@angular/forms";
import { UploadFileService } from "../../../../services/upload-file.service";
import { User } from "../../../../models/user.model";
import { HospitalService } from "../../../../services/hospital.service";
import { IHospitalResponse } from "../../../../interfaces/hospital-register-form";
import Swal from "sweetalert2";

@Injectable()
export class ModalCreateHospitalPresenter implements OnDestroy {

  private subscriptions: Subscription = new Subscription();

  public currentUserSession!: User;

  constructor(
    private boostrapService: BoostrapService,
    private utilService: UtilService,
    private uploadFileService: UploadFileService,
    private hospitalService: HospitalService) { }


  showModal(idModal: string): void {
    this.boostrapService.openModal(idModal);
  }

  // nodeRemoved es porque el fondo de la modal no se quita solo al redirigir la pagina sin cerra la modal
  closeModal(idModal: string, nodeRemoved: string): void {
    this.subscriptions.add(
      //Vamos a generar un delay para que la modal se ciere despues de 1 segundo
      timer(1000).subscribe(()=> {
        this.boostrapService.closeModal(idModal);
        this.utilService.removeNode(nodeRemoved);
      })
    );    
  }

  createHospital(controls: FormGroup, image?: File): void {
    this.subscriptions.add(
      this.hospitalService.createHospital(controls.value).subscribe(
        {
          next: async (resp: IHospitalResponse) => {
            //Si no hay imagen
            if (!image) {
              this.createHospitalSuccess();
              return;
            }

            // Si hay imagen
            await this.createHospitalWithImage(image, resp.hospital._id);
          },
          error: () => {
            this.createHospitalError();
          }
        }
      )
    );
  }

  private async createHospitalWithImage(image: File, userUID: string): Promise<void> {
    try {
      await this.updatePhoto(image, userUID);
      this.createHospitalSuccess();
    } catch (error) {
      this.createHospitalError();
    }

  }


  updatePhoto(imageToUpload: File, uid: string) {
    return this.uploadFileService.updatePhoto(imageToUpload, 'hospitals', uid);
  }

  createHospitalSuccess(): void {
    Swal.fire({
      title: '¡Felicidades!',
      text: 'Creación de Hospital Exitosa',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  createHospitalError(): void {
    Swal.fire({
      title: 'Error!',
      text: 'Error en Registro',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  loadImageTempPreview(file: File): Promise<string | ArrayBuffer | null> {
    return this.utilService.loadImageTempPreview(file);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}