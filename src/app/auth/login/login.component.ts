import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginForm } from '../../interfaces/login-form';

import Swal from 'sweetalert2';
import { UserGoogle } from '../../models/user.google.model';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  userService = inject(UserService);

  public loginForm = this.fb.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required ]],
    remember: [false]
  });

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  constructor(private fb: FormBuilder,
              private ngZone:NgZone) { }

  ngOnInit(): void {
   this.onRememberEmail();
  }

    
  ngAfterViewInit(): void {
    this.googleInit();
  }

  onRememberEmail(): void {
    const email = localStorage.getItem('email');
    if(email) {
      this.loginForm.get('email')?.setValue(email);
    }
  }


  googleInit(): void {
    google.accounts.id.initialize({
      client_id: "885119507257-a5p2kp2l2o3p3abaceebmm3300olqt81.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    this.userService.loginGoogle(response.credential)
        .subscribe(resp => {
          const { email, name, picture, token } = resp
          const userGoogle: UserGoogle = {
            email,
            name,
            picture,
            token
          }
          
          localStorage.setItem('userGoogle', JSON.stringify(userGoogle));
        //POR alguna extraña razon al usar la libreria de google
        //se ejecuta codigo fuera de la zone de angular lo que ocasiona un
        // comportamiento raro del router, para evitar usar el ngzone
          this.ngZone.run(() => this.router.navigate(['/dashboard']));
        })
  }

  onLogin(): void {
    this.userService.login(this.loginForm.value as LoginForm)
        .subscribe({
          next: (resp) => {
            if(this.loginForm.get('remember')?.value) {
              localStorage.setItem('email', this.loginForm.get('email')?.value as string);
            } else {
              localStorage.removeItem('email');
            }
            
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: err.error.msg,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          },
          complete: () => console.info('complete') 
        })
    
  }
}
