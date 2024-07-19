import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-image.component.html',
  styleUrl: './card-image.component.css'
})
export class CardImageComponent {
  @Input() cardTitle = 'Avatar';

  @Input() cardSubTitle = 'Imagen del avatar';

  @Input() altImage = 'Imagen del avatar';

  @Input() width = '200';

  @Input() height = '200';

  @Input() textButton = 'Cambiar Imagen';

  @Input() imageSrc = '';

  @Output() changeInputEmit = new EventEmitter<Event>();

  @Output() clickEmit = new EventEmitter<void>();

  onChangeInputEvent(event: Event): void {
    this.changeInputEmit.emit(event);
  }

  onClickButton(): void {
    this.clickEmit.emit();
  }
}
