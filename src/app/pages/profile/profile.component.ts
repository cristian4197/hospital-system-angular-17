import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/user';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { UploadFileService } from '../../services/upload-file.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent implements OnInit, OnDestroy {
  public user!: User;

  public profileForm = this.fb.group({
    user: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  public imageToUpload!: File;

  private subscriptions: Subscription = new Subscription();

  public imageTemp: any;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private uploadFileService: UploadFileService) { }

  ngOnInit(): void {

    this.setUserData()
    this.setFormValuesInitial();
  }

  private setUserData(): void {
    this.subscriptions.add(
      this.userService.user.subscribe(
        resp => {
          this.user = resp
        }
      )
    );
  }

  private setFormValuesInitial(): void {
    this.profileForm.patchValue({
      user: this.user.name,
      email: this.user.email
    });
  }

  updateUser(): void {
    const user: IUser = {
      email: this.profileForm.get('email')?.value as string,
      name: this.profileForm.get('user')?.value as string
    }

    if (!this.user.uid) {
      Swal.fire({
        title: 'Error!',
        text: 'Error en Actualización',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.proccessReponseUpdate(this.user.uid, user);
  }

  private proccessReponseUpdate(uid: string, user: IUser) {
    this.subscriptions.add(
      this.userService.updateUser(uid, user).subscribe(
        {
          next: (resp) => {
            Swal.fire({
              title: 'Felicidades',
              text: 'Actualización Exitosa',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          },
          error: (error) => {
            Swal.fire({
              title: error.message,
              text: error.cause,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      )
    );

  }

  changeFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    // const isFileSelected = 
    if (inputElement.files && inputElement.files.length > 0) {
      const image = inputElement.files[0];
      this.imageToUpload = image;
      this.loadImageTempPreview(image);
    } else {
      // En caso no se seleccione
      this.imageTemp = null;
    }

  }

  private loadImageTempPreview(file: File): void {
    // Ver imagen en tiempo real
    const reader =  new FileReader();
          reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imageTemp = reader.result ;
    }
  }

  uploadImageChanged() {
    this.uploadFileService.updatePhoto(this.imageToUpload, 'users', this.user.uid as string)
      .then(resp => {
        this.userService.updateUserImage(resp.nameFile);
        Swal.fire({
          title: 'Felicidades',
          text: 'Actualización de Perfil Exitosa',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      })
      .catch(error => {
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar perfil',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
