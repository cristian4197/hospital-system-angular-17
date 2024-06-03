import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleCredential } from '../enums/google-credential.enum';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleService {
    private state$: BehaviorSubject<boolean>;
   
    constructor() { 
        const savedState = localStorage.getItem('isLoggedInGoogle');        
        this.state$ = new BehaviorSubject<boolean>(savedState === 'true');   
    }

    get state(): Observable<boolean> {
        return this.state$.asObservable();
    }

    // Ejecutar metodo en los componentes que se desee validar si se inicio sesion correctamente
    googleInit(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                google.accounts.id.initialize({
                    client_id: GoogleCredential.ClientId,
                    callback: (response: any) => {
                        if( response && response.credential) {
                            this.setUserGoogleAuthenticathed();
                            resolve(response.credential);
                        } else {
                            reject(new Error('Failed to retrieve Google credential.'));
                        }
                        
                    }
                });
            } catch (error) {
                reject(error);
            }
          
        })
    }

    private setUserGoogleAuthenticathed(): void {
        this.state$.next(true);
        localStorage.setItem('isLoggedInGoogle', 'true');     
    }

    renderButton(button: ElementRef): void {
        google.accounts.id.renderButton(
            button,
            { theme: "outline", size: "large" }  // customization attributes
        );
    }

    logout(): void {
        google.accounts.id.disableAutoSelect();
        localStorage.removeItem('isLoggedInGoogle');  // Remove persisted state
        this.state$.next(false);  // Usuario desautenticado
    }

    revokeSessionGoogle(email: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          google.accounts.id.revoke(email, (resp: any) => {
            if (resp.error) {
              reject(resp.error);
            } else {
              resolve();
            }
          });
        });
    
    }
}