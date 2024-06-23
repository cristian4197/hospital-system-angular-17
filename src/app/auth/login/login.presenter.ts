import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import { GoogleService } from '../../services/google.service';
import { GoogleAuthStrategyService } from '../../services/auth-strategy/google-auth-strategy.service';
import { IDataLoginStrategy } from '../../interfaces/login-strategy';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth-strategy/auth.service';
import { UserGoogle } from '../../models/user.google.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { UserNameStrategyService } from '../../services/auth-strategy/username-auth-strategy.service';

@Injectable()
export class LoginPresenter implements OnDestroy {

    private subscriptions: Subscription = new Subscription();

    constructor(
        private googleService: GoogleService,
        private googleAuthStrategy: GoogleAuthStrategyService,
        private ngZone: NgZone,
        private authService: AuthService,
        private router: Router,
        private usernameAuthStrategy: UserNameStrategyService
    ) { }


    ngOnInit() { }

    renderButtonGoogle(button: ElementRef): void {
        this.googleService.renderButton(button);
    }

    handleCredentialResponse(data: IDataLoginStrategy): void {
        // Seteamos la estrategia de login por Google
        this.authService.setStrategy(this.googleAuthStrategy);

        this.subscriptions.add(
            this.authService.signIn(data)
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
                )
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

    login(data: IDataLoginStrategy, control: AbstractControl): void {
        // Seteamos la estrategia de login por usuario
        this.authService.setStrategy(this.usernameAuthStrategy);
        this.subscriptions.add(
            this.authService.signIn(data)
                .subscribe({
                    next: (resp) => {
                        this.validateRememberEmail(control);
                        this.redirectToPath('dashboard');
                    },
                    error: (err) => {
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