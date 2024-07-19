import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hospital',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './hospital.component.html',
  styleUrl: './hospital.component.css'
})
export default class HospitalComponent {

}
