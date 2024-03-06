import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-increaser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './increaser.component.html',
  styles: `
    button {
      padding: .5rem .75rem;
    }
  `
})
export class IncreaserComponent implements OnInit {

  ngOnInit(): void {
    this.btnClass = `btn ${ this.btnClass }`;
  }

  @Input( { required: true }) progress: number = 0;

  @Input() btnClass: string = 'btn-primary';

  @Output() valueChangedEmit: EventEmitter<number> = new EventEmitter();

  changeValue(value: number):void {
    
    if (this.progress >= 100 && value >= 0) {
      this.valueChangedEmit.emit(100);
      this.progress = 100;
      return;
    }

    if (this.progress <= 0 && value < 0) {
      this.valueChangedEmit.emit(0);
      this.progress = 0;
      return;
    }

    this.progress = this.progress + value;
    this.valueChangedEmit.emit(this.progress);    
  }

  onChange(newValue: number):void {
    if(newValue >= 100) {
      this.progress = 100;
    } else if(newValue <= 0) {
      this.progress = 0;
    }else {
      this.progress = newValue;
    }
    this.valueChangedEmit.emit(this.progress);  
  }
}
