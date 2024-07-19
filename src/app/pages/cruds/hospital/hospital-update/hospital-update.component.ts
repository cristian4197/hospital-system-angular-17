import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from '../../../../components/back-button/back-button.component';
import { HospitalUpdatePresenter } from './hospital-update.presenter';
import { CardImageComponent } from '../../../../components/card-image/card-image.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Hospital } from '../../../../models/hospital.model';
import { IDataUpdateHospital, IHospitalUpdateResponse } from '../../../../interfaces/hospital-update-response';
import { TUploadResponse } from '../../../../interfaces/upload-response';

@Component({
  selector: 'app-hospital-update',
  standalone: true,
  imports: [BackButtonComponent, CardImageComponent, ReactiveFormsModule],
  templateUrl: './hospital-update.component.html',
  styleUrl: './hospital-update.component.css',
  providers: [HospitalUpdatePresenter]

})
export default class HospitalUpdateComponent implements OnInit {

  private hospitalUID: string = '';

  private hospital!: Hospital;

  private subscriptions: Subscription = new Subscription();

  public imageTemp!: string | ArrayBuffer | null;

  public imageToUpload!: File;

  public updateForm = this.fb.group({
    name: ['', [Validators.required]],
    lastModifier: ['', [Validators.required]]
  });

  get imageSrc(): string {
    return !this.imageTemp ? this.hospital?.image : this.imageTemp as string;
  }

  constructor(
    private route: ActivatedRoute,
    private hospitalUpdatePresenter: HospitalUpdatePresenter,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getQueryParamas();
  }

  getQueryParamas(): void {
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        this.hospitalUID = params['id'];
        this.getHospitalById(this.hospitalUID);
      })
    );
  }


  getHospitalById(id: string): void {
    this.hospitalUpdatePresenter.getHospitalById(id).subscribe({
      next: (hospital: Hospital) => {
        this.hospital = hospital;
        this.setFormValuesInitial();
      },
      error: (err) => {console.log(err);
      }
    });
  }

  private setFormValuesInitial(): void {
    this.updateForm.patchValue({
      name: this.hospital.name,
      lastModifier: this.hospital.user.name
    });
  }


  redirectoHospitalList(): void {
    this.hospitalUpdatePresenter.redirectoHospitalList();
  }

  updateUser(): void {
    const data: IDataUpdateHospital = {
      name: this.updateForm.get('name')?.value as string,
      uid: this.hospitalUID
    };

    this.subscriptions.add(
      this.hospitalUpdatePresenter.updateHospital(data).subscribe({
        next: ( resp:IHospitalUpdateResponse ) => {
          this.hospitalUpdatePresenter.updateHospitalSucess();
        },
        error: (error: Error) => {
          this.hospitalUpdatePresenter.errorToUpdate();
        }
      })
    );
    
  }

  currentRoleOption(opcion: string): void {

  }


  async changeFile(event: Event): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const image = inputElement.files[0];
      this.imageToUpload = image;
      await this.loadImagePreview(image);
    } else {
      // En caso no se seleccione
      this.imageTemp = null;
    }

  }

  private async loadImagePreview(file: File): Promise<void> {
    try {
      this.imageTemp = await this.hospitalUpdatePresenter.loadImageTempPreview(file);

    } catch (error) {
      this.imageTemp = null;
    }
  }

  uploadImageChanged(): void {
    this.hospitalUpdatePresenter.updatePhoto(this.imageToUpload, this.hospital.uid as string)
      .then((resp: TUploadResponse) => {
        if(resp.ok) {
          this.hospitalUpdatePresenter.updateProfileSucess();
        } else {
          this.hospitalUpdatePresenter.errorToupdateProfile();
        }
      })
      .catch(error => {
        this.hospitalUpdatePresenter.errorToupdateProfile();
      })

  }

}
