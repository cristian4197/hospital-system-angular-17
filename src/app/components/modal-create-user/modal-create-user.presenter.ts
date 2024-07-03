import { EventEmitter, Injectable, OnInit, Output, OnDestroy } from '@angular/core';
import { BoostrapService } from '../../services/boostrap.service';
import { UtilService } from '../../services/utils.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Injectable()
export class ModalCreateUserPresenter implements OnInit {


  private subscriptions: Subscription = new Subscription();

  constructor(
    private boostrapService: BoostrapService,
    private utilService: UtilService,
    private userService: UserService) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  showModal(idModal: string): void {
    this.boostrapService.openModal(idModal);
  }

  // nodeRemoved es porque el fondo de la modal no se quita solo al redirigir la pagina sin cerra la modal
  closeModal(idModal: string, nodeRemoved: string): void {
    this.boostrapService.closeModal(idModal);
    this.utilService.removeNode(nodeRemoved);
  }

  createUser(controls: FormGroup): void {
    this.subscriptions.add(
      this.userService.createUser(controls.value)
        .subscribe({
          next: (resp) => {
            this.renderSwalAlertSuccess(true);
            this.boostrapService.closeModal('#createUserModal');
          },
          error: (err: Error) => {
            this.renderSwalAlertSuccess(false, err);
          },
          complete: () => { }
        })
    );
  }


  private renderSwalAlertSuccess(isSuccess: boolean, error?: Error): void {
    if (isSuccess) {
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

  OnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}