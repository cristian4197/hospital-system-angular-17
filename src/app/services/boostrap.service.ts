import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class BoostrapService {

  initTooltips(): void {
    // Usar jQuery para inicializar los tooltips
    $('[data-toggle="tooltip"]').tooltip();
  }

  openModal(idModal: string): void {
    // Encuentra el modal y dispare el evento del modal manualmente
    const modal = document.querySelector(idModal);

    if (modal) {
      // Usa jQuery para disparar el modal, si está disponible
      // De lo contrario, usa el método propio del framework que estés utilizando
      $(modal).modal('show');
    }
  }

  closeModal(idModal: string): void {
    const modal = document.querySelector(idModal);
    if (modal) {
      $(modal).modal('hide');
    }
  }
}