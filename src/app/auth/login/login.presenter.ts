import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import { GoogleService } from '../../services/google.service';
import { GoogleAuthStrategyService } from '../../services/auth-strategy/google-auth-strategy.service';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../../services/auth-strategy/auth.service';
import { UserGoogle } from '../../models/user.google.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { UserNameStrategyService } from '../../services/auth-strategy/username-auth-strategy.service';
import { ILoginGoogleResponse, ILoginResponse } from '../../interfaces/login-reponse';
import { ILoginForm } from '../../interfaces/login-form';

@Injectable()
export class LoginPresenter implements OnDestroy {

  private subscriptions: Subscription = new Subscription();

  private googleLoginService!: AuthService<string, ILoginGoogleResponse>;

  private usernameAndPasswordService!: AuthService<ILoginForm, ILoginResponse>;

  constructor(
    private googleService: GoogleService,
    private googleAuthStrategy: GoogleAuthStrategyService,
    private usernameAuthStrategy: UserNameStrategyService,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.createInstanceOfAuthentication();
    this.setStrategys();
  }


  ngOnInit() { }

  private createInstanceOfAuthentication(): void {
    this.googleLoginService = new AuthService<string, ILoginGoogleResponse>();
    this.usernameAndPasswordService = new AuthService<ILoginForm, ILoginResponse>();
  }

  private setStrategys(): void {
     // Seteamos la estrategia de login por Google
    this.googleLoginService.setStrategy(this.googleAuthStrategy);
    // Seteamos la estrategia de usuario y password
    this.usernameAndPasswordService.setStrategy(this.usernameAuthStrategy);
  }

  renderButtonGoogle(button: ElementRef): void {
    this.googleService.renderButton(button);
  }

  handleCredentialResponse(token: string): void {
    this.subscriptions.add(
      this.googleLoginService.signIn(token)
        .subscribe(
          {
            next: (resp: ILoginGoogleResponse) => {
              this.setUserGoogle(resp);
              this.ngZone.run(() => this.redirectToPath('/dashboard'));
            },

            error: (err: Error) => {
              Swal.fire({
                title: 'Error!',
                text: 'Google login failed. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        )
    );
  }

  private setUserGoogle(resp: ILoginGoogleResponse): void {    
    const { email, name, picture, token } = resp
    const userGoogle: UserGoogle = {
      email,
      name,
      picture,
      token
    }
    localStorage.setItem('userGoogle', JSON.stringify(userGoogle));
  }

  login(data: ILoginForm, control: AbstractControl): void {
    this.subscriptions.add(
      this.usernameAndPasswordService.signIn(data)
        .subscribe({
          next: (resp: ILoginResponse) => {
            this.validateRememberEmail(control);
            this.redirectToPath('dashboard');
          },
          error: (err: Error) => {
            Swal.fire({
              title: 'Error!',
              text: 'Error en Conexión',
              icon: 'error',
              confirmButtonText: 'ok'
            });
          },
          complete: () => { }
        })
    );
  }

  private validateRememberEmail(control: AbstractControl): void {
    if (control.value) {
      localStorage.setItem('email', control.value as string);
    } else {
      localStorage.removeItem('email');
    }
  }


  private redirectToPath(path: string): void {
    this.router.navigate([`/${path}`]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}