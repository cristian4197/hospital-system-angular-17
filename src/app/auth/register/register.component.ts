import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterPresenter } from './register.presenter';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterPresenter]
})
export default class RegisterComponent {
  public formSubmitted = false;


  public registerForm: FormGroup = this.initializeForm();


  constructor (private fb: FormBuilder, 
               private registerPresenter: RegisterPresenter
  ) {

  }
 
  createUser(): void {
    this.formSubmitted = true;
    
    if(this.registerForm.invalid) {
      return;
    }

    this.registerPresenter.createUser(this.registerForm);    
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
