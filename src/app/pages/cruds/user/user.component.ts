import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule ,RouterModule],
  templateUrl: './user.component.html',
})
export default class UserComponent {

}
