import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export default class RegisterComponent {
  public formSubmitted = false;


  public registerForm = this.fb.group({
    name: ['Cristian', [ Validators.required, Validators.minLength(3)]],
    email: ['csv@gmail.com', [ Validators.required, Validators.email ]],
    password: ['1234', [ Validators.required ]],
    passwordConfirm: ['1234', [ Validators.required ]],
    terms: [ true, [ Validators.required ]],
  }, {
    // se utiliza para agregar validaciones personalizadas que no se aplican a un campo de entrada específico
    validators: this.samePasswords('password', 'passwordConfirm')
  });

  private router = inject(Router);

  constructor (private fb: FormBuilder, 
               private userService: UserService
  ) {

  }

  createUser(): void {
    this.formSubmitted = true;
    
    if(this.registerForm.invalid) {
      return;
    }

    this.userService.createUser(this.registerForm.value)
        .subscribe({
          next: (resp) => {
            this.renderSwalAlertSuccess(true);

             this.redirectToPath('dashboard');
          },
          error: (err) => {
            this.renderSwalAlertSuccess(false);

          },
          complete: () => console.info('complete') 
        })
  }

  private renderSwalAlertSuccess(isSuccess: boolean, error?: any): void {
    if(isSuccess) {
      Swal.fire({
        title: 'Felicidades',
        text: 'Registro Exitoso',
        icon: 'success',
        confirmButtonText: 'Ok',
        timer: 1000
      });
      return;
    }

    Swal.fire({
      title: 'Error!',
      text: error.error.msg,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
    
  }

  private redirectToPath(path: string): void {
    this.router.navigate([`/${path}`]);
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

}
