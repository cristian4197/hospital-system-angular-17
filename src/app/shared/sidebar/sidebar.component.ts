import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { GoogleService } from '../../services/google.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit{

  private userService = inject(UserService);
  // private googleService = inject(GoogleService);

  public user!: User;

  public menuItem!: any[];

  constructor(private sidebarService: SidebarService, private googleService:GoogleService) {
    this.menuItem = this.sidebarService.menu;
  }

  async ngOnInit(): Promise<void> {
    this.getUser();
    if(localStorage.getItem('isLoggedInGoogle')) {
      await this.googleService.googleInit();
    }
  }

  logout(): void {
    if(localStorage.getItem('isLoggedInGoogle')) {
      
      this.logoutStateGoogle();
    }

    this.userService.logout();   
  }

  private logoutStateGoogle(): void {
    this.googleService.state.subscribe(state => {
      console.log('Holaaaa');
      
      if(state) {
        this.googleService.logout();   
      }
    });
  }

  getUser(): void {
    this.user = this.userService.user;
  }
  
}
