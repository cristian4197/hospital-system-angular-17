import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IncreaserComponent } from '../../components/increaser/increaser.component';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [FormsModule, IncreaserComponent],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export default class ProgressComponent {

  progress1: number = 75;

  progress2: number = 90;

  get getProgress1(): string{
    return `${ this.progress1 }%`;
  }

  get getProgress2(): string{
    return `${ this.progress2 }%`;
  }
}
