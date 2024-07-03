import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { ModalCreateUserPresenter } from './modal-create-user.presenter';

@Component({
  selector: 'app-modal-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-create-user.component.html',
  styleUrl: './modal-create-user.component.css',
  providers: [ModalCreateUserPresenter]
})
export class ModalCreateUserComponent implements OnChanges, OnDestroy {
  @Input() openModal = false;

  @Output() closeModalEmit = new EventEmitter<void>();

  @Output() refreshViewUserEmit = new EventEmitter<void>();

  public registerForm: FormGroup = this.initializeForm();

  public formSubmitted = false;



  constructor(private fb: FormBuilder,
              private modalCreateUserPresenter: ModalCreateUserPresenter){ }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['openModal'].currentValue) {
      this.showModal();
    }
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', [ Validators.required, Validators.minLength(3)]],
      email: ['', [ Validators.required, Validators.email ]],
      password: ['', [ Validators.required ]],
      passwordConfirm: ['', [ Validators.required ]],
      terms: [ true, [ Validators.required ]],
    }, {
      // se utiliza para agregar validaciones personalizadas que no se aplican a un campo de entrada específico
      validators: this.samePasswords('password', 'passwordConfirm')
    });
  }

  private showModal(): void {
    this.modalCreateUserPresenter.showModal('#createUserModal');
  }

  private closeModal(): void {
    this.modalCreateUserPresenter.closeModal('#createUserModal','.modal-backdrop');
  }

  isInputInvalid(name: string) : boolean {
    return (this.registerForm.get(name)!.invalid && this.formSubmitted);
  }

  isTermsAgree(): boolean {
    // Negamos porque el valor por defecto es false
    return (!this.registerForm.get('terms')!.value as boolean && this.formSubmitted);
  }

  getControlValue(name: string) {  
    return this.registerForm.get(name)?.value;
}

  passwordsNotValid(): boolean {
    const password = this.getControlValue('password') as string;
    const passwordConfirm = this.getControlValue('passwordConfirm') as string;
    
    
    return password !== passwordConfirm && this.formSubmitted;
  }

  samePasswords(password: string, passwordConfirm: string) {
    return (formGroup: FormGroup)  => {
      const passwordControl = formGroup.get(password);
      const passwordConfirmControl = formGroup.get(passwordConfirm);

      if(passwordControl?.value === passwordConfirmControl?.value) {
        passwordConfirmControl?.setErrors(null);
      } else {
        passwordConfirmControl?.setErrors({
          notEqual: true
        });
      }
    }
  }

  createUser(): void {
    this.formSubmitted = true;
    if(this.registerForm.invalid) {
      return;
    }

    this.modalCreateUserPresenter.createUser(this.registerForm);
  }

  clickAcrossModal(): void {
    this.closeModalEmit.emit();
  }

  ngOnDestroy(): void {
    this.closeModal();
  }
}
