import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UtilService } from '../../services/utils.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export default class DashboardComponent implements OnInit {
  currentUserSession!: Observable<User>;

  constructor(private userService: UserService, private utilService: UtilService) {  }

  ngOnInit(): void {
    this.setCurrentUserSession();
  }

  setCurrentUserSession(): void {
    this.currentUserSession = this.userService.user;
  }
}
