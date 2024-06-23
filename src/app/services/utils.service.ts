import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilService {
    clearTooltip(tooltipElement: HTMLElement | null): void {
        // Encuentra el tooltip por su clase, id u otro selector
        tooltipElement = document.querySelector('.tooltip'); // Reemplaza '.tu-tooltip-class' con tu selector adecuado
        if (tooltipElement) {
            // Elimina el elemento del DOM
            tooltipElement.remove();
        }
    }
}