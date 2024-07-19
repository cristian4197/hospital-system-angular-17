import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnInit } from '@angular/core';
import { ModalCreateHospitalPresenter } from './modal-create-hospital.presenter';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardImageComponent } from '../../../../components/card-image/card-image.component';
import { User } from '../../../../models/user.model';
import { Subscription, timer } from 'rxjs';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-modal-create-hospital',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CardImageComponent],
  templateUrl: './modal-create-hospital.component.html',
  styleUrl: './modal-create-hospital.component.css',
  providers: [ModalCreateHospitalPresenter]
})
export class ModalCreateHospitalComponent implements OnInit, OnChanges {
  @Input() openModal = false;

  @Output() closeModalEmit = new EventEmitter<void>();

  @Output() refreshViewHospitalEmit = new EventEmitter<void>();

  private subscriptions: Subscription = new Subscription();

  public hospitalRegisterForm: FormGroup = this.initializeForm();

  public imageTemp: string | ArrayBuffer | null = null;

  private imageToUpload!: File;

  public formSubmitted = false;

  public currentUserSession!: User;

  constructor(private fb: FormBuilder,
    private modalCreateHospitalPresenter: ModalCreateHospitalPresenter,
    private userService:UserService) { }

  ngOnInit(): void {
    this.getCurrentUserSession();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openModal'].currentValue) {
      this.showModal();
    }else {
      this.closeModal();
    }
  }

  getCurrentUserSession(): void {
    this.subscriptions.add(
      this.userService.user.subscribe({
        next: (user: User) => {
          this.currentUserSession = user;
          
        },
        error: (error) => { console.error(error); }
      })
    );
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  clickAcrossModal(): void {
    this.closeModalEmit.emit();
  }

  isInputInvalid(name: string): boolean {
    return (this.hospitalRegisterForm.get(name)!.invalid && this.formSubmitted);
  }

  private showModal(): void {
    this.modalCreateHospitalPresenter.showModal('#createHospitalModal');
  }

  private closeModal(): void {
    this.modalCreateHospitalPresenter.closeModal('#createHospitalModal', '.modal-backdrop');
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
      this.imageTemp = await this.modalCreateHospitalPresenter.loadImageTempPreview(file);

    } catch (error) {
      this.imageTemp = null;
    }
  }


  createHospital(): void {
    this.formSubmitted = true;
    if (this.hospitalRegisterForm.invalid) {
      return;
    }

    if (!this.imageToUpload) {
      this.modalCreateHospitalPresenter.createHospital(this.hospitalRegisterForm);
      this.closeModalEmit.emit();
      return;
    }

    this.modalCreateHospitalPresenter.createHospital(this.hospitalRegisterForm, this.imageToUpload);
    this.closeModalEmit.emit();
  }


}
