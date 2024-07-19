import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.model';
import { IUser } from '../../../../interfaces/user';
import { UserUpdatePresenter } from './user-update.presenter';
import { roleDescriptionMap, roles } from '../../../../const/roles.const';
import { CardImageComponent } from '../../../../components/card-image/card-image.component';
import { BackButtonComponent } from '../../../../components/back-button/back-button.component';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardImageComponent, BackButtonComponent],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css',
  providers: [UserUpdatePresenter]
})
export default class UserUpdateComponent implements OnInit, OnDestroy {
  private userUID: string = '';

  private subscriptions: Subscription = new Subscription();

  public currentUserSession!: User;

  public updateForm = this.fb.group({
    user: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['',[Validators.required]]
  });

  public roles: string[] = roles;

  public roleDescriptionMap: { [key: string]: string } = roleDescriptionMap;

  public user!: User;

  public imageTemp!: string | ArrayBuffer | null;

  public imageToUpload!: File;

  get currentRole(): string{
    const role = this.roleDescriptionMap[this.updateForm.get('role')?.value as string];
    return role || 'Seleccione Rol';
  }

  get imageSrc(): string {
    return !this.imageTemp ? this.user?.image : this.imageTemp as string;
  }

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private userUpdatePresenter: UserUpdatePresenter
  ) {}

  ngOnInit(): void {
    this.getQueryParamas();
    this.getCurrentUserSession();
  }

  getCurrentUserSession(): void {
    this.subscriptions.add(
      this.userUpdatePresenter.getCurrentUserSession().subscribe({
        next: (user: User) => {
          this.currentUserSession = user;
        },
        error: (error) => { console.error(error); }
      })
    );
  }

  getQueryParamas(): void {
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        this.userUID = params['id'];
        this.getUserById(this.userUID)
      })
    );
  }

  getUserById(id: string): void {
    this.userUpdatePresenter.getUsersById(id).subscribe({
      next: (user: User) => {
        this.user = user;
        this.setFormValuesInitial();
      },
      error: (err) => {console.log(err);
      }
    });
  }

  private setFormValuesInitial(): void {
    this.updateForm.patchValue({
      user: this.user.name,
      email: this.user.email,
      role: this.user.role
    });
  }

  updateUser(): void {
    const user: IUser = {
      email: this.updateForm.get('email')?.value as string,
      name: this.updateForm.get('user')?.value as string,
      role: this.updateForm.get('role')?.value as string
    }

    if (!this.user.uid) {
      this.userUpdatePresenter.errorGeneric();
      return;
    }

    this.proccessReponseUpdate(this.user.uid, user);
  }

  private proccessReponseUpdate(uid: string, user: IUser) {
    const isCurrentSessionUser = false;
    this.subscriptions.add(
      this.userUpdatePresenter.updateUser(uid, user, isCurrentSessionUser).subscribe(
        {
          next: (resp) => {
            this.userUpdatePresenter.updateUserSucess();
          },
          error: (error: Error) => {
            this.userUpdatePresenter.errorToUpdateUser(error.message, error.cause as string);
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
    const isCurrentSessionUser = false;
    this.userUpdatePresenter.updatePhoto(this.imageToUpload, 'users', this.user.uid as string)
      .then(resp => {
        if(resp.ok) {
          this.userUpdatePresenter.updateUserImage(resp.nameFile, isCurrentSessionUser);
          this.updateProfileSucess();
        } else {
          this.errorToupdateProfile();
        }
      })
      .catch(error => {
        this.errorToupdateProfile();
      })

  }

  private updateProfileSucess(): void {
    this.userUpdatePresenter.updateProfileSucess();
  }

  private errorToupdateProfile(): void {
    this.userUpdatePresenter.errorToupdateProfile();
  }

  currentRoleOption(opcion: string) {
    this.updateForm.get('role')?.setValue(opcion);
  }

  redirectUserList(): void {
    this.userUpdatePresenter.redirectUserList();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
