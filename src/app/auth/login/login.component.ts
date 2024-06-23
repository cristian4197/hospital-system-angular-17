import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginForm } from '../../interfaces/login-form';
import { GoogleService } from '../../services/google.service';
import { Subscription } from 'rxjs';
import { IDataLoginStrategy } from '../../interfaces/login-strategy';
import { LoginPresenter } from './login.presenter';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginPresenter]

})

export default class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  private googleService = inject(GoogleService);

  private subscriptions: Subscription = new Subscription();

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [false]

  });

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private loginPresenter: LoginPresenter) { }

  async ngOnInit(): Promise<void> {
    this.onRememberEmail();
    await this.googleInit();
  }

  ngAfterViewInit(): void {
    // Renderiza boton de google
    this.loginPresenter.renderButtonGoogle(this.googleBtn.nativeElement);
  }

  onRememberEmail(): void {
    const email = localStorage.getItem('email');

    if (email) {
      this.loginForm.get('email')?.setValue(email);
    }

  }

  async googleInit(): Promise<void> {
    try {
      // Inicializa el servicio de google
      const credential = await this.googleService.googleInit();

      this.handleCredentialResponse(credential);
    } catch (error) {
      console.error('Error al inicializar servicio de Google');
    }

  }

  private handleCredentialResponse(credential: string) {
    // Datos para logeo con google
    const data:IDataLoginStrategy = {
      token: credential
    };
    
    this.loginPresenter.handleCredentialResponse(data);
  }

  onLogin(): void {
     // Datos para logeo con usuario y password
    const data:IDataLoginStrategy = {
      loginForm: this.loginForm.value as LoginForm
    };

    this.loginPresenter.login(data, this.loginForm.get('email') as AbstractControl);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}