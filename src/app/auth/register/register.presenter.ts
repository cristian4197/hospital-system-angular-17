import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Injectable()
export class RegisterPresenter implements OnDestroy {
    private subscriptions: Subscription = new Subscription();
    constructor(
        private userService: UserService,
        private router: Router
    ) { }



  createUser(controls: FormGroup): void {    
    this.subscriptions.add(
        this.userService.createUser(controls.value)
          .subscribe({
            next: (resp) => {
              this.renderSwalAlertSuccess(true);
  
               this.redirectToPath('dashboard');
            },
            error: (err: Error) => {
              this.renderSwalAlertSuccess(false, err);
  
            },
            complete: () => { }
          })
      );
  }
    
  private renderSwalAlertSuccess(isSuccess: boolean, error?: Error): void {
    if(isSuccess) {
      Swal.fire({
        title: 'Felicidades',
        text: 'Registro Exitoso',
        icon: 'success',
        confirmButtonText: 'Ok',
        timer: 2000//Esperamos 2 segundos
      });
      return;
    }

    Swal.fire({
      title: 'Error!',
      text: error?.cause as string,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
    
  }

  private redirectToPath(path: string): void {
    this.router.navigate([`/${path}`]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
 }
    
}