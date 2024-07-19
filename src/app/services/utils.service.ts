import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilService {
  clearTooltip(tooltipElement: HTMLElement | null): void {
    // Encuentra el tooltip por su clase, id u otro selector
    // tooltipElement = document.querySelector('.tooltip'); // Reemplaza '.tu-tooltip-class' con tu selector adecuado
    if (tooltipElement) {
      // Elimina el elemento del DOM
      tooltipElement.remove();
    }
  }

  removeNode(identifier: string): void {
    document.querySelector(identifier)?.remove();
  }

  addClassNode(identifier: string, className: string): void {    
    document.querySelector(identifier)?.classList.add(className);
  }


  loadImageTempPreview(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.readAsDataURL(file);
  
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result);
        } else {
          reject(null);
        }
      };
  
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }
}