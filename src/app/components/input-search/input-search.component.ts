import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-search',
  standalone: true,
  imports: [],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSearchComponent),
      multi: true,
    }
  ]
})
export class InputSearchComponent implements ControlValueAccessor {
  @Input() placeHolder = '';
  
  // El valor que mantiene el input
  value: string = '';
  // Función que se llamará cuando el valor cambie
  onChange: (value: string) => void = () => { };
  // Función que se llamará cuando el control se toque
  onTouched: () => void = () => { };

  // Indicador para saber si el control está deshabilitado
  isDisabled: boolean = false;

  // Escribe un nuevo valor en el elemento del DOM
  // Se ejecuta para actualizar el valor en este componente, cuando el valor del formulario que lo llama cambia
  writeValue(value: string): void {
    this.value = value;
  }

  // Registra una función que se llamará cuando el valor cambie en el formulario
  // La función registrada se utiliza para propagar el cambio de valor desde el componente personalizado hasta el formulario.
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  // Registra una función que se llamará cuando el control se toque
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Permite a Angular establecer el estado deshabilitado en el control
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }


  // Método para manejar el evento de entrada del usuario
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = target.value;
      this.value = value;
      // Llama a la función registrada en registerOnChange para informar del nuevo valor
      this.onChange(value);
      // Llama a la función registrada en registerOnTouched para marcar el control como tocado
      this.onTouched();
    }
  }
}
