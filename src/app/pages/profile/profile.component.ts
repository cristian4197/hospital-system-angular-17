import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/user';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ProfilePresenter } from './profile.presenter';
import { roleDescriptionMap, roles } from '../../const/roles.const';
import { CardImageComponent } from '../../components/card-image/card-image.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CardImageComponent],
  providers: [ProfilePresenter],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent implements OnInit, OnDestroy {
  public user!: User;

  public profileForm = this.fb.group({
    user: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['',[Validators.required]]
  });

  public imageToUpload!: File;

  private subscriptions: Subscription = new Subscription();

  public imageTemp!: string | ArrayBuffer | null;

  public currentUserSession!: User;

  public roles: string[] = roles;

  public roleDescriptionMap: { [key: string]: string } = roleDescriptionMap;


  get currentRole(): string{
    const role = this.roleDescriptionMap[this.profileForm.get('role')?.value as string];
    return role || 'Seleccione Rol';
  }

  get imageSrc(): string {
    return !this.imageTemp ? this.user.image : this.imageTemp as string;
  }

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private profilePresenter: ProfilePresenter) { }

  ngOnInit(): void {    
    this.setUserData()
    this.setFormValuesInitial();
    this.getCurrentUserSession();
  }

  getCurrentUserSession(): void {
    this.subscriptions.add(
      this.profilePresenter.getCurrentUserSession().subscribe({
        next: (user: User) => {
          this.currentUserSession = user;
        },
        error: (error) => { console.error(error); }
      })
    );
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
      email: this.user.email,
      role: this.user.role
    });
  }

  updateUser(): void {
    const user: IUser = {
      email: this.profileForm.get('email')?.value as string,
      name: this.profileForm.get('user')?.value as string,
      role: this.profileForm.get('role')?.value as string
    }

    if (!this.user.uid) {
      this.profilePresenter.errorGeneric();
      return;
    }

    this.proccessReponseUpdate(this.user.uid, user);
  }

  private proccessReponseUpdate(uid: string, user: IUser) {
    const isCurrentSessionUser = true;
    this.subscriptions.add(
      this.profilePresenter.updateUser(uid, user, isCurrentSessionUser).subscribe(
        {
          next: (resp) => {
            this.profilePresenter.updateUserSucess();
          },
          error: (error) => {
            this.profilePresenter.errorToUpdateUser(error.message, error.cause as string);
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
    const isCurrentSessionUser = true;
    this.profilePresenter.updatePhoto(this.imageToUpload, 'users', this.user.uid as string)
      .then(resp => {
        if(resp.ok) {
          this.profilePresenter.updateUserImage(resp.nameFile, isCurrentSessionUser);
          this.profilePresenter.updateProfileSucess();
        } else {
          this.profilePresenter.errorToupdateProfile();
        }
      })
      .catch(error => {
        this.profilePresenter.errorToupdateProfile();
      })

  }

  currentRoleOption(opcion: string) {
    this.profileForm.get('role')?.setValue(opcion);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
