import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-back-button',
    templateUrl:'./back-button.component.html',
    styleUrls:['./back-button.component.css'],
    standalone: true
})

export class BackButtonComponent {

    @Input() textButton = 'Atrás';

    @Input() imageSource = '../../../../../assets/images/svg/chevron-left-solid.svg';

    @Input() height = 25;

    @Input() width = 25;

    @Output() clickButtonEmit = new EventEmitter<void>();

    onClickButton(): void {
        this.clickButtonEmit.emit();
    }
}