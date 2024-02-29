import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-page-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './not-page-found.component.html',
  styleUrls: ['./not-page-found.component.css']
})
export default class NotPageFoundComponent {
  public year = new Date().getFullYear();
}
