import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginForm } from '../../interfaces/login-form';

import { UserGoogle } from '../../models/user.google.model';
import { GoogleService } from '../../services/google.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})

export default class LoginComponent implements OnInit, AfterViewInit {

  private router = inject(Router);

  private userService = inject(UserService);

  private googleService = inject(GoogleService);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [false]

  });

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  constructor(private fb: FormBuilder,

    private ngZone: NgZone) { }

  async ngOnInit(): Promise<void> {
    this.onRememberEmail();
    await this.googleInit();
  }

  ngAfterViewInit(): void {
    this.googleService.renderButton(this.googleBtn.nativeElement);
  }

  onRememberEmail(): void {
    const email = localStorage.getItem('email');

    if (email) {
      this.loginForm.get('email')?.setValue(email);
    }

  }

  async googleInit(): Promise<void> {
    try {
      const credential = await this.googleService.googleInit();

      this.handleCredentialResponse(credential);
    } catch (error) {
      console.error('Error al inicializar servicio de Google');
    }

  }

  private handleCredentialResponse(credential: any) {
    this.userService.loginGoogle(credential)
      .subscribe(
        {
          next: (resp) => {
            this.setUserGoogle(resp);
            this.ngZone.run(() => this.redirectToPath('/dashboard'));
          },

          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Google login failed. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      );
  }

  private setUserGoogle(resp: any): void {
    const { email, name, picture, token } = resp
    const userGoogle: UserGoogle = {
      email,
      name,
      picture,
      token
    }
    localStorage.setItem('userGoogle', JSON.stringify(userGoogle));
  }

  private redirectToPath(path: string): void {
    this.router.navigate([`/${path}`]);
  }

  onLogin(): void {
    this.userService.login(this.loginForm.value as LoginForm)
      .subscribe({
        next: (resp) => {
          this.validateRememberEmail();
          this.redirectToPath('dashboard');
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: err.error.msg,
            icon: 'error',
            confirmButtonText: 'ok'
          });
        },
        complete: () => { }
      });
  }



  private validateRememberEmail(): void {
    if (this.loginForm.get('remember')?.value) {
      localStorage.setItem('email', this.loginForm.get('email')?.value as string);
    } else {
      localStorage.removeItem('email');
    }
  }
}